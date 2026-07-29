package com.kapsomoita.church.auth.service;

import com.kapsomoita.church.audit.service.AuditService;
import com.kapsomoita.church.auth.domain.RefreshToken;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.dto.AuthDtos.AuthResponse;
import com.kapsomoita.church.auth.dto.AuthDtos.ChangePasswordRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.CurrentUser;
import com.kapsomoita.church.auth.dto.AuthDtos.LoginRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.UpdateProfileRequest;
import com.kapsomoita.church.auth.repository.RefreshTokenRepository;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.auth.security.JwtService;
import com.kapsomoita.church.auth.security.SecurityUser;
import com.kapsomoita.church.common.exception.Exceptions.AccountDisabledException;
import com.kapsomoita.church.common.exception.Exceptions.AccountLockedException;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.common.exception.Exceptions.UnauthorizedException;
import com.kapsomoita.church.common.web.RequestMetadata;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The authentication lifecycle: sign in, refresh, sign out, password and profile
 * changes.
 *
 * <p>Two properties are load-bearing here:
 *
 * <ol>
 *   <li><strong>Login is indistinguishable on failure.</strong> Unknown email and
 *       wrong password produce the same 401 and take comparable time, so the
 *       endpoint cannot be used to enumerate accounts.
 *   <li><strong>Refresh tokens rotate.</strong> Each refresh revokes the token it
 *       consumed and issues a new one. Presenting an already-rotated token means
 *       it leaked, so the entire token family for that user is revoked.
 * </ol>
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    /**
     * A throwaway BCrypt hash, verified against when the email does not exist so
     * the response time does not reveal whether an account is present.
     */
    private static final String DUMMY_PASSWORD_HASH =
            "$2a$12$C.0Lb2Kj8s.CT5x6cJhY3eL2xLZ1Vv3aVQ9d1t.rSgU8H6yqQ2S1i";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }

    // -----------------------------------------------------------------------
    // Sign in
    // -----------------------------------------------------------------------

    @Transactional
    public AuthResponse login(LoginRequest request, RequestMetadata metadata) {
        String email = request.email().trim().toLowerCase();
        Optional<User> found = userRepository.findByEmailIgnoreCase(email);

        if (found.isEmpty()) {
            // Burn comparable CPU to the real path, then fail identically.
            passwordEncoder.matches(request.password(), DUMMY_PASSWORD_HASH);
            auditService.recordAnonymous(AuditService.LOGIN_FAILED, email, metadata,
                    Map.of("reason", "unknown_email"));
            throw UnauthorizedException.invalidCredentials();
        }

        User user = found.get();

        // Check the lock before the password, so hammering a locked account cannot
        // be used to test passwords against it.
        if (user.isLocked()) {
            long minutesRemaining = Math.max(1,
                    Duration.between(Instant.now(), user.getLockedUntil()).toMinutes());
            auditService.record(AuditService.LOGIN_BLOCKED, user, metadata,
                    Map.of("reason", "locked", "minutesRemaining", minutesRemaining));
            throw new AccountLockedException("Too many failed attempts. Try again in "
                    + minutesRemaining + " minute" + (minutesRemaining == 1 ? "" : "s") + ".");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            user.registerFailedLogin();
            userRepository.save(user);
            auditService.record(AuditService.LOGIN_FAILED, user, metadata,
                    Map.of("reason", "bad_password",
                           "failedAttempts", user.getFailedLoginAttempts(),
                           "lockedOut", user.isLocked()));
            throw UnauthorizedException.invalidCredentials();
        }

        // Password is correct — but a deactivated account still may not sign in.
        // Reported distinctly so staff know to contact an administrator rather
        // than retrying their password.
        if (!user.isActive()) {
            auditService.record(AuditService.LOGIN_BLOCKED, user, metadata,
                    Map.of("reason", "inactive"));
            throw new AccountDisabledException(
                    "This account has been deactivated. Please contact an administrator.");
        }

        user.registerSuccessfulLogin();
        userRepository.save(user);

        AuthResponse response = issueTokens(user, metadata);
        auditService.record(AuditService.LOGIN_SUCCESS, user, metadata,
                Map.of("roles", user.roleNames()));
        log.info("Successful login for {}", user.getEmail());
        return response;
    }

    // -----------------------------------------------------------------------
    // Refresh
    // -----------------------------------------------------------------------

    /**
     * Exchanges a refresh token for a new token pair.
     *
     * <p>Privileges are re-read from the database here, which is what makes a role
     * change take effect within one access-token lifetime rather than requiring
     * the user to sign out.
     */
    @Transactional
    public AuthResponse refresh(String rawRefreshToken, RequestMetadata metadata) {
        UUID userId = jwtService.parseRefreshTokenSubject(rawRefreshToken)
                .orElseThrow(UnauthorizedException::invalidRefreshToken);

        String tokenHash = jwtService.sha256Hex(rawRefreshToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> {
                    // Signature verified but the token is not on record: it was
                    // already pruned, or never issued by us.
                    log.warn("Refresh token not found in store for user {}", userId);
                    return UnauthorizedException.invalidRefreshToken();
                });

        if (stored.isRevoked()) {
            // A revoked token being presented means a copy leaked. Revoke every
            // live session for the account rather than just refusing this call.
            int revoked = refreshTokenRepository.revokeAllForUser(userId, Instant.now());
            auditService.record(AuditService.TOKEN_REUSE_DETECTED, stored.getUser(), metadata,
                    Map.of("revokedSessions", revoked, "tokenId", stored.getId().toString()));
            log.warn("Refresh token reuse detected for user {}; revoked {} session(s)",
                    userId, revoked);
            throw UnauthorizedException.invalidRefreshToken();
        }

        if (stored.isExpired()) {
            throw UnauthorizedException.invalidRefreshToken();
        }

        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(UnauthorizedException::invalidRefreshToken);

        if (!user.canAuthenticate()) {
            refreshTokenRepository.revokeAllForUser(user.getId(), Instant.now());
            throw new AccountDisabledException(
                    "This account is no longer active. Please contact an administrator.");
        }

        // Rotate: mint the replacement first so the old row can point at it.
        JwtService.IssuedRefreshToken issued = jwtService.generateRefreshToken(user.getId());
        RefreshToken replacement = persistRefreshToken(user, issued, metadata);
        stored.revokeAndReplaceWith(replacement);
        refreshTokenRepository.save(stored);

        String accessToken = jwtService.generateAccessToken(SecurityUser.from(user));
        auditService.record(AuditService.TOKEN_REFRESHED, user, metadata, null);

        return AuthResponse.of(accessToken, issued.token(),
                jwtService.accessTokenTtl().toSeconds(), CurrentUser.from(user));
    }

    // -----------------------------------------------------------------------
    // Sign out
    // -----------------------------------------------------------------------

    /**
     * Revokes the presented session, or every session for the user when
     * {@code allDevices} is set.
     *
     * <p>Never throws for an unknown or already-revoked token: logout must be
     * idempotent, and a client trying to clean up a broken session should not be
     * met with an error.
     */
    @Transactional
    public void logout(UUID userId, String rawRefreshToken, boolean allDevices,
                       RequestMetadata metadata) {
        User user = userRepository.findById(userId).orElse(null);

        if (allDevices) {
            int revoked = refreshTokenRepository.revokeAllForUser(userId, Instant.now());
            auditService.record(AuditService.LOGOUT, user, metadata,
                    Map.of("scope", "all_devices", "revokedSessions", revoked));
            return;
        }

        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenRepository.findByTokenHash(jwtService.sha256Hex(rawRefreshToken))
                    .ifPresent(token -> {
                        // Only the owner may revoke a token, so a stolen token cannot
                        // be used to sign someone else out.
                        if (token.getUser().getId().equals(userId)) {
                            token.revoke();
                            refreshTokenRepository.save(token);
                        } else {
                            log.warn("User {} attempted to revoke a token belonging to {}",
                                    userId, token.getUser().getId());
                        }
                    });
        }

        auditService.record(AuditService.LOGOUT, user, metadata, Map.of("scope", "current_session"));
    }

    // -----------------------------------------------------------------------
    // Account self-service
    // -----------------------------------------------------------------------

    @Transactional(readOnly = true)
    public CurrentUser currentUser(UUID userId) {
        return userRepository.findByIdWithRoles(userId)
                .map(CurrentUser::from)
                .orElseThrow(() -> NotFoundException.of("Account", userId));
    }

    /**
     * Changes the password and revokes every other session, so a password change
     * actually evicts an attacker who already holds a refresh token.
     */
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request,
                               RequestMetadata metadata) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> NotFoundException.of("Account", userId));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            auditService.record(AuditService.LOGIN_FAILED, user, metadata,
                    Map.of("reason", "bad_current_password_on_change"));
            throw new UnauthorizedException("Your current password is incorrect.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BadRequestException(
                    "Your new password must be different from your current one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangedAt(Instant.now());
        userRepository.save(user);

        int revoked = refreshTokenRepository.revokeAllForUser(userId, Instant.now());
        auditService.record(AuditService.PASSWORD_CHANGED, user, metadata,
                Map.of("revokedSessions", revoked));
        log.info("Password changed for {}; revoked {} session(s)", user.getEmail(), revoked);
    }

    @Transactional
    public CurrentUser updateProfile(UUID userId, UpdateProfileRequest request,
                                     RequestMetadata metadata) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> NotFoundException.of("Account", userId));

        user.setFullName(request.fullName().trim());
        user.setPhone(blankToNull(request.phone()));
        user.setAvatarUrl(blankToNull(request.avatarUrl()));
        userRepository.save(user);

        auditService.record(AuditService.PROFILE_UPDATED, user, metadata, null);
        return CurrentUser.from(user);
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    /** Issues an access/refresh pair and persists the refresh side. */
    private AuthResponse issueTokens(User user, RequestMetadata metadata) {
        SecurityUser principal = SecurityUser.from(user);
        String accessToken = jwtService.generateAccessToken(principal);

        JwtService.IssuedRefreshToken issued = jwtService.generateRefreshToken(user.getId());
        persistRefreshToken(user, issued, metadata);

        return AuthResponse.of(accessToken, issued.token(),
                jwtService.accessTokenTtl().toSeconds(), CurrentUser.from(user));
    }

    private RefreshToken persistRefreshToken(User user, JwtService.IssuedRefreshToken issued,
                                             RequestMetadata metadata) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(issued.tokenHash());
        // Truncate to whole seconds: Postgres timestamptz keeps microseconds, and
        // the CHECK constraint requires expires_at > created_at, which a
        // sub-second round trip could otherwise violate.
        token.setExpiresAt(issued.expiresAt().truncatedTo(ChronoUnit.SECONDS).plusSeconds(1));
        if (metadata != null) {
            token.setIpAddress(metadata.ipAddress());
            token.setUserAgent(metadata.userAgent());
        }
        return refreshTokenRepository.save(token);
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

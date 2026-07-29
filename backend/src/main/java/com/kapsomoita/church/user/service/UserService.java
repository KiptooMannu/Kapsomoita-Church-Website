package com.kapsomoita.church.user.service;

import com.kapsomoita.church.audit.service.AuditService;
import com.kapsomoita.church.auth.domain.Role;
import com.kapsomoita.church.auth.domain.RoleName;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.repository.RefreshTokenRepository;
import com.kapsomoita.church.auth.repository.RoleRepository;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.ConflictException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.user.dto.UserDtos.CreateUserRequest;
import com.kapsomoita.church.user.dto.UserDtos.ResetUserPasswordRequest;
import com.kapsomoita.church.user.dto.UserDtos.UpdateUserRequest;
import com.kapsomoita.church.user.dto.UserDtos.UpdateUserRolesRequest;
import com.kapsomoita.church.user.dto.UserDtos.UserResponse;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Administrator-facing account management.
 *
 * <p>Three safety rules are enforced throughout, because each protects against a
 * mistake that would lock the church out of its own platform:
 *
 * <ol>
 *   <li>The last remaining Super Admin cannot be deleted, deactivated, or demoted.
 *   <li>No one can deactivate, delete or change the roles of their own account.
 *   <li>Only a Super Admin may grant the Super Admin role (route-level, see
 *       {@code SecurityConfig}).
 * </ol>
 */
@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    // -----------------------------------------------------------------------
    // Reads
    // -----------------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<UserResponse> list(String search, String roleName, Boolean active,
                                   Pageable pageable) {
        return userRepository.search(search, roleName, active, pageable)
                .map(UserResponse::from);
    }

    @Transactional(readOnly = true)
    public UserResponse get(UUID id) {
        return userRepository.findByIdWithRoles(id)
                .map(UserResponse::from)
                .orElseThrow(() -> NotFoundException.of("User", id));
    }

    // -----------------------------------------------------------------------
    // Writes
    // -----------------------------------------------------------------------

    @Transactional
    public UserResponse create(CreateUserRequest request, User actor, RequestMetadata metadata) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account with that email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(blankToNull(request.phone()));
        user.setActive(request.activeOrDefault());
        user.setPasswordChangedAt(Instant.now());
        resolveRoles(request.roles()).forEach(user::addRole);

        User saved = userRepository.save(user);
        auditService.recordResourceChange(AuditService.USER_CREATED, actor, "user", saved.getId(),
                metadata, Map.of("email", saved.getEmail(), "roles", saved.roleNames()));
        log.info("User {} created account {}", actorLabel(actor), saved.getEmail());

        return UserResponse.from(saved);
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request, User actor,
                               RequestMetadata metadata) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> NotFoundException.of("User", id));

        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ConflictException("Another account already uses that email.");
        }

        boolean deactivating = request.active() != null && !request.active() && user.isActive();
        if (deactivating) {
            requireNotSelf(actor, user, "deactivate your own account");
            requireNotLastSuperAdmin(user, "deactivate");
        }

        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPhone(blankToNull(request.phone()));
        user.setAvatarUrl(blankToNull(request.avatarUrl()));
        if (request.active() != null) {
            user.setActive(request.active());
        }

        User saved = userRepository.save(user);

        // A deactivated account must lose its live sessions immediately, otherwise
        // its existing access token keeps working until it expires.
        if (deactivating) {
            int revoked = refreshTokenRepository.revokeAllForUser(id, Instant.now());
            log.info("Deactivated {}; revoked {} session(s)", saved.getEmail(), revoked);
        }

        auditService.recordResourceChange(AuditService.USER_UPDATED, actor, "user", id, metadata,
                Map.of("email", saved.getEmail(), "active", saved.isActive()));

        return UserResponse.from(saved);
    }

    @Transactional
    public UserResponse updateRoles(UUID id, UpdateUserRolesRequest request, User actor,
                                    RequestMetadata metadata) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> NotFoundException.of("User", id));

        // Changing your own roles is how an admin accidentally removes their own
        // access mid-session.
        requireNotSelf(actor, user, "change your own roles");

        Set<Role> resolved = resolveRoles(request.roles());
        boolean losesSuperAdmin = user.hasRole(RoleName.SUPER_ADMIN)
                && resolved.stream().noneMatch(r -> r.getName().equals(RoleName.SUPER_ADMIN.name()));
        if (losesSuperAdmin) {
            requireNotLastSuperAdmin(user, "remove the Super Admin role from");
        }

        Set<String> previousRoles = user.roleNames();
        user.getRoles().clear();
        resolved.forEach(user::addRole);
        User saved = userRepository.save(user);

        auditService.recordResourceChange(AuditService.USER_ROLES_CHANGED, actor, "user", id,
                metadata, Map.of("email", saved.getEmail(),
                        "from", previousRoles, "to", saved.roleNames()));
        log.info("User {} changed roles for {} from {} to {}", actorLabel(actor), saved.getEmail(),
                previousRoles, saved.roleNames());

        return UserResponse.from(saved);
    }

    /** Sets a new password administratively and signs the account out everywhere. */
    @Transactional
    public void resetPassword(UUID id, ResetUserPasswordRequest request, User actor,
                              RequestMetadata metadata) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("User", id));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangedAt(Instant.now());
        // An administrative reset also clears a failed-login lockout, which is the
        // usual reason someone asks for one.
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        int revoked = refreshTokenRepository.revokeAllForUser(id, Instant.now());
        auditService.recordResourceChange(AuditService.PASSWORD_CHANGED, actor, "user", id,
                metadata, Map.of("email", user.getEmail(), "administrative", true,
                        "revokedSessions", revoked));
        log.info("User {} reset the password for {}", actorLabel(actor), user.getEmail());
    }

    /** Clears a failed-login lockout without touching the password. */
    @Transactional
    public UserResponse unlock(UUID id, User actor, RequestMetadata metadata) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> NotFoundException.of("User", id));

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        User saved = userRepository.save(user);

        auditService.recordResourceChange(AuditService.USER_UPDATED, actor, "user", id, metadata,
                Map.of("email", saved.getEmail(), "action", "unlocked"));

        return UserResponse.from(saved);
    }

    @Transactional
    public void delete(UUID id, User actor, RequestMetadata metadata) {
        User user = userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> NotFoundException.of("User", id));

        requireNotSelf(actor, user, "delete your own account");
        requireNotLastSuperAdmin(user, "delete");

        String email = user.getEmail();
        // Cascades clear user_roles and refresh_tokens; audit_logs keep the row with
        // actor_user_id set to NULL and actor_email intact.
        userRepository.delete(user);

        auditService.recordResourceChange(AuditService.USER_DELETED, actor, "user", id, metadata,
                Map.of("email", email));
        log.info("User {} deleted account {}", actorLabel(actor), email);
    }

    // -----------------------------------------------------------------------
    // Guards
    // -----------------------------------------------------------------------

    private Set<Role> resolveRoles(Set<String> roleNames) {
        Set<String> normalised = new LinkedHashSet<>();
        for (String raw : roleNames) {
            RoleName known = RoleName.from(raw).orElseThrow(
                    () -> new BadRequestException("Unknown role: " + raw));
            normalised.add(known.name());
        }

        Set<Role> resolved = new LinkedHashSet<>(roleRepository.findAllByNameIn(normalised));
        if (resolved.size() != normalised.size()) {
            // The enum and the table have diverged — a migration issue, not user error.
            throw new BadRequestException("One or more roles could not be resolved.");
        }
        return resolved;
    }

    private void requireNotSelf(User actor, User target, String action) {
        if (actor != null && actor.getId().equals(target.getId())) {
            throw new BadRequestException("You cannot " + action + ".");
        }
    }

    private void requireNotLastSuperAdmin(User target, String action) {
        if (!target.hasRole(RoleName.SUPER_ADMIN)) {
            return;
        }
        long superAdmins = userRepository.countByRoleName(RoleName.SUPER_ADMIN.name());
        if (superAdmins <= 1) {
            throw new BadRequestException("You cannot " + action
                    + " the only Super Admin. Grant the role to another account first.");
        }
    }

    private static String actorLabel(User actor) {
        return actor == null ? "system" : actor.getEmail();
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

package com.kapsomoita.church.auth.security;

import com.kapsomoita.church.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Issues and verifies the two token types.
 *
 * <p><strong>Access tokens</strong> are short-lived and carry roles and
 * permissions as claims, so authorising a request needs no database round trip.
 * The trade-off is that a permission change only takes effect once the current
 * access token expires (default 15 minutes).
 *
 * <p><strong>Refresh tokens</strong> are long-lived and signed with a
 * <em>different</em> key, which is what stops a refresh token from ever being
 * accepted as an access token. They carry a {@code jti} and are persisted by
 * hash so they can be revoked.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    /** Distinguishes the two token types so they can never be interchanged. */
    private static final String CLAIM_TYPE = "typ";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";

    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_NAME = "name";
    private static final String CLAIM_ROLES = "roles";
    private static final String CLAIM_PERMISSIONS = "perms";

    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final String issuer;
    private final Duration accessTtl;
    private final Duration refreshTtl;

    public JwtService(AppProperties properties) {
        AppProperties.Jwt jwt = properties.jwt();
        this.accessKey = toKey(jwt.accessSecret());
        this.refreshKey = toKey(jwt.refreshSecret());
        this.issuer = jwt.issuer();
        this.accessTtl = Duration.ofSeconds(jwt.accessTtlSeconds());
        this.refreshTtl = Duration.ofSeconds(jwt.refreshTtlSeconds());
    }

    /**
     * Accepts Base64 secrets, falling back to raw UTF-8 bytes so a plain
     * high-entropy passphrase also works. {@code AppProperties} has already
     * rejected anything shorter than 64 bytes.
     */
    private static SecretKey toKey(String secret) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (Exception notBase64) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // -----------------------------------------------------------------------
    // Issuing
    // -----------------------------------------------------------------------

    public String generateAccessToken(SecurityUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(issuer)
                .subject(user.getId().toString())
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessTtl)))
                .claim(CLAIM_TYPE, TYPE_ACCESS)
                .claim(CLAIM_EMAIL, user.getEmail())
                .claim(CLAIM_NAME, user.getFullName())
                .claim(CLAIM_ROLES, List.copyOf(user.getRoleNames()))
                .claim(CLAIM_PERMISSIONS, List.copyOf(user.getPermissionNames()))
                .signWith(accessKey, Jwts.SIG.HS512)
                .compact();
    }

    /**
     * A refresh token carries no roles or permissions — it exists only to prove
     * identity long enough to mint a fresh access token, and privileges are
     * re-read from the database at that moment.
     */
    public IssuedRefreshToken generateRefreshToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(refreshTtl);
        String jti = UUID.randomUUID().toString();

        String token = Jwts.builder()
                .issuer(issuer)
                .subject(userId.toString())
                .id(jti)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim(CLAIM_TYPE, TYPE_REFRESH)
                .signWith(refreshKey, Jwts.SIG.HS512)
                .compact();

        return new IssuedRefreshToken(token, jti, expiresAt, sha256Hex(token));
    }

    // -----------------------------------------------------------------------
    // Verifying
    // -----------------------------------------------------------------------

    /** Returns the authenticated principal, or empty if the token is unusable. */
    public Optional<SecurityUser> parseAccessToken(String token) {
        return parse(token, accessKey, TYPE_ACCESS).map(claims -> SecurityUser.fromClaims(
                UUID.fromString(claims.getSubject()),
                claims.get(CLAIM_EMAIL, String.class),
                claims.get(CLAIM_NAME, String.class),
                stringSet(claims, CLAIM_ROLES),
                stringSet(claims, CLAIM_PERMISSIONS)));
    }

    /** Returns the subject user id, or empty if the refresh token is unusable. */
    public Optional<UUID> parseRefreshTokenSubject(String token) {
        return parse(token, refreshKey, TYPE_REFRESH).map(claims -> {
            try {
                return UUID.fromString(claims.getSubject());
            } catch (IllegalArgumentException malformedSubject) {
                log.warn("Refresh token subject is not a UUID");
                return null;
            }
        });
    }

    private Optional<Claims> parse(String token, SecretKey key, String expectedType) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(issuer)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Belt and braces: the keys already differ, but refusing a mismatched
            // "typ" makes the invariant explicit and survives a key misconfig.
            if (!expectedType.equals(claims.get(CLAIM_TYPE, String.class))) {
                log.warn("Rejected token: expected type '{}' but got '{}'", expectedType,
                        claims.get(CLAIM_TYPE, String.class));
                return Optional.empty();
            }
            return Optional.of(claims);
        } catch (JwtException | IllegalArgumentException invalid) {
            // Expired, tampered, wrong issuer or malformed — all equally unusable.
            log.debug("Rejected token: {}", invalid.getMessage());
            return Optional.empty();
        }
    }

    private static Set<String> stringSet(Claims claims, String claimName) {
        Object raw = claims.get(claimName);
        if (raw instanceof List<?> list) {
            Set<String> values = new LinkedHashSet<>();
            list.forEach(item -> {
                if (item != null) {
                    values.add(item.toString());
                }
            });
            return values;
        }
        return Set.of();
    }

    // -----------------------------------------------------------------------
    // Hashing
    // -----------------------------------------------------------------------

    /**
     * Hex SHA-256, used to store refresh tokens without storing the tokens
     * themselves. A plain digest is correct here (rather than BCrypt) because the
     * input is already 256+ bits of unguessable entropy, and lookups must be
     * indexable.
     */
    public String sha256Hex(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(Character.forDigit((b >> 4) & 0xF, 16));
                hex.append(Character.forDigit(b & 0xF, 16));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException impossible) {
            throw new IllegalStateException("SHA-256 is required by the Java platform", impossible);
        }
    }

    public Duration accessTokenTtl() {
        return accessTtl;
    }

    public Duration refreshTokenTtl() {
        return refreshTtl;
    }

    /**
     * A newly minted refresh token and the metadata needed to persist it.
     *
     * @param token     the raw token, returned to the client and never stored
     * @param jti       unique token id from the JWT
     * @param expiresAt absolute expiry
     * @param tokenHash hex SHA-256 of {@code token}, which is what gets stored
     */
    public record IssuedRefreshToken(String token, String jti, Instant expiresAt, String tokenHash) {
    }
}

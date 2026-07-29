package com.kapsomoita.church.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Strongly typed view of the {@code app.*} configuration tree.
 *
 * <p>Validation is deliberately strict: a missing or too-short JWT secret fails
 * startup rather than silently degrading security at runtime.
 */
@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String apiPrefix,
        Cors cors,
        Jwt jwt,
        Bootstrap bootstrap) {

    public AppProperties {
        if (apiPrefix == null || apiPrefix.isBlank()) {
            apiPrefix = "/api";
        }
    }

    /** Origins permitted to call the API from a browser. */
    public record Cors(List<String> allowedOrigins) {

        public Cors {
            allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
        }
    }

    /**
     * Access tokens are short-lived and stateless. Refresh tokens are long-lived
     * and persisted so they can be revoked (logout, password change, admin
     * lockout), which stateless JWTs alone cannot support.
     */
    public record Jwt(
            @NotBlank String issuer,
            @NotBlank String accessSecret,
            @NotBlank String refreshSecret,
            @Min(60) long accessTtlSeconds,
            @Min(300) long refreshTtlSeconds) {

        /**
         * HS512 requires a key of at least 512 bits. Secrets are supplied as
         * Base64 in the environment; anything shorter is a misconfiguration we
         * refuse to boot with.
         */
        public Jwt {
            requireStrongSecret(accessSecret, "app.jwt.access-secret");
            requireStrongSecret(refreshSecret, "app.jwt.refresh-secret");
            if (accessSecret.equals(refreshSecret)) {
                throw new IllegalStateException(
                        "app.jwt.access-secret and app.jwt.refresh-secret must be different, "
                                + "otherwise a refresh token would be accepted as an access token.");
            }
        }

        private static void requireStrongSecret(String secret, String name) {
            if (secret == null || secret.isBlank()) {
                throw new IllegalStateException(name + " must be set (see backend/.env.example)");
            }
            int decodedBytes;
            try {
                decodedBytes = java.util.Base64.getDecoder().decode(secret).length;
            } catch (IllegalArgumentException notBase64) {
                decodedBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8).length;
            }
            if (decodedBytes < 64) {
                throw new IllegalStateException(
                        name + " must decode to at least 64 bytes for HS512 (got " + decodedBytes
                                + "). Generate one with: node -e \"console.log("
                                + "require('crypto').randomBytes(64).toString('base64'))\"");
            }
        }
    }

    /**
     * First-run super admin. Applied only when no SUPER_ADMIN account exists, so
     * changing these values later never resurrects or overwrites an account.
     */
    public record Bootstrap(String adminEmail, String adminPassword, String adminName) {

        public boolean isConfigured() {
            return adminEmail != null && !adminEmail.isBlank()
                    && adminPassword != null && !adminPassword.isBlank();
        }
    }
}

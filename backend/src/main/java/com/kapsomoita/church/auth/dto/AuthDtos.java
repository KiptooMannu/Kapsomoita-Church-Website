package com.kapsomoita.church.auth.dto;

import com.kapsomoita.church.auth.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Request and response payloads for the authentication endpoints.
 *
 * <p>Grouped in one file because they form a single contract that is easier to
 * review together than spread across a dozen tiny files. No DTO here ever
 * carries a password hash.
 */
public final class AuthDtos {

    private AuthDtos() {
    }

    /** Shared password policy, applied anywhere a new password is accepted. */
    public static final int PASSWORD_MIN_LENGTH = 10;
    public static final String PASSWORD_PATTERN =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{" + PASSWORD_MIN_LENGTH + ",128}$";
    public static final String PASSWORD_MESSAGE =
            "Password must be at least " + PASSWORD_MIN_LENGTH
                    + " characters and include an uppercase letter, a lowercase letter and a number.";

    // -----------------------------------------------------------------------
    // Requests
    // -----------------------------------------------------------------------

    /**
     * Sign-in credentials.
     *
     * <p>The password is only length-bounded here — applying the strength pattern
     * would reject legitimate attempts by users whose password predates a policy
     * change, and would leak the policy to anyone probing the endpoint.
     */
    public record LoginRequest(
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            @Size(max = 255)
            String email,

            @NotBlank(message = "Password is required.")
            @Size(max = 128, message = "Password is too long.")
            String password) {
    }

    public record RefreshRequest(
            @NotBlank(message = "A refresh token is required.")
            String refreshToken) {
    }

    /** Logout. A null token means "this session only"; see {@code allDevices}. */
    public record LogoutRequest(String refreshToken, boolean allDevices) {
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Your current password is required.")
            String currentPassword,

            @NotBlank(message = "A new password is required.")
            @Pattern(regexp = PASSWORD_PATTERN, message = PASSWORD_MESSAGE)
            String newPassword) {
    }

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            String email) {
    }

    public record ResetPasswordRequest(
            @NotBlank(message = "A reset token is required.")
            String token,

            @NotBlank(message = "A new password is required.")
            @Pattern(regexp = PASSWORD_PATTERN, message = PASSWORD_MESSAGE)
            String newPassword) {
    }

    public record UpdateProfileRequest(
            @NotBlank(message = "Full name is required.")
            @Size(max = 180, message = "Full name is too long.")
            String fullName,

            @Size(max = 32, message = "Phone number is too long.")
            String phone,

            @Size(max = 512)
            String avatarUrl) {
    }

    // -----------------------------------------------------------------------
    // Responses
    // -----------------------------------------------------------------------

    /**
     * The authenticated session.
     *
     * @param accessToken       short-lived bearer token for API calls
     * @param refreshToken      long-lived token used to mint new access tokens
     * @param expiresInSeconds  access token lifetime, so the client can refresh
     *                          proactively rather than waiting for a 401
     */
    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            long expiresInSeconds,
            CurrentUser user) {

        public static AuthResponse of(String accessToken, String refreshToken,
                                      long expiresInSeconds, CurrentUser user) {
            return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInSeconds, user);
        }
    }

    /**
     * The signed-in account as the admin UI needs it: identity plus the flattened
     * role and permission sets that drive menu visibility and button states.
     */
    public record CurrentUser(
            UUID id,
            String email,
            String fullName,
            String phone,
            String avatarUrl,
            boolean active,
            Set<String> roles,
            Set<String> permissions,
            Instant lastLoginAt,
            Instant createdAt) {

        public static CurrentUser from(User user) {
            return new CurrentUser(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getAvatarUrl(),
                    user.isActive(),
                    user.roleNames(),
                    user.permissionNames(),
                    user.getLastLoginAt(),
                    user.getCreatedAt());
        }
    }

    /** Generic acknowledgement for endpoints with nothing to return. */
    public record MessageResponse(String message) {

        public static MessageResponse of(String message) {
            return new MessageResponse(message);
        }
    }
}

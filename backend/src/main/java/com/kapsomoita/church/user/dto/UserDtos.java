package com.kapsomoita.church.user.dto;

import com.kapsomoita.church.auth.domain.Permission;
import com.kapsomoita.church.auth.domain.Role;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.dto.AuthDtos;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/** Payloads for administrator-driven user and role management. */
public final class UserDtos {

    private UserDtos() {
    }

    // -----------------------------------------------------------------------
    // Requests
    // -----------------------------------------------------------------------

    /**
     * Creates a staff account.
     *
     * <p>The password is set by the administrator rather than emailed as an invite
     * link; invite flows arrive with the notification slice.
     */
    public record CreateUserRequest(
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            @Size(max = 255)
            String email,

            @NotBlank(message = "Full name is required.")
            @Size(max = 180, message = "Full name is too long.")
            String fullName,

            @NotBlank(message = "A password is required.")
            @Pattern(regexp = AuthDtos.PASSWORD_PATTERN, message = AuthDtos.PASSWORD_MESSAGE)
            String password,

            @Size(max = 32, message = "Phone number is too long.")
            String phone,

            @NotEmpty(message = "Assign at least one role.")
            Set<String> roles,

            Boolean active) {

        public boolean activeOrDefault() {
            return active == null || active;
        }
    }

    /**
     * Updates an account. Roles are omitted deliberately — they change through a
     * dedicated endpoint so role edits are separately permissioned and audited.
     */
    public record UpdateUserRequest(
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            @Size(max = 255)
            String email,

            @NotBlank(message = "Full name is required.")
            @Size(max = 180, message = "Full name is too long.")
            String fullName,

            @Size(max = 32, message = "Phone number is too long.")
            String phone,

            @Size(max = 512)
            String avatarUrl,

            Boolean active) {
    }

    public record UpdateUserRolesRequest(
            @NotEmpty(message = "Assign at least one role.")
            Set<String> roles) {
    }

    /** Administrative password reset; the target user is signed out everywhere. */
    public record ResetUserPasswordRequest(
            @NotBlank(message = "A new password is required.")
            @Pattern(regexp = AuthDtos.PASSWORD_PATTERN, message = AuthDtos.PASSWORD_MESSAGE)
            String newPassword) {
    }

    // -----------------------------------------------------------------------
    // Responses
    // -----------------------------------------------------------------------

    /** A user as shown in admin lists and detail views. Never includes the hash. */
    public record UserResponse(
            UUID id,
            String email,
            String fullName,
            String phone,
            String avatarUrl,
            boolean active,
            boolean locked,
            Set<String> roles,
            Instant lastLoginAt,
            Instant createdAt,
            Instant updatedAt) {

        public static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getAvatarUrl(),
                    user.isActive(),
                    user.isLocked(),
                    user.roleNames(),
                    user.getLastLoginAt(),
                    user.getCreatedAt(),
                    user.getUpdatedAt());
        }
    }

    /** A role plus its grants, used to render the permission matrix. */
    public record RoleResponse(
            UUID id,
            String name,
            String displayName,
            String description,
            boolean system,
            Set<String> permissions,
            long userCount) {

        public static RoleResponse from(Role role, long userCount) {
            return new RoleResponse(
                    role.getId(),
                    role.getName(),
                    role.getDisplayName(),
                    role.getDescription(),
                    role.isSystem(),
                    role.getPermissions().stream()
                            .map(Permission::getName)
                            .collect(Collectors.toCollection(java.util.LinkedHashSet::new)),
                    userCount);
        }
    }

    public record PermissionResponse(UUID id, String name, String resource, String action,
                                     String description) {

        public static PermissionResponse from(Permission permission) {
            return new PermissionResponse(
                    permission.getId(),
                    permission.getName(),
                    permission.getResource(),
                    permission.getAction(),
                    permission.getDescription());
        }
    }

    /**
     * A page of results in a shape the frontend can consume directly, rather than
     * Spring's {@code Page} JSON, whose structure is not part of a stable contract.
     *
     * @param page zero-based page index
     */
    public record PageResponse<T>(
            List<T> content,
            int page,
            int size,
            long totalElements,
            int totalPages,
            boolean first,
            boolean last) {

        public static <T> PageResponse<T> from(org.springframework.data.domain.Page<T> page) {
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast());
        }
    }
}

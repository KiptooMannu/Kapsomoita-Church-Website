package com.kapsomoita.church.auth.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A staff or administrator account.
 *
 * <p>Emails are normalised to lower case before persisting so they match the
 * {@code ux_users_email_lower} functional index in every direction.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    /** Consecutive failures tolerated before the account is temporarily locked. */
    public static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;

    /** How long an account stays locked once the threshold is crossed. */
    public static final java.time.Duration LOCKOUT_DURATION = java.time.Duration.ofMinutes(15);

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    /** BCrypt hash. Never exposed through any DTO. */
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 180)
    private String fullName;

    @Column(name = "phone", length = 32)
    private String phone;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "email_verified_at")
    private Instant emailVerifiedAt;

    @Column(name = "password_changed_at", nullable = false)
    private Instant passwordChangedAt = Instant.now();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new LinkedHashSet<>();

    // -----------------------------------------------------------------------
    // Normalisation
    // -----------------------------------------------------------------------

    /** Lower-cases and trims, keeping the stored value aligned with the unique index. */
    public void setEmail(String email) {
        this.email = email == null ? null : email.trim().toLowerCase();
    }

    // -----------------------------------------------------------------------
    // Roles and permissions
    // -----------------------------------------------------------------------

    public void addRole(Role role) {
        roles.add(role);
    }

    public void removeRole(Role role) {
        roles.remove(role);
    }

    public boolean hasRole(RoleName roleName) {
        return roles.stream().anyMatch(r -> r.getName().equals(roleName.name()));
    }

    public Set<String> roleNames() {
        return roles.stream().map(Role::getName).collect(Collectors.toCollection(LinkedHashSet::new));
    }

    /** Flattened, de-duplicated {@code resource:action} grants across all roles. */
    public Set<String> permissionNames() {
        return roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // -----------------------------------------------------------------------
    // Lockout state
    // -----------------------------------------------------------------------

    /** True while a failed-login lockout is still in force. */
    public boolean isLocked() {
        return lockedUntil != null && lockedUntil.isAfter(Instant.now());
    }

    /**
     * Records a failed sign-in, locking the account once the threshold is hit.
     * Throttling is applied per account to blunt credential-stuffing attempts.
     */
    public void registerFailedLogin() {
        failedLoginAttempts++;
        if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
            lockedUntil = Instant.now().plus(LOCKOUT_DURATION);
            failedLoginAttempts = 0;
        }
    }

    /** Clears throttling state and stamps the successful sign-in. */
    public void registerSuccessfulLogin() {
        failedLoginAttempts = 0;
        lockedUntil = null;
        lastLoginAt = Instant.now();
    }

    /** True when the account may authenticate at all. */
    public boolean canAuthenticate() {
        return active && !isLocked();
    }

    @Override
    public String toString() {
        return "User(" + email + ")";
    }
}

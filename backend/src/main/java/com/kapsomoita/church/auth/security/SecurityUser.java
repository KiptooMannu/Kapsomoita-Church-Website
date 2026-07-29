package com.kapsomoita.church.auth.security;

import com.kapsomoita.church.auth.domain.RoleName;
import com.kapsomoita.church.auth.domain.User;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Adapts a {@link User} to Spring Security.
 *
 * <p>Two kinds of authority are granted: roles as {@code ROLE_PASTOR} (so
 * {@code hasRole('PASTOR')} works) and permissions verbatim as
 * {@code gallery:create} (so {@code hasAuthority('gallery:create')} works).
 * Keeping both means coarse route guards and fine-grained method guards can
 * coexist without a second lookup.
 *
 * <p>The wrapped entity is detached — it is rebuilt from the JWT on each request
 * rather than reloaded — so it must not be used for lazy navigation.
 */
public class SecurityUser implements UserDetails {

    private final UUID id;
    private final String email;
    private final String fullName;
    private final String passwordHash;
    private final boolean active;
    private final boolean locked;
    private final Set<String> roleNames;
    private final Set<String> permissionNames;
    private final Collection<GrantedAuthority> authorities;

    public SecurityUser(UUID id,
                        String email,
                        String fullName,
                        String passwordHash,
                        boolean active,
                        boolean locked,
                        Set<String> roleNames,
                        Set<String> permissionNames) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.passwordHash = passwordHash;
        this.active = active;
        this.locked = locked;
        this.roleNames = Set.copyOf(roleNames);
        this.permissionNames = Set.copyOf(permissionNames);

        Collection<GrantedAuthority> granted = new LinkedHashSet<>();
        roleNames.forEach(role -> granted.add(
                new SimpleGrantedAuthority(RoleName.AUTHORITY_PREFIX + role)));
        permissionNames.forEach(permission -> granted.add(new SimpleGrantedAuthority(permission)));
        this.authorities = Set.copyOf(granted);
    }

    /** Builds from a freshly loaded entity, e.g. during the login flow. */
    public static SecurityUser from(User user) {
        return new SecurityUser(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPasswordHash(),
                user.isActive(),
                user.isLocked(),
                user.roleNames(),
                user.permissionNames());
    }

    /** Builds from JWT claims, avoiding a database hit on every request. */
    public static SecurityUser fromClaims(UUID id,
                                          String email,
                                          String fullName,
                                          Set<String> roleNames,
                                          Set<String> permissionNames) {
        return new SecurityUser(id, email, fullName, null, true, false, roleNames, permissionNames);
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public Set<String> getRoleNames() {
        return roleNames;
    }

    public Set<String> getPermissionNames() {
        return permissionNames;
    }

    public boolean isSuperAdmin() {
        return roleNames.contains(RoleName.SUPER_ADMIN.name());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

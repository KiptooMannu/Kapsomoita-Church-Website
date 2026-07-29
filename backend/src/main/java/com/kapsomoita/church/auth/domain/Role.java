package com.kapsomoita.church.auth.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A named bundle of {@link Permission}s.
 *
 * <p>Permissions are fetched eagerly: a role's grants are needed on every
 * authenticated request to build the security context, so lazy loading would
 * only add an extra query per request.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role extends BaseEntity {

    @Column(name = "name", nullable = false, length = 64, unique = true)
    private String name;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(name = "description", length = 500)
    private String description;

    /** System roles ship with the product and may not be renamed or deleted. */
    @Column(name = "is_system", nullable = false)
    private boolean system = true;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private Set<Permission> permissions = new LinkedHashSet<>();

    public RoleName roleName() {
        return RoleName.from(name).orElseThrow(
                () -> new IllegalStateException("Unknown role in database: " + name));
    }

    public void addPermission(Permission permission) {
        permissions.add(permission);
    }

    public void removePermission(Permission permission) {
        permissions.remove(permission);
    }

    @Override
    public String toString() {
        return name;
    }
}

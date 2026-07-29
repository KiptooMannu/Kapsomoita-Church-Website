package com.kapsomoita.church.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * An atomic {@code resource:action} capability, e.g. {@code gallery:create}.
 *
 * <p>Rows are seeded by migration V1. Permissions are referenced in
 * {@code @PreAuthorize} expressions as authorities, so they are granted to a
 * security context verbatim (no {@code ROLE_} prefix) — which is exactly what
 * distinguishes them from roles.
 */
@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 96, unique = true)
    private String name;

    @Column(name = "resource", nullable = false, length = 48)
    private String resource;

    @Column(name = "action", nullable = false, length = 32)
    private String action;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false,
            insertable = false)
    private Instant createdAt;

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Permission that)) {
            return false;
        }
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id == null ? 31 : id.hashCode();
    }

    @Override
    public String toString() {
        return name;
    }
}

package com.kapsomoita.church.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Shared identity and timestamp columns for mutable entities.
 *
 * <p>Equality is based on the primary key only, and a null id is never equal to
 * anything — including another null id. Comparing unsaved entities by field
 * would break {@code Set} semantics for lazily-loaded associations.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof BaseEntity that)) {
            return false;
        }
        // Hibernate proxies subclass the entity, so compare by effective class.
        if (!getClass().isAssignableFrom(other.getClass())
                && !other.getClass().isAssignableFrom(getClass())) {
            return false;
        }
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        // Constant for unsaved instances so an entity's hash never changes when
        // it gains an id after being added to a collection.
        return id == null ? 31 : id.hashCode();
    }
}

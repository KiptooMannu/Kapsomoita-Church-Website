package com.kapsomoita.church.audit.domain;

import com.kapsomoita.church.auth.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.type.SqlTypes;

/**
 * An immutable record of a privileged action.
 *
 * <p>{@code actorEmail} is denormalised alongside the FK because audit trails
 * must remain readable after the acting user is deleted (the FK is
 * {@code ON DELETE SET NULL}).
 */
@Entity
@Table(name = "audit_logs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id")
    private User actor;

    @Column(name = "actor_email", length = 255)
    private String actorEmail;

    /** Dotted action key, e.g. {@code auth.login.success} or {@code gallery.item.deleted}. */
    @Column(name = "action", nullable = false, length = 96)
    private String action;

    @Column(name = "resource_type", length = 64)
    private String resourceType;

    @Column(name = "resource_id", length = 64)
    private String resourceId;

    /** Free-form JSON context. Must never contain passwords or raw tokens. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "details")
    private String details;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 400)
    private String userAgent;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

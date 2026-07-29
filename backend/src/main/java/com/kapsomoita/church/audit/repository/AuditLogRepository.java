package com.kapsomoita.church.audit.repository;

import com.kapsomoita.church.audit.domain.AuditLog;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    /** Filtered, paged audit trail for the admin dashboard. */
    @Query("""
            SELECT a FROM AuditLog a
            WHERE (:action IS NULL OR :action = '' OR a.action LIKE CONCAT(:action, '%'))
              AND (:actorId IS NULL OR a.actor.id = :actorId)
              AND a.createdAt >= COALESCE(:from, a.createdAt)
              AND a.createdAt <= COALESCE(:to, a.createdAt)
            ORDER BY a.createdAt DESC
            """)
    Page<AuditLog> search(@Param("action") String actionPrefix,
                          @Param("actorId") UUID actorId,
                          @Param("from") Instant from,
                          @Param("to") Instant to,
                          Pageable pageable);

    long countByCreatedAtAfter(Instant since);
}

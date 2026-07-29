package com.kapsomoita.church.dashboard.web;

import com.kapsomoita.church.audit.domain.AuditLog;
import com.kapsomoita.church.audit.repository.AuditLogRepository;
import com.kapsomoita.church.auth.repository.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Aggregates for the admin dashboard.
 *
 * <p>Only the metrics whose tables exist today are reported. As each content slice
 * lands (gallery, sermons, events, …) its count is added here rather than being
 * faked now — a tile showing a hardcoded zero is worse than no tile, because it
 * looks like real data.
 */
@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardController(UserRepository userRepository,
                               AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('dashboard:read')")
    @Transactional(readOnly = true)
    public ResponseEntity<DashboardStats> stats() {
        Instant last24Hours = Instant.now().minus(24, ChronoUnit.HOURS);

        return ResponseEntity.ok(new DashboardStats(
                userRepository.count(),
                userRepository.countByActiveTrue(),
                auditLogRepository.count(),
                auditLogRepository.countByCreatedAtAfter(last24Hours)));
    }

    /** Most recent audit entries, for the "Recent Activity" panel. */
    @GetMapping("/activity")
    @PreAuthorize("hasAuthority('audit_log:read')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ActivityEntry>> recentActivity(
            @RequestParam(defaultValue = "15") int limit) {

        int capped = Math.clamp(limit, 1, 50);
        List<ActivityEntry> entries = auditLogRepository
                .search(null, null, null, null, PageRequest.of(0, capped))
                .map(ActivityEntry::from)
                .getContent();

        return ResponseEntity.ok(entries);
    }

    /**
     * @param totalUsers      all staff accounts
     * @param activeUsers     accounts that may currently sign in
     * @param totalAuditEvents lifetime audit entries
     * @param auditEventsLast24h audit entries in the last 24 hours
     */
    public record DashboardStats(
            long totalUsers,
            long activeUsers,
            long totalAuditEvents,
            long auditEventsLast24h) {
    }

    public record ActivityEntry(
            UUID id,
            String action,
            String actorEmail,
            String resourceType,
            String resourceId,
            String ipAddress,
            Instant createdAt) {

        static ActivityEntry from(AuditLog entry) {
            return new ActivityEntry(
                    entry.getId(),
                    entry.getAction(),
                    entry.getActorEmail(),
                    entry.getResourceType(),
                    entry.getResourceId(),
                    entry.getIpAddress(),
                    entry.getCreatedAt());
        }
    }
}

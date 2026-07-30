package com.kapsomoita.church.audit.web;

import com.kapsomoita.church.audit.dto.AuditLogResponse;
import com.kapsomoita.church.audit.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for querying administrative audit logs. */
@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditLogController {

    private final AuditService auditService;

    public AdminAuditLogController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('audit:read') or hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public Page<AuditLogResponse> listAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            Pageable pageable) {
        return auditService.listLogs(search, action, pageable);
    }
}

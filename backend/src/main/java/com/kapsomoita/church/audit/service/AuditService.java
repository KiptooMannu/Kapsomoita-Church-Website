package com.kapsomoita.church.audit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kapsomoita.church.audit.domain.AuditLog;
import com.kapsomoita.church.audit.repository.AuditLogRepository;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.web.RequestMetadata;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Writes the audit trail.
 *
 * <p>Every method runs in its own transaction ({@code REQUIRES_NEW}) and swallows
 * its own failures. Audit logging must never be the reason a login succeeds but
 * the response fails, nor may a rolled-back business transaction erase the record
 * that someone attempted the action.
 */
@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    // --- Action keys ------------------------------------------------------
    public static final String LOGIN_SUCCESS = "auth.login.success";
    public static final String LOGIN_FAILED = "auth.login.failed";
    public static final String LOGIN_BLOCKED = "auth.login.blocked";
    public static final String LOGOUT = "auth.logout";
    public static final String TOKEN_REFRESHED = "auth.token.refreshed";
    public static final String TOKEN_REUSE_DETECTED = "auth.token.reuse_detected";
    public static final String PASSWORD_CHANGED = "auth.password.changed";
    public static final String PROFILE_UPDATED = "auth.profile.updated";
    public static final String USER_CREATED = "user.created";
    public static final String USER_UPDATED = "user.updated";
    public static final String USER_DELETED = "user.deleted";
    public static final String USER_ROLES_CHANGED = "user.roles.changed";

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    /** Records an action attributed to a known account. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, User actor, RequestMetadata metadata, Map<String, ?> details) {
        write(action, actor, actor == null ? null : actor.getEmail(), null, null, metadata, details);
    }

    /**
     * Records an action for an unresolved actor — a failed login against an email
     * that may not exist. The email is still worth capturing for abuse analysis.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordAnonymous(String action, String actorEmail, RequestMetadata metadata,
                                Map<String, ?> details) {
        write(action, null, actorEmail, null, null, metadata, details);
    }

    /** Records a change to a specific resource. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordResourceChange(String action, User actor, String resourceType,
                                     UUID resourceId, RequestMetadata metadata,
                                     Map<String, ?> details) {
        write(action, actor, actor == null ? null : actor.getEmail(), resourceType,
                resourceId == null ? null : resourceId.toString(), metadata, details);
    }

    private void write(String action, User actor, String actorEmail, String resourceType,
                       String resourceId, RequestMetadata metadata, Map<String, ?> details) {
        try {
            AuditLog entry = new AuditLog();
            entry.setAction(action);
            entry.setActor(actor);
            entry.setActorEmail(actorEmail);
            entry.setResourceType(resourceType);
            entry.setResourceId(resourceId);
            entry.setDetails(serialise(details));
            if (metadata != null) {
                entry.setIpAddress(metadata.ipAddress());
                entry.setUserAgent(metadata.userAgent());
            }
            auditLogRepository.save(entry);
        } catch (Exception failure) {
            // Deliberately swallowed: see the class comment.
            log.error("Failed to write audit entry for action '{}'", action, failure);
        }
    }

    private String serialise(Map<String, ?> details) {
        if (details == null || details.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException notSerialisable) {
            log.warn("Audit details could not be serialised to JSON", notSerialisable);
            return null;
        }
    }
}

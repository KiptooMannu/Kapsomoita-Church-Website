package com.kapsomoita.church.ministry.web;

import com.kapsomoita.church.auth.security.SecurityUser;
import com.kapsomoita.church.common.web.ActorResolver;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ApplicationResponse;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ApplicationStats;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ReviewApplicationRequest;
import com.kapsomoita.church.ministry.service.MinistryApplicationService;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Staff review of ministry applications.
 *
 * <p>Applications contain names, phone numbers, occupations and prayer requests, so
 * every endpoint here requires the {@code ministry_application:*} permissions —
 * which, per the seed data in V1, means Pastor, Secretary and Super Admin. An Editor
 * or Volunteer cannot reach them.
 */
@RestController
@RequestMapping("/api/admin/ministry-applications")
@Validated
public class AdminMinistryApplicationController {

    /** Whitelisted sort fields, so a client cannot sort by an arbitrary column. */
    private static final Set<String> SORTABLE_FIELDS =
            Set.of("createdAt", "fullName", "status", "reviewedAt", "ministryName");

    private final MinistryApplicationService applicationService;
    private final ActorResolver actorResolver;

    public AdminMinistryApplicationController(MinistryApplicationService applicationService,
                                              ActorResolver actorResolver) {
        this.applicationService = applicationService;
        this.actorResolver = actorResolver;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ministry_application:read')")
    public ResponseEntity<PageResponse<ApplicationResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ministry,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        String sortField = SORTABLE_FIELDS.contains(sort) ? sort : "createdAt";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        return ResponseEntity.ok(PageResponse.from(applicationService.list(
                status, ministry, search,
                PageRequest.of(page, size, Sort.by(sortDirection, sortField)))));
    }

    /** Counts per status, for the queue header. */
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ministry_application:read')")
    public ResponseEntity<ApplicationStats> stats() {
        return ResponseEntity.ok(applicationService.stats());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ministry_application:read')")
    public ResponseEntity<ApplicationResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(applicationService.get(id));
    }

    /** Approves, rejects or archives an application, and optionally assigns a leader. */
    @PutMapping("/{id}/review")
    @PreAuthorize("hasAuthority('ministry_application:update')")
    public ResponseEntity<ApplicationResponse> review(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewApplicationRequest request,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(applicationService.review(id, request,
                actorResolver.resolve(principal), RequestMetadata.from(httpRequest)));
    }

    /**
     * CSV export of the queue.
     *
     * <p>A UTF-8 byte-order mark is prepended: without it Excel on Windows reads the
     * file as the system codepage and mangles any non-ASCII character in a name.
     */
    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ministry_application:export')")
    public ResponseEntity<byte[]> export(@RequestParam(required = false) String status) {
        String csv = applicationService.exportCsv(status);

        byte[] bom = {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
        byte[] body = csv.getBytes(StandardCharsets.UTF_8);
        byte[] withBom = new byte[bom.length + body.length];
        System.arraycopy(bom, 0, withBom, 0, bom.length);
        System.arraycopy(body, 0, withBom, bom.length, body.length);

        String filename = "ministry-applications"
                + (status == null || status.isBlank() ? "" : "-" + status.toLowerCase())
                + ".csv";

        return ResponseEntity.ok()
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .body(withBom);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ministry_application:delete')")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                       @AuthenticationPrincipal SecurityUser principal,
                                       HttpServletRequest httpRequest) {

        applicationService.delete(id, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));
        return ResponseEntity.noContent().build();
    }
}

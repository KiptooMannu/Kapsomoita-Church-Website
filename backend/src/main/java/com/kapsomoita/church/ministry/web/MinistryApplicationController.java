package com.kapsomoita.church.ministry.web;

import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.ministry.domain.MinistryApplication;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.SubmitApplicationRequest;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.SubmitApplicationResponse;
import com.kapsomoita.church.ministry.service.MinistryApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public endpoint for joining a ministry.
 *
 * <p>Unauthenticated by design — anyone visiting a ministry page can apply.
 * {@code SecurityConfig} already permits {@code POST /api/ministry-applications}.
 *
 * <p>Kept separate from the admin controller so the public surface is exactly one
 * method. Sharing a controller would put a submission endpoint next to the endpoints
 * that read every applicant's personal details, where a single mistaken mapping
 * exposes the queue.
 */
@RestController
@RequestMapping("/api/ministry-applications")
public class MinistryApplicationController {

    private final MinistryApplicationService applicationService;

    public MinistryApplicationController(MinistryApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Submits an application.
     *
     * <p>Returns only a reference and a confirmation message. A repeat submission
     * within 24 hours resolves to the original rather than creating a duplicate, so
     * the response is identical either way and a double-click is harmless.
     */
    @PostMapping
    public ResponseEntity<SubmitApplicationResponse> submit(
            @Valid @RequestBody SubmitApplicationRequest request,
            HttpServletRequest httpRequest) {

        MinistryApplication saved =
                applicationService.submit(request, RequestMetadata.from(httpRequest));

        return ResponseEntity.status(HttpStatus.CREATED).body(
                SubmitApplicationResponse.of(saved.getId(), saved.getMinistryName()));
    }
}

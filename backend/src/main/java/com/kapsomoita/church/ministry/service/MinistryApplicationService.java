package com.kapsomoita.church.ministry.service;

import com.kapsomoita.church.audit.service.AuditService;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.AgeGroup;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.ApplicationStatus;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.Gender;
import com.kapsomoita.church.ministry.domain.MinistryApplication;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ApplicationResponse;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ApplicationStats;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.ReviewApplicationRequest;
import com.kapsomoita.church.ministry.dto.MinistryApplicationDtos.SubmitApplicationRequest;
import com.kapsomoita.church.ministry.repository.MinistryApplicationRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles ministry applications: public submission and staff review.
 *
 * <p>The ministry catalogue lives in the frontend config today, so this service
 * validates the submitted slug against {@link MinistryCatalogue} rather than a
 * database table. That keeps a visitor from filing an application against a ministry
 * that does not exist, which would otherwise sit invisibly in the queue forever.
 */
@Service
public class MinistryApplicationService {

    private static final Logger log = LoggerFactory.getLogger(MinistryApplicationService.class);

    /**
     * Window in which a repeat submission is treated as an accident.
     *
     * <p>Long enough to catch a double-click or an impatient retry, short enough that
     * someone genuinely reapplying next term is not blocked.
     */
    private static final Duration DUPLICATE_WINDOW = Duration.ofHours(24);

    private final MinistryApplicationRepository repository;
    private final AuditService auditService;

    public MinistryApplicationService(MinistryApplicationRepository repository,
                                      AuditService auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }

    // -----------------------------------------------------------------------
    // Public submission
    // -----------------------------------------------------------------------

    @Transactional
    public MinistryApplication submit(SubmitApplicationRequest request,
                                      RequestMetadata metadata) {

        MinistryCatalogue.Ministry ministry = MinistryCatalogue.find(request.ministrySlug())
                .orElseThrow(() -> new BadRequestException(
                        "We could not find that ministry. Please choose one from the list."));

        if (!ministry.acceptingApplications()) {
            throw new BadRequestException(ministry.name()
                    + " is not accepting new applications at the moment. Please contact the "
                    + "church office.");
        }

        Gender gender = Gender.from(request.gender()).orElseThrow(
                () -> new BadRequestException("Please select a valid gender option."));
        AgeGroup ageGroup = AgeGroup.from(request.ageGroup()).orElseThrow(
                () -> new BadRequestException("Please select a valid age group."));

        String email = request.email().trim().toLowerCase();

        // Treat a rapid repeat as the same application rather than creating a second
        // row, so the review queue is not cluttered by double-clicks.
        List<MinistryApplication> recent = repository.findRecentDuplicates(
                email, ministry.slug(), Instant.now().minus(DUPLICATE_WINDOW));
        if (!recent.isEmpty()) {
            MinistryApplication existing = recent.getFirst();
            log.info("Duplicate application from {} for {} within {}h; returning the existing one",
                    email, ministry.slug(), DUPLICATE_WINDOW.toHours());
            return existing;
        }

        MinistryApplication application = new MinistryApplication();
        application.setFullName(request.fullName().trim());
        application.setEmail(email);
        application.setPhone(normalisePhone(request.phone()));
        application.setGender(gender);
        application.setAgeGroup(ageGroup);
        application.setCounty(blankToNull(request.county()));
        application.setOccupation(blankToNull(request.occupation()));

        application.setMinistrySlug(ministry.slug());
        application.setMinistryName(ministry.name());

        application.setChurchMember(Boolean.TRUE.equals(request.churchMember()));
        application.setBaptized(Boolean.TRUE.equals(request.baptized()));

        application.setSkills(blankToNull(request.skills()));
        application.setPreviousExperience(blankToNull(request.previousExperience()));
        application.setAvailability(blankToNull(request.availability()));
        application.setPrayerRequest(blankToNull(request.prayerRequest()));
        application.setAdditionalNotes(blankToNull(request.additionalNotes()));

        application.setStatus(ApplicationStatus.PENDING);
        if (metadata != null) {
            application.setIpAddress(metadata.ipAddress());
            application.setUserAgent(metadata.userAgent());
        }

        MinistryApplication saved = repository.save(application);

        // Recorded anonymously: there is no authenticated actor behind a public form.
        auditService.recordAnonymous("ministry_application.submitted", email, metadata,
                Map.of("ministry", ministry.slug(),
                       "applicationId", saved.getId().toString(),
                       "requiresParentalConsent", saved.requiresParentalConsent()));

        log.info("New application for {} from {}", ministry.slug(), email);
        return saved;
    }

    // -----------------------------------------------------------------------
    // Staff review
    // -----------------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> list(String statusName,
                                          String ministrySlug,
                                          String search,
                                          Pageable pageable) {

        ApplicationStatus status = statusName == null || statusName.isBlank()
                ? null
                : ApplicationStatus.from(statusName).orElseThrow(
                        () -> new BadRequestException("Unknown status '" + statusName
                                + "'. Valid values: PENDING, APPROVED, REJECTED, ARCHIVED."));

        return repository.search(status, ministrySlug, search, pageable)
                .map(ApplicationResponse::from);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse get(UUID id) {
        return repository.findById(id)
                .map(ApplicationResponse::from)
                .orElseThrow(() -> NotFoundException.of("Application", id));
    }

    @Transactional(readOnly = true)
    public ApplicationStats stats() {
        return new ApplicationStats(
                repository.countByStatus(ApplicationStatus.PENDING),
                repository.countByStatus(ApplicationStatus.APPROVED),
                repository.countByStatus(ApplicationStatus.REJECTED),
                repository.countByStatus(ApplicationStatus.ARCHIVED));
    }

    /** Records a decision, who made it, and any handover notes. */
    @Transactional
    public ApplicationResponse review(UUID id,
                                      ReviewApplicationRequest request,
                                      User reviewer,
                                      RequestMetadata metadata) {

        MinistryApplication application = repository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Application", id));

        ApplicationStatus decision = ApplicationStatus.from(request.status()).orElseThrow(
                () -> new BadRequestException("Unknown decision '" + request.status()
                        + "'. Valid values: PENDING, APPROVED, REJECTED, ARCHIVED."));

        ApplicationStatus previous = application.getStatus();
        application.review(decision, reviewer, request.reviewNotes());

        if (request.assignedLeader() != null && !request.assignedLeader().isBlank()) {
            application.setAssignedLeader(request.assignedLeader().trim());
        }
        if (Boolean.TRUE.equals(request.markContacted())) {
            application.markContacted();
        }

        MinistryApplication saved = repository.save(application);

        auditService.recordResourceChange("ministry_application.reviewed", reviewer,
                "ministry_application", id, metadata,
                Map.of("from", previous.name(),
                       "to", decision.name(),
                       "ministry", saved.getMinistrySlug(),
                       "applicant", saved.getEmail()));

        log.info("Application {} moved from {} to {} by {}", id, previous, decision,
                reviewer == null ? "system" : reviewer.getEmail());

        return ApplicationResponse.from(saved);
    }

    @Transactional
    public void delete(UUID id, User actor, RequestMetadata metadata) {
        MinistryApplication application = repository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Application", id));

        String email = application.getEmail();
        String ministry = application.getMinistrySlug();
        repository.delete(application);

        auditService.recordResourceChange("ministry_application.deleted", actor,
                "ministry_application", id, metadata,
                Map.of("applicant", email, "ministry", ministry));
    }

    /**
     * CSV export of the queue.
     *
     * <p>Generated here rather than in the controller so the escaping rules live with
     * the data. Every field is quoted and internal quotes are doubled, which is what
     * stops a comma in someone's notes from shifting every subsequent column.
     */
    @Transactional(readOnly = true)
    public String exportCsv(String statusName) {
        ApplicationStatus status = statusName == null || statusName.isBlank()
                ? null
                : ApplicationStatus.from(statusName).orElseThrow(
                        () -> new BadRequestException("Unknown status: " + statusName));

        List<MinistryApplication> applications = repository.findAllForExport(status);

        StringBuilder csv = new StringBuilder();
        csv.append("Submitted,Name,Email,Phone,Gender,Age group,County,Occupation,Ministry,")
                .append("Church member,Baptised,Skills,Experience,Availability,Prayer request,")
                .append("Notes,Status,Assigned leader,Reviewed by,Reviewed at\n");

        for (MinistryApplication a : applications) {
            csv.append(csvCell(a.getCreatedAt())).append(',')
                    .append(csvCell(a.getFullName())).append(',')
                    .append(csvCell(a.getEmail())).append(',')
                    .append(csvCell(a.getPhone())).append(',')
                    .append(csvCell(a.getGender().displayName())).append(',')
                    .append(csvCell(a.getAgeGroup().displayName())).append(',')
                    .append(csvCell(a.getCounty())).append(',')
                    .append(csvCell(a.getOccupation())).append(',')
                    .append(csvCell(a.getMinistryName())).append(',')
                    .append(csvCell(a.isChurchMember() ? "Yes" : "No")).append(',')
                    .append(csvCell(a.isBaptized() ? "Yes" : "No")).append(',')
                    .append(csvCell(a.getSkills())).append(',')
                    .append(csvCell(a.getPreviousExperience())).append(',')
                    .append(csvCell(a.getAvailability())).append(',')
                    .append(csvCell(a.getPrayerRequest())).append(',')
                    .append(csvCell(a.getAdditionalNotes())).append(',')
                    .append(csvCell(a.getStatus().displayName())).append(',')
                    .append(csvCell(a.getAssignedLeader())).append(',')
                    .append(csvCell(a.getReviewedBy() == null
                            ? null : a.getReviewedBy().getFullName())).append(',')
                    .append(csvCell(a.getReviewedAt()))
                    .append('\n');
        }

        return csv.toString();
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    /**
     * Quotes a CSV field.
     *
     * <p>A leading {@code =}, {@code +}, {@code -} or {@code @} is prefixed with an
     * apostrophe: spreadsheet applications interpret those as the start of a formula,
     * which turns an exported field into executable content when the file is opened.
     */
    private static String csvCell(Object value) {
        if (value == null) {
            return "\"\"";
        }
        String text = value.toString();
        if (!text.isEmpty() && "=+-@".indexOf(text.charAt(0)) >= 0) {
            text = "'" + text;
        }
        return '"' + text.replace("\"", "\"\"") + '"';
    }

    /** Reduces a phone number to a consistent {@code +254...} form for dialling. */
    private static String normalisePhone(String raw) {
        String digits = raw.replaceAll("[\\s-]", "");
        if (digits.startsWith("0")) {
            return "+254" + digits.substring(1);
        }
        if (digits.startsWith("254")) {
            return "+" + digits;
        }
        return digits;
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

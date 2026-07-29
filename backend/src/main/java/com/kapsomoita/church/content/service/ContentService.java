package com.kapsomoita.church.content.service;

import com.kapsomoita.church.audit.service.AuditService;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.content.domain.Announcement;
import com.kapsomoita.church.content.domain.ContentEnums.AnnouncementTone;
import com.kapsomoita.church.content.domain.ContentEnums.LeaderTeam;
import com.kapsomoita.church.content.domain.ContentEnums.ServiceDay;
import com.kapsomoita.church.content.domain.Leader;
import com.kapsomoita.church.content.domain.ServiceTime;
import com.kapsomoita.church.content.domain.Testimonial;
import com.kapsomoita.church.content.dto.ContentDtos.AnnouncementRequest;
import com.kapsomoita.church.content.dto.ContentDtos.AnnouncementResponse;
import com.kapsomoita.church.content.dto.ContentDtos.LeaderRequest;
import com.kapsomoita.church.content.dto.ContentDtos.LeaderResponse;
import com.kapsomoita.church.content.dto.ContentDtos.ServiceTimeRequest;
import com.kapsomoita.church.content.dto.ContentDtos.ServiceTimeResponse;
import com.kapsomoita.church.content.dto.ContentDtos.TestimonialRequest;
import com.kapsomoita.church.content.dto.ContentDtos.TestimonialResponse;
import com.kapsomoita.church.content.repository.AnnouncementRepository;
import com.kapsomoita.church.content.repository.LeaderRepository;
import com.kapsomoita.church.content.repository.ServiceTimeRepository;
import com.kapsomoita.church.content.repository.TestimonialRepository;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CRUD and publishing for announcements, service times, leaders and testimonials.
 *
 * <p>One service for four small modules that share the same shape: create, update,
 * publish/unpublish, reorder, delete. Splitting them into four near-identical classes
 * would triple the boilerplate without separating anything that actually varies.
 *
 * <p>Every mutation is audited, and every read used by the public site filters on
 * published state in the query rather than trusting the caller.
 */
@Service
public class ContentService {

    /** Cap on how many announcements the homepage will show. */
    private static final int PUBLIC_ANNOUNCEMENT_LIMIT = 6;

    private final AnnouncementRepository announcements;
    private final ServiceTimeRepository serviceTimes;
    private final LeaderRepository leaders;
    private final TestimonialRepository testimonials;
    private final MediaAssetRepository mediaAssets;
    private final AuditService auditService;

    public ContentService(AnnouncementRepository announcements,
                         ServiceTimeRepository serviceTimes,
                         LeaderRepository leaders,
                         TestimonialRepository testimonials,
                         MediaAssetRepository mediaAssets,
                         AuditService auditService) {
        this.announcements = announcements;
        this.serviceTimes = serviceTimes;
        this.leaders = leaders;
        this.testimonials = testimonials;
        this.mediaAssets = mediaAssets;
        this.auditService = auditService;
    }

    // =======================================================================
    // Announcements
    // =======================================================================

    /** Announcements currently live, for the public homepage. */
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> publicAnnouncements() {
        return announcements.findLive(Instant.now(), PageRequest.of(0, PUBLIC_ANNOUNCEMENT_LIMIT))
                .stream().map(AnnouncementResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<AnnouncementResponse> listAnnouncements(Boolean published, String search,
                                                        Pageable pageable) {
        return announcements.search(published, search, pageable).map(AnnouncementResponse::from);
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse getAnnouncement(UUID id) {
        return announcements.findById(id).map(AnnouncementResponse::from)
                .orElseThrow(() -> NotFoundException.of("Announcement", id));
    }

    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request, User actor,
                                                   RequestMetadata metadata) {
        Announcement announcement = new Announcement();
        applyAnnouncement(announcement, request);
        announcement.setCreatedBy(actor);

        Announcement saved = announcements.save(announcement);
        auditService.recordResourceChange("announcement.created", actor, "announcement",
                saved.getId(), metadata, Map.of("title", saved.getTitle()));
        return AnnouncementResponse.from(saved);
    }

    @Transactional
    public AnnouncementResponse updateAnnouncement(UUID id, AnnouncementRequest request,
                                                   User actor, RequestMetadata metadata) {
        Announcement announcement = announcements.findById(id)
                .orElseThrow(() -> NotFoundException.of("Announcement", id));
        applyAnnouncement(announcement, request);

        Announcement saved = announcements.save(announcement);
        auditService.recordResourceChange("announcement.updated", actor, "announcement", id,
                metadata, Map.of("title", saved.getTitle(), "published", saved.isPublished()));
        return AnnouncementResponse.from(saved);
    }

    @Transactional
    public void deleteAnnouncement(UUID id, User actor, RequestMetadata metadata) {
        Announcement announcement = announcements.findById(id)
                .orElseThrow(() -> NotFoundException.of("Announcement", id));
        String title = announcement.getTitle();
        announcements.delete(announcement);

        auditService.recordResourceChange("announcement.deleted", actor, "announcement", id,
                metadata, Map.of("title", title));
    }

    private void applyAnnouncement(Announcement announcement, AnnouncementRequest request) {
        announcement.setTitle(request.title().trim());
        announcement.setBody(request.body().trim());
        announcement.setTone(request.tone() == null || request.tone().isBlank()
                ? AnnouncementTone.INFO
                : AnnouncementTone.from(request.tone()).orElseThrow(
                        () -> new BadRequestException(
                                "Unknown tone. Use INFO, SUCCESS or WARNING.")));
        announcement.setDisplayDate(blankToNull(request.displayDate()));

        // The database requires both halves of a link or neither, so a label without a
        // URL is normalised away rather than rejected.
        String label = blankToNull(request.linkLabel());
        String url = blankToNull(request.linkUrl());
        if (label == null || url == null) {
            announcement.setLinkLabel(null);
            announcement.setLinkUrl(null);
        } else {
            announcement.setLinkLabel(label);
            announcement.setLinkUrl(url);
        }

        if (request.published() != null) announcement.setPublished(request.published());
        if (request.pinned() != null) announcement.setPinned(request.pinned());
        announcement.setStartsAt(request.startsAt());
        announcement.setEndsAt(request.endsAt());
        if (request.sortOrder() != null) announcement.setSortOrder(request.sortOrder());

        if (announcement.getStartsAt() != null && announcement.getEndsAt() != null
                && !announcement.getEndsAt().isAfter(announcement.getStartsAt())) {
            throw new BadRequestException("The end date must be after the start date.");
        }
    }

    // =======================================================================
    // Service times
    // =======================================================================

    @Transactional(readOnly = true)
    public List<ServiceTimeResponse> publicServiceTimes() {
        return serviceTimes.findPublished().stream().map(ServiceTimeResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceTimeResponse> listServiceTimes() {
        return serviceTimes.findAllOrdered().stream().map(ServiceTimeResponse::from).toList();
    }

    @Transactional
    public ServiceTimeResponse createServiceTime(ServiceTimeRequest request, User actor,
                                                 RequestMetadata metadata) {
        ServiceTime service = new ServiceTime();
        applyServiceTime(service, request);

        // Clear any existing primary first: a partial unique index permits only one, so
        // saving a second primary would otherwise fail with a constraint violation.
        if (service.isPrimary()) {
            serviceTimes.clearAllPrimary();
        }

        ServiceTime saved = serviceTimes.save(service);
        auditService.recordResourceChange("service_time.created", actor, "service_time",
                saved.getId(), metadata, Map.of("name", saved.getName()));
        return ServiceTimeResponse.from(saved);
    }

    @Transactional
    public ServiceTimeResponse updateServiceTime(UUID id, ServiceTimeRequest request, User actor,
                                                 RequestMetadata metadata) {
        ServiceTime service = serviceTimes.findById(id)
                .orElseThrow(() -> NotFoundException.of("Service time", id));
        applyServiceTime(service, request);

        if (service.isPrimary()) {
            serviceTimes.clearPrimaryExcept(id);
        }

        ServiceTime saved = serviceTimes.save(service);
        auditService.recordResourceChange("service_time.updated", actor, "service_time", id,
                metadata, Map.of("name", saved.getName()));
        return ServiceTimeResponse.from(saved);
    }

    @Transactional
    public ServiceTimeResponse setPrimaryServiceTime(UUID id, User actor,
                                                     RequestMetadata metadata) {
        ServiceTime service = serviceTimes.findById(id)
                .orElseThrow(() -> NotFoundException.of("Service time", id));

        // Clear any existing primary flag, then mark this one as primary.
        serviceTimes.clearAllPrimary();
        service.setPrimary(true);

        ServiceTime saved = serviceTimes.save(service);
        auditService.recordResourceChange("service_time.set_primary", actor, "service_time", id,
                metadata, Map.of("name", saved.getName()));
        return ServiceTimeResponse.from(saved);
    }

    @Transactional
    public void deleteServiceTime(UUID id, User actor, RequestMetadata metadata) {
        ServiceTime service = serviceTimes.findById(id)
                .orElseThrow(() -> NotFoundException.of("Service time", id));
        String name = service.getName();
        serviceTimes.delete(service);

        auditService.recordResourceChange("service_time.deleted", actor, "service_time", id,
                metadata, Map.of("name", name));
    }

    private void applyServiceTime(ServiceTime service, ServiceTimeRequest request) {
        service.setName(request.name().trim());
        service.setDayOfWeek(ServiceDay.from(request.dayOfWeek()).orElseThrow(
                () -> new BadRequestException("Unknown day: " + request.dayOfWeek())));
        service.setTimeLabel(request.timeLabel().trim());
        service.setLocation(request.location().trim());
        service.setLeader(blankToNull(request.leader()));
        service.setDescription(blankToNull(request.description()));
        if (request.primary() != null) service.setPrimary(request.primary());
        if (request.published() != null) service.setPublished(request.published());
        if (request.sortOrder() != null) service.setSortOrder(request.sortOrder());
    }

    // =======================================================================
    // Leaders
    // =======================================================================

    /** Published leaders, ordered pastoral team first then ministry leaders. */
    @Transactional(readOnly = true)
    public List<LeaderResponse> publicLeaders() {
        return leaders.findPublished().stream()
                .sorted(Comparator
                        .comparingInt((Leader l) -> l.getTeam().ordinal())
                        .thenComparingInt(Leader::getSortOrder))
                .map(LeaderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaderResponse> listLeaders() {
        return leaders.findAllOrdered().stream().map(LeaderResponse::from).toList();
    }

    @Transactional
    public LeaderResponse createLeader(LeaderRequest request, User actor,
                                       RequestMetadata metadata) {
        Leader leader = new Leader();
        applyLeader(leader, request);

        Leader saved = leaders.save(leader);
        auditService.recordResourceChange("leader.created", actor, "leader", saved.getId(),
                metadata, Map.of("role", saved.getRoleTitle()));
        return LeaderResponse.from(saved);
    }

    @Transactional
    public LeaderResponse updateLeader(UUID id, LeaderRequest request, User actor,
                                       RequestMetadata metadata) {
        Leader leader = leaders.findByIdWithPhoto(id)
                .orElseThrow(() -> NotFoundException.of("Leader", id));
        applyLeader(leader, request);

        Leader saved = leaders.save(leader);
        auditService.recordResourceChange("leader.updated", actor, "leader", id, metadata,
                Map.of("role", saved.getRoleTitle()));
        return LeaderResponse.from(saved);
    }

    @Transactional
    public void deleteLeader(UUID id, User actor, RequestMetadata metadata) {
        Leader leader = leaders.findById(id)
                .orElseThrow(() -> NotFoundException.of("Leader", id));
        String role = leader.getRoleTitle();
        leaders.delete(leader);

        auditService.recordResourceChange("leader.deleted", actor, "leader", id, metadata,
                Map.of("role", role));
    }

    private void applyLeader(Leader leader, LeaderRequest request) {
        leader.setFullName(blankToNull(request.fullName()));
        leader.setRoleTitle(request.roleTitle().trim());
        leader.setBio(blankToNull(request.bio()));
        leader.setMinistry(blankToNull(request.ministry()));
        leader.setEmail(blankToNull(request.email()));
        leader.setPhone(blankToNull(request.phone()));
        leader.setPhoto(resolveAsset(request.photoId()));
        if (request.team() != null && !request.team().isBlank()) {
            leader.setTeam(LeaderTeam.from(request.team()).orElseThrow(
                    () -> new BadRequestException(
                            "Unknown team. Use PASTORAL, MINISTRY or SUPPORT.")));
        }
        if (request.published() != null) leader.setPublished(request.published());
        if (request.sortOrder() != null) leader.setSortOrder(request.sortOrder());
    }

    // =======================================================================
    // Testimonials
    // =======================================================================

    @Transactional(readOnly = true)
    public List<TestimonialResponse> publicTestimonials(int limit) {
        int capped = Math.clamp(limit, 1, 24);
        return testimonials.findPublished(PageRequest.of(0, capped)).stream()
                .map(TestimonialResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<TestimonialResponse> listTestimonials(Boolean published, Pageable pageable) {
        return testimonials.search(published, pageable).map(TestimonialResponse::from);
    }

    @Transactional
    public TestimonialResponse createTestimonial(TestimonialRequest request, User actor,
                                                 RequestMetadata metadata) {
        Testimonial testimonial = new Testimonial();
        applyTestimonial(testimonial, request);

        Testimonial saved = testimonials.save(testimonial);
        auditService.recordResourceChange("testimonial.created", actor, "testimonial",
                saved.getId(), metadata, Map.of("published", saved.isPublished()));
        return TestimonialResponse.from(saved);
    }

    @Transactional
    public TestimonialResponse updateTestimonial(UUID id, TestimonialRequest request, User actor,
                                                 RequestMetadata metadata) {
        Testimonial testimonial = testimonials.findById(id)
                .orElseThrow(() -> NotFoundException.of("Testimonial", id));
        applyTestimonial(testimonial, request);

        Testimonial saved = testimonials.save(testimonial);
        auditService.recordResourceChange("testimonial.updated", actor, "testimonial", id,
                metadata, Map.of("published", saved.isPublished()));
        return TestimonialResponse.from(saved);
    }

    @Transactional
    public void deleteTestimonial(UUID id, User actor, RequestMetadata metadata) {
        Testimonial testimonial = testimonials.findById(id)
                .orElseThrow(() -> NotFoundException.of("Testimonial", id));
        testimonials.delete(testimonial);

        auditService.recordResourceChange("testimonial.deleted", actor, "testimonial", id,
                metadata, null);
    }

    private void applyTestimonial(Testimonial testimonial, TestimonialRequest request) {
        testimonial.setQuote(request.quote().trim());
        testimonial.setAuthorName(blankToNull(request.authorName()));
        testimonial.setAuthorRole(blankToNull(request.authorRole()));
        testimonial.setPhoto(resolveAsset(request.photoId()));
        if (request.published() != null) testimonial.setPublished(request.published());
        if (request.featured() != null) testimonial.setFeatured(request.featured());
        if (request.sortOrder() != null) testimonial.setSortOrder(request.sortOrder());
    }

    // =======================================================================
    // Shared helpers
    // =======================================================================

    /**
     * Resolves a media asset reference.
     *
     * <p>A null id clears the association. A non-null id that does not exist is an
     * error rather than a silent null, so a mistyped reference is not mistaken for
     * "no photo".
     */
    private MediaAsset resolveAsset(UUID assetId) {
        if (assetId == null) {
            return null;
        }
        return mediaAssets.findById(assetId)
                .orElseThrow(() -> new BadRequestException(
                        "That image could not be found in the media library."));
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

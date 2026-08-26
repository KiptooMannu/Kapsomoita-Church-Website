package com.kapsomoita.church.content.web;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.security.CurrentUser;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.content.dto.ContentDtos.AnnouncementRequest;
import com.kapsomoita.church.content.dto.ContentDtos.AnnouncementResponse;
import com.kapsomoita.church.content.dto.ContentDtos.HomepageItemRequest;
import com.kapsomoita.church.content.dto.ContentDtos.HomepageItemResponse;
import com.kapsomoita.church.content.dto.ContentDtos.LeaderRequest;
import com.kapsomoita.church.content.dto.ContentDtos.LeaderResponse;
import com.kapsomoita.church.content.dto.ContentDtos.ServiceTimeRequest;
import com.kapsomoita.church.content.dto.ContentDtos.ServiceTimeResponse;
import com.kapsomoita.church.content.dto.ContentDtos.TestimonialRequest;
import com.kapsomoita.church.content.dto.ContentDtos.TestimonialResponse;
import com.kapsomoita.church.content.service.ContentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin CRUD endpoints for content management (announcements, service times, leaders, testimonials). */
@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final ContentService contentService;

    public AdminContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // -----------------------------------------------------------------------
    // Announcements
    // -----------------------------------------------------------------------

    @GetMapping("/announcements")
    @PreAuthorize("hasAuthority('announcement:read')")
    public Page<AnnouncementResponse> listAnnouncements(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return contentService.listAnnouncements(published, search, pageable);
    }

    @GetMapping("/announcements/{id}")
    @PreAuthorize("hasAuthority('announcement:read')")
    public AnnouncementResponse getAnnouncement(@PathVariable UUID id) {
        return contentService.getAnnouncement(id);
    }

    @PostMapping("/announcements")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('announcement:create')")
    public AnnouncementResponse createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.createAnnouncement(request, actor, metadata);
    }

    @PutMapping("/announcements/{id}")
    @PreAuthorize("hasAuthority('announcement:update')")
    public AnnouncementResponse updateAnnouncement(
            @PathVariable UUID id,
            @Valid @RequestBody AnnouncementRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.updateAnnouncement(id, request, actor, metadata);
    }

    @DeleteMapping("/announcements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('announcement:delete')")
    public void deleteAnnouncement(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        contentService.deleteAnnouncement(id, actor, metadata);
    }

    // -----------------------------------------------------------------------
    // Service Times
    // -----------------------------------------------------------------------

    @GetMapping("/service-times")
    @PreAuthorize("hasAuthority('service_time:read')")
    public List<ServiceTimeResponse> listServiceTimes() {
        return contentService.listServiceTimes();
    }

    @PostMapping("/service-times")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('service_time:create')")
    public ServiceTimeResponse createServiceTime(
            @Valid @RequestBody ServiceTimeRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.createServiceTime(request, actor, metadata);
    }

    @PutMapping("/service-times/{id}")
    @PreAuthorize("hasAuthority('service_time:update')")
    public ServiceTimeResponse updateServiceTime(
            @PathVariable UUID id,
            @Valid @RequestBody ServiceTimeRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.updateServiceTime(id, request, actor, metadata);
    }

    @PostMapping("/service-times/{id}/primary")
    @PreAuthorize("hasAuthority('service_time:update')")
    public ServiceTimeResponse setPrimaryServiceTime(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.setPrimaryServiceTime(id, actor, metadata);
    }

    @DeleteMapping("/service-times/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('service_time:delete')")
    public void deleteServiceTime(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        contentService.deleteServiceTime(id, actor, metadata);
    }

    // -----------------------------------------------------------------------
    // Leaders
    // -----------------------------------------------------------------------

    @GetMapping("/leaders")
    @PreAuthorize("hasAuthority('leader:read')")
    public List<LeaderResponse> listLeaders() {
        return contentService.listLeaders();
    }

    @PostMapping("/leaders")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('leader:create')")
    public LeaderResponse createLeader(
            @Valid @RequestBody LeaderRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.createLeader(request, actor, metadata);
    }

    @PutMapping("/leaders/{id}")
    @PreAuthorize("hasAuthority('leader:update')")
    public LeaderResponse updateLeader(
            @PathVariable UUID id,
            @Valid @RequestBody LeaderRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.updateLeader(id, request, actor, metadata);
    }

    @DeleteMapping("/leaders/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('leader:delete')")
    public void deleteLeader(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        contentService.deleteLeader(id, actor, metadata);
    }

    // -----------------------------------------------------------------------
    // Testimonials
    // -----------------------------------------------------------------------

    @GetMapping("/testimonials")
    @PreAuthorize("hasAuthority('testimonial:read')")
    public Page<TestimonialResponse> listTestimonials(
            @RequestParam(required = false) Boolean published,
            Pageable pageable) {
        return contentService.listTestimonials(published, pageable);
    }

    @PostMapping("/testimonials")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('testimonial:create')")
    public TestimonialResponse createTestimonial(
            @Valid @RequestBody TestimonialRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.createTestimonial(request, actor, metadata);
    }

    @PutMapping("/testimonials/{id}")
    @PreAuthorize("hasAuthority('testimonial:update')")
    public TestimonialResponse updateTestimonial(
            @PathVariable UUID id,
            @Valid @RequestBody TestimonialRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.updateTestimonial(id, request, actor, metadata);
    }

    @DeleteMapping("/testimonials/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('testimonial:delete')")
    public void deleteTestimonial(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        contentService.deleteTestimonial(id, actor, metadata);
    }

    // -----------------------------------------------------------------------
    // Homepage Items
    // -----------------------------------------------------------------------

    @GetMapping("/homepage-items")
    @PreAuthorize("hasAuthority('homepage:read')")
    public List<HomepageItemResponse> listHomepageItems() {
        return contentService.listHomepageItems();
    }

    @GetMapping("/homepage-items/{id}")
    @PreAuthorize("hasAuthority('homepage:read')")
    public HomepageItemResponse getHomepageItem(@PathVariable UUID id) {
        return contentService.getHomepageItem(id);
    }

    @PostMapping("/homepage-items")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('homepage:create')")
    public HomepageItemResponse createHomepageItem(
            @Valid @RequestBody HomepageItemRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.createHomepageItem(request, actor, metadata);
    }

    @PutMapping("/homepage-items/{id}")
    @PreAuthorize("hasAuthority('homepage:update')")
    public HomepageItemResponse updateHomepageItem(
            @PathVariable UUID id,
            @Valid @RequestBody HomepageItemRequest request,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        return contentService.updateHomepageItem(id, request, actor, metadata);
    }

    @DeleteMapping("/homepage-items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('homepage:delete')")
    public void deleteHomepageItem(
            @PathVariable UUID id,
            @CurrentUser User actor,
            RequestMetadata metadata) {
        contentService.deleteHomepageItem(id, actor, metadata);
    }
}

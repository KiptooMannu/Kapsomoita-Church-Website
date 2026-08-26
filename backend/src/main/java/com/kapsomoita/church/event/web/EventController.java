package com.kapsomoita.church.event.web;

import com.kapsomoita.church.event.dto.EventDtos.EventRequest;
import com.kapsomoita.church.event.dto.EventDtos.EventResponse;
import com.kapsomoita.church.event.service.EventService;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Public endpoints
    @GetMapping("/events")
    public List<EventResponse> getUpcomingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startsAt").ascending());
        return eventService.getUpcomingEvents(pageable);
    }

    @GetMapping("/events/featured")
    public List<EventResponse> getFeaturedEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startsAt").ascending());
        return eventService.getFeaturedEvents(pageable);
    }

    @GetMapping("/events/{slug}")
    public EventResponse getPublicEventBySlug(@PathVariable String slug) {
        return eventService.getPublicEventBySlug(slug);
    }

    // Admin endpoints
    @GetMapping("/admin/events")
    @PreAuthorize("hasAuthority('event:read')")
    public PageResponse<EventResponse> listEvents(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startsAt").descending());
        Page<EventResponse> result = eventService.listEvents(published, search, pageable);
        return PageResponse.from(result);
    }

    @GetMapping("/admin/events/{id}")
    @PreAuthorize("hasAuthority('event:read')")
    public EventResponse getEvent(@PathVariable UUID id) {
        return eventService.getEvent(id);
    }

    @PostMapping("/admin/events")
    @PreAuthorize("hasAuthority('event:create')")
    public EventResponse createEvent(@Valid @RequestBody EventRequest request) {
        return eventService.createEvent(request);
    }

    @PutMapping("/admin/events/{id}")
    @PreAuthorize("hasAuthority('event:update')")
    public EventResponse updateEvent(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping("/admin/events/{id}")
    @PreAuthorize("hasAuthority('event:delete')")
    public void deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
    }
}

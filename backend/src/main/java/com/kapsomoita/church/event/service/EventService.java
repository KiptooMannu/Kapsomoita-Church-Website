package com.kapsomoita.church.event.service;

import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.event.domain.Event;
import com.kapsomoita.church.event.dto.EventDtos.EventRequest;
import com.kapsomoita.church.event.dto.EventDtos.EventResponse;
import com.kapsomoita.church.event.repository.EventRepository;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final MediaAssetRepository mediaAssetRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents(Pageable pageable) {
        Instant now = Instant.now();
        return eventRepository.findUpcoming(now, pageable).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getFeaturedEvents(Pageable pageable) {
        Instant now = Instant.now();
        return eventRepository.findFeatured(now, pageable).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getPublicEventBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
            .orElseThrow(() -> new NotFoundException("Event not found"));
        
        if (!event.isPublished()) {
            throw new NotFoundException("Event not found");
        }
        
        return toResponse(event);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> listEvents(Boolean published, String search, Pageable pageable) {
        return eventRepository.search(published, search, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EventResponse getEvent(UUID id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Event not found"));
        return toResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        if (eventRepository.findBySlug(request.slug()).isPresent()) {
            throw new BadRequestException("Slug already exists");
        }
        
        Event event = new Event();
        applyEvent(event, request);
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    @Transactional
    public EventResponse updateEvent(UUID id, EventRequest request) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Event not found"));
        
        // Check if slug changed and conflicts with another event
        if (!event.getSlug().equals(request.slug())) {
            eventRepository.findBySlug(request.slug()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BadRequestException("Slug already exists");
                }
            });
        }
        
        applyEvent(event, request);
        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    @Transactional
    public void deleteEvent(UUID id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Event not found"));
        eventRepository.delete(event);
    }

    private void applyEvent(Event event, EventRequest request) {
        event.setTitle(request.title().trim());
        event.setSlug(request.slug().trim().toLowerCase());
        event.setDescription(request.description() != null ? request.description().trim() : null);
        event.setStartsAt(request.startsAt());
        event.setEndsAt(request.endsAt());
        event.setVenue(request.venue().trim());
        event.setCapacity(request.capacity());
        
        if (request.bannerId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.bannerId())
                .orElseThrow(() -> new BadRequestException("Banner asset not found"));
            event.setBanner(asset);
        } else {
            event.setBanner(null);
        }
        
        if (request.registrationOpen() != null) event.setRegistrationOpen(request.registrationOpen());
        if (request.published() != null) event.setPublished(request.published());
        if (request.featured() != null) event.setFeatured(request.featured());
        event.setMapUrl(request.mapUrl() != null ? request.mapUrl().trim() : null);
        
        // Validate date window
        if (event.getEndsAt() != null && !event.getEndsAt().isAfter(event.getStartsAt())) {
            throw new BadRequestException("The end date must be after the start date.");
        }
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getSlug(),
            event.getDescription(),
            event.getStartsAt(),
            event.getEndsAt(),
            event.getVenue(),
            event.getCapacity(),
            event.getBanner() != null ? event.getBanner().getId() : null,
            event.getBanner() != null ? event.getBanner().getSecureUrl() : null,
            event.isRegistrationOpen(),
            event.isPublished(),
            event.isFeatured(),
            event.getMapUrl(),
            event.getCreatedBy() != null ? event.getCreatedBy().getFullName() : null,
            event.getCreatedAt().toString(),
            event.getUpdatedAt().toString()
        );
    }
}

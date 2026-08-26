package com.kapsomoita.church.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public final class EventDtos {

    private EventDtos() {
    }

    public record EventRequest(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "That title is too long.")
            String title,

            @NotBlank(message = "A slug is required.")
            @Size(max = 220, message = "That slug is too long.")
            String slug,

            @Size(max = 5000, message = "Please keep the description under 5000 characters.")
            String description,

            @NotNull(message = "A start date is required.")
            Instant startsAt,

            Instant endsAt,

            @NotBlank(message = "A venue is required.")
            @Size(max = 200, message = "That venue name is too long.")
            String venue,

            Integer capacity,

            UUID bannerId,

            Boolean registrationOpen,
            Boolean published,
            Boolean featured,

            @Size(max = 500, message = "That map URL is too long.")
            String mapUrl
    ) {}

    public record EventResponse(
            UUID id,
            String title,
            String slug,
            String description,
            Instant startsAt,
            Instant endsAt,
            String venue,
            Integer capacity,
            UUID bannerId,
            String bannerUrl,
            boolean registrationOpen,
            boolean published,
            boolean featured,
            String mapUrl,
            String createdByName,
            String createdAt,
            String updatedAt
    ) {}
}

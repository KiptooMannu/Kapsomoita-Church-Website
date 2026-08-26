package com.kapsomoita.church.livestream.dto;

import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class LivestreamDtos {

    private LivestreamDtos() {
    }

    public record LivestreamRequest(
            @Size(max = 200, message = "That title is too long.")
            String title,

            @Size(max = 24, message = "That platform name is too long.")
            String platform,

            @Size(max = 500, message = "That stream URL is too long.")
            String streamUrl,

            @Size(max = 500, message = "That embed URL is too long.")
            String embedUrl,

            Instant scheduledFor,

            @Size(max = 5000, message = "Please keep the offline message under 5000 characters.")
            String offlineMessage,

            Boolean isLive
    ) {}

    public record LivestreamResponse(
            Integer id,
            boolean isLive,
            String title,
            String platform,
            String streamUrl,
            String embedUrl,
            Instant scheduledFor,
            String offlineMessage,
            String updatedByName,
            String createdAt,
            String updatedAt
    ) {}
}

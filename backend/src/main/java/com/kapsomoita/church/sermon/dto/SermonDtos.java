package com.kapsomoita.church.sermon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public final class SermonDtos {

    private SermonDtos() {
    }

    public record SermonRequest(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "That title is too long.")
            String title,

            @NotBlank(message = "A slug is required.")
            @Size(max = 220, message = "That slug is too long.")
            String slug,

            @NotBlank(message = "A speaker is required.")
            @Size(max = 180, message = "That speaker name is too long.")
            String speaker,

            @NotNull(message = "A preach date is required.")
            LocalDate preachedOn,

            @Size(max = 160, message = "That series name is too long.")
            String series,

            @Size(max = 160, message = "That topic is too long.")
            String topic,

            @Size(max = 200, message = "That Bible reference is too long.")
            String bibleReference,

            @Size(max = 5000, message = "Please keep the summary under 5000 characters.")
            String summary,

            Integer durationMinutes,

            @Size(max = 500, message = "That video URL is too long.")
            String videoUrl,

            UUID videoAssetId,
            UUID audioAssetId,
            UUID notesAssetId,
            UUID thumbnailId,

            Boolean published,
            Boolean featured
    ) {}

    public record SermonResponse(
            UUID id,
            String title,
            String slug,
            String speaker,
            LocalDate preachedOn,
            String series,
            String topic,
            String bibleReference,
            String summary,
            Integer durationMinutes,
            String videoUrl,
            UUID videoAssetId,
            String videoAssetUrl,
            UUID audioAssetId,
            String audioAssetUrl,
            UUID notesAssetId,
            String notesAssetUrl,
            UUID thumbnailId,
            String thumbnailUrl,
            boolean published,
            boolean featured,
            long viewCount,
            String createdByName,
            String createdAt,
            String updatedAt
    ) {}
}

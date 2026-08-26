package com.kapsomoita.church.download.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public final class DownloadDtos {

    private DownloadDtos() {
    }

    public record DownloadRequest(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "That title is too long.")
            String title,

            @Size(max = 5000, message = "Please keep the description under 5000 characters.")
            String description,

            @Size(max = 64, message = "That category name is too long.")
            String category,

            @NotNull(message = "An asset ID is required.")
            UUID assetId,

            Boolean published,
            Integer sortOrder
    ) {}

    public record DownloadResponse(
            UUID id,
            String title,
            String description,
            String category,
            UUID assetId,
            String assetUrl,
            String assetFileName,
            long downloadCount,
            boolean published,
            int sortOrder,
            String createdAt,
            String updatedAt
    ) {}
}

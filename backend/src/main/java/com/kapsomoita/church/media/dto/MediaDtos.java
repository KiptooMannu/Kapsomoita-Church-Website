package com.kapsomoita.church.media.dto;

import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.domain.MediaVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Request and response payloads for media management. */
public final class MediaDtos {

    private MediaDtos() {
    }

    /** Upper bound on tags per asset, to keep the array and its GIN index sane. */
    public static final int MAX_TAGS = 20;

    // -----------------------------------------------------------------------
    // Requests
    // -----------------------------------------------------------------------

    /**
     * Metadata accompanying an upload.
     *
     * <p>Sent as individual multipart form fields alongside the file rather than as a
     * JSON body, because a single request must carry both. {@code folder} and
     * {@code category} are plain strings here and resolved to enums in the service,
     * so an unknown value produces a helpful message listing the valid options
     * instead of an opaque deserialisation failure.
     */
    public record UploadMetadata(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "The title is too long.")
            String title,

            @Size(max = 5000, message = "The description is too long.")
            String description,

            /** {@link MediaFolder} name, e.g. {@code GALLERY} or {@code SERMON_VIDEO}. */
            @NotBlank(message = "A destination folder is required.")
            String folder,

            /** {@link GalleryCategory} name or slug. Required only for the gallery. */
            String category,

            /** {@link MediaVisibility} name. Defaults to {@code PUBLIC}. */
            String visibility,

            Boolean featured,

            List<@Size(max = 40) String> tags,

            Integer sortOrder) {

        public boolean featuredOrDefault() {
            return featured != null && featured;
        }

        public int sortOrderOrDefault() {
            return sortOrder == null ? 0 : sortOrder;
        }
    }

    /** Editorial updates. Never touches the stored file or its Cloudinary identifiers. */
    public record UpdateMediaRequest(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "The title is too long.")
            String title,

            @Size(max = 5000, message = "The description is too long.")
            String description,

            /**
             * Re-file a gallery asset under a different category.
             *
             * <p>Only the database row moves; the file stays in its original Cloudinary
             * folder. Re-uploading to physically relocate it would change the URL and
             * break every existing reference for no user-visible gain.
             */
            String category,

            String visibility,

            Boolean featured,

            List<@Size(max = 40) String> tags,

            Integer sortOrder) {
    }

    // -----------------------------------------------------------------------
    // Responses
    // -----------------------------------------------------------------------

    /** A stored asset as the admin UI and public site consume it. */
    public record MediaAssetResponse(
            UUID id,
            String title,
            String description,
            String folder,
            String mediaFolder,
            String category,
            String categoryLabel,
            String publicId,
            String assetId,
            String secureUrl,
            String resourceType,
            String format,
            long bytes,
            Integer width,
            Integer height,
            String originalFilename,
            String mimeType,
            UUID uploadedById,
            String uploadedByName,
            Instant uploadedAt,
            boolean featured,
            String visibility,
            List<String> tags,
            int sortOrder) {

        public static MediaAssetResponse from(MediaAsset asset) {
            return new MediaAssetResponse(
                    asset.getId(),
                    asset.getTitle(),
                    asset.getDescription(),
                    asset.getFolder(),
                    asset.getMediaFolder().name(),
                    asset.getGalleryCategory() == null ? null : asset.getGalleryCategory().name(),
                    asset.getGalleryCategory() == null
                            ? null
                            : asset.getGalleryCategory().displayName(),
                    asset.getPublicId(),
                    asset.getAssetId(),
                    asset.getSecureUrl(),
                    asset.getResourceType(),
                    asset.getFormat(),
                    asset.getBytes(),
                    asset.getWidth(),
                    asset.getHeight(),
                    asset.getOriginalFilename(),
                    asset.getMimeType(),
                    asset.getUploadedBy() == null ? null : asset.getUploadedBy().getId(),
                    asset.getUploadedBy() == null ? null : asset.getUploadedBy().getFullName(),
                    asset.getUploadedAt(),
                    asset.isFeatured(),
                    asset.getVisibility().name(),
                    List.copyOf(asset.getTags()),
                    asset.getSortOrder());
        }
    }

    /**
     * Outcome of a multi-file upload.
     *
     * <p>Partial success is reported rather than treated as total failure: when eight
     * of ten photos upload, discarding the eight would be worse than telling the user
     * which two to retry.
     *
     * @param uploaded assets that were stored successfully
     * @param failed   per-file failures, in submission order
     */
    public record BulkUploadResponse(
            List<MediaAssetResponse> uploaded,
            List<FailedUpload> failed,
            int successCount,
            int failureCount) {

        public static BulkUploadResponse of(List<MediaAssetResponse> uploaded,
                                            List<FailedUpload> failed) {
            return new BulkUploadResponse(uploaded, failed, uploaded.size(), failed.size());
        }
    }

    /** One file that could not be stored, and why. */
    public record FailedUpload(String filename, String code, String message) {
    }

    /** A gallery category with its image count, for the category dropdown. */
    public record GalleryCategorySummary(
            String name,
            String slug,
            String displayName,
            String folder,
            long imageCount) {
    }

    /** A destination in the folder map, for the admin upload form. */
    public record MediaFolderSummary(
            String name,
            String relativePath,
            String absoluteFolder,
            String expectedKind,
            boolean requiresCategory,
            long maxBytes,
            List<String> allowedExtensions) {
    }
}

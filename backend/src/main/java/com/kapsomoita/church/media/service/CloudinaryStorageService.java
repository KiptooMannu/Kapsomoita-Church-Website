package com.kapsomoita.church.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.kapsomoita.church.common.exception.ApiException;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.config.CloudinaryProperties;
import com.kapsomoita.church.media.domain.GalleryCategory;
import com.kapsomoita.church.media.domain.MediaFolder;
import com.kapsomoita.church.media.domain.MediaKind;
import java.io.IOException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Uploads media to Cloudinary and deletes it again.
 *
 * <h2>Folders are never created explicitly</h2>
 *
 * <p>This service calls no folder-management API, and none is needed. Passing
 * {@code folder} to the upload endpoint makes Cloudinary create every missing
 * segment of that path as part of storing the asset. The first gallery upload for a
 * new category therefore brings {@code church/gallery/{category}} into existence by
 * itself.
 *
 * <p>The practical consequence, which is the requirement driving this design: an
 * upload can never fail because a folder does not exist. There is no
 * "check, then create, then upload" sequence to get wrong, no race between two
 * concurrent uploads to the same new folder, and nothing for an administrator to
 * set up in the Cloudinary dashboard beforehand.
 *
 * <h2>Paths</h2>
 *
 * <p>Destinations come exclusively from {@link MediaFolder}; this class contains no
 * folder literal beyond joining the configured root to a resolved relative path.
 */
@Service
public class CloudinaryStorageService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryStorageService.class);

    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;
    private final MediaValidationService validationService;

    public CloudinaryStorageService(Cloudinary cloudinary,
                                    CloudinaryProperties properties,
                                    MediaValidationService validationService) {
        this.cloudinary = cloudinary;
        this.properties = properties;
        this.validationService = validationService;
    }

    // -----------------------------------------------------------------------
    // Folder resolution
    // -----------------------------------------------------------------------

    /**
     * The absolute Cloudinary folder for a destination.
     *
     * <p>The only place the root folder is joined to a relative path. Callers pass a
     * purpose, never a path.
     */
    public String resolveFolder(MediaFolder folder, GalleryCategory category) {
        Objects.requireNonNull(folder, "folder must not be null");

        if (folder.isCategoryScoped() && category == null) {
            throw new BadRequestException(
                    "A gallery category is required for uploads to the gallery.");
        }

        return properties.rootFolder() + "/" + folder.resolveRelativePath(category);
    }

    // -----------------------------------------------------------------------
    // Upload
    // -----------------------------------------------------------------------

    /**
     * Validates and uploads a file.
     *
     * @param file     the multipart upload
     * @param folder   logical destination from the centralised map
     * @param category gallery category; required only for {@link MediaFolder#GALLERY}
     * @param tags     Cloudinary tags to attach, may be null
     * @return the stored asset's metadata
     * @throws ApiException for a validation failure, misconfiguration, or an upload
     *         error — always with a message that is safe to show a user
     */
    public StoredMedia upload(MultipartFile file,
                              MediaFolder folder,
                              GalleryCategory category,
                              List<String> tags) {

        requireConfigured();

        MediaKind kind = folder.expectedKind();
        MediaValidationService.ValidatedUpload validated = validationService.validate(file, kind);

        String targetFolder = resolveFolder(folder, category);
        String publicId = validationService.generatePublicId(validated.originalFilename(), kind);

        Map<String, Object> options = buildUploadOptions(targetFolder, publicId, kind, tags);

        try {
            log.debug("Uploading '{}' ({} bytes, {}) to Cloudinary folder '{}' as '{}'",
                    validated.originalFilename(), validated.sizeBytes(),
                    validated.detectedMimeType(), targetFolder, publicId);

            // Cloudinary creates `targetFolder` here if it does not already exist.
            @SuppressWarnings("unchecked")
            Map<String, Object> result =
                    (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), options);

            StoredMedia stored = toStoredMedia(result, targetFolder, validated);
            log.info("Uploaded {} to Cloudinary: {} ({})",
                    validated.originalFilename(), stored.publicId(), stored.secureUrl());
            return stored;

        } catch (IOException failure) {
            // Covers both a failed read of the multipart file and a transport failure
            // to Cloudinary; the SDK surfaces API errors as IOException too.
            log.error("Cloudinary upload failed for '{}' into folder '{}'",
                    validated.originalFilename(), targetFolder, failure);
            throw new MediaUploadException(
                    "Could not upload \"" + validated.originalFilename()
                            + "\". Please check your connection and try again.", failure);
        } catch (RuntimeException unexpected) {
            log.error("Unexpected error uploading '{}' into folder '{}'",
                    validated.originalFilename(), targetFolder, unexpected);
            throw new MediaUploadException(
                    "Could not upload \"" + validated.originalFilename()
                            + "\" because of an unexpected error. Please try again.", unexpected);
        }
    }

    private Map<String, Object> buildUploadOptions(String targetFolder,
                                                   String publicId,
                                                   MediaKind kind,
                                                   List<String> tags) {
        Map<String, Object> options = new HashMap<>();

        // The folder parameter is what triggers implicit folder creation.
        options.put("folder", targetFolder);
        options.put("public_id", publicId);
        options.put("resource_type", kind.cloudinaryResourceType());

        // The generated public ID is already unique, so overwrite would only ever
        // fire on an ID collision — which should fail loudly rather than silently
        // replace someone else's asset.
        options.put("overwrite", false);
        // Without this, Cloudinary appends its own random suffix and the returned
        // public ID stops matching the one we generated and are about to persist.
        options.put("unique_filename", false);
        options.put("use_filename", false);

        if (tags != null && !tags.isEmpty()) {
            options.put("tags", String.join(",", tags));
        }

        if (kind == MediaKind.IMAGE) {
            // Strip camera metadata: church photos routinely carry GPS coordinates,
            // and publishing the location of a member's home is a real privacy risk.
            options.put("image_metadata", false);
            // Let Cloudinary pick the best format and quality per requesting browser.
            options.put("quality", "auto");
            options.put("fetch_format", "auto");
        }

        if (kind == MediaKind.DOCUMENT) {
            // Raw assets are served for download rather than rendered inline.
            options.put("type", "upload");
        }

        return options;
    }

    // -----------------------------------------------------------------------
    // Delete
    // -----------------------------------------------------------------------

    /**
     * Removes an asset.
     *
     * <p>Returns a boolean rather than throwing, because the main caller is the
     * compensating cleanup after a failed database write. In that path the original
     * failure is what matters, and a secondary exception would mask it.
     *
     * @return true when Cloudinary reports the asset deleted or already absent
     */
    public boolean delete(String publicId, MediaKind kind) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        if (!properties.isConfigured()) {
            log.warn("Cannot delete '{}': Cloudinary is not configured", publicId);
            return false;
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type", kind.cloudinaryResourceType(),
                            // Purge the CDN copy as well, otherwise a deleted image
                            // keeps being served from cache for hours.
                            "invalidate", true));

            String outcome = String.valueOf(result.get("result"));
            boolean removed = "ok".equals(outcome) || "not found".equals(outcome);

            if (removed) {
                log.info("Deleted Cloudinary asset '{}' (result: {})", publicId, outcome);
            } else {
                log.warn("Cloudinary reported '{}' when deleting '{}'", outcome, publicId);
            }
            return removed;

        } catch (IOException | RuntimeException failure) {
            log.error("Failed to delete Cloudinary asset '{}'", publicId, failure);
            return false;
        }
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    private void requireConfigured() {
        if (!properties.isConfigured()) {
            // A 503 rather than a 400: the request was fine, the server is not.
            throw new MediaConfigurationException(
                    "Media uploads are not available because Cloudinary is not configured. "
                            + "Please contact your administrator.");
        }
    }

    /** Maps Cloudinary's response onto {@link StoredMedia}. */
    private StoredMedia toStoredMedia(Map<String, Object> result,
                                      String targetFolder,
                                      MediaValidationService.ValidatedUpload validated) {

        String secureUrl = asString(result.get("secure_url"));
        String publicId = asString(result.get("public_id"));

        if (secureUrl == null || publicId == null) {
            // Should be impossible for a 200 response, but persisting a row without a
            // URL would leave an unusable asset reference in the database.
            throw new MediaUploadException(
                    "Cloudinary accepted the upload but returned an incomplete response. "
                            + "Please try again.", null);
        }

        return new StoredMedia(
                secureUrl,
                publicId,
                asString(result.get("asset_id")),
                asString(result.get("resource_type")),
                // Cloudinary omits `format` for raw assets; fall back to the extension.
                asString(result.get("format")) != null
                        ? asString(result.get("format"))
                        : validated.extension(),
                asLong(result.get("bytes"), validated.sizeBytes()),
                asInteger(result.get("width")),
                asInteger(result.get("height")),
                targetFolder,
                parseCreatedAt(result.get("created_at")),
                asString(result.get("etag")),
                validated.originalFilename(),
                validated.detectedMimeType(),
                validated.checksumSha256(),
                validated.kind(),
                extractTags(result.get("tags")));
    }

    private static String asString(Object value) {
        if (value == null) {
            return null;
        }
        String text = value.toString();
        return text.isBlank() ? null : text;
    }

    private static Long asLong(Object value, long fallback) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return fallback;
    }

    /** Null for raw and audio assets, which have no pixel dimensions. */
    private static Integer asInteger(Object value) {
        return value instanceof Number number ? number.intValue() : null;
    }

    /** Cloudinary returns an ISO-8601 instant; fall back to now if it is unparsable. */
    private static Instant parseCreatedAt(Object value) {
        String raw = asString(value);
        if (raw == null) {
            return Instant.now();
        }
        try {
            return OffsetDateTime.parse(raw).toInstant();
        } catch (DateTimeParseException notIso) {
            log.debug("Could not parse Cloudinary created_at '{}'; using current time", raw);
            return Instant.now();
        }
    }

    private static List<String> extractTags(Object value) {
        if (value instanceof List<?> list) {
            List<String> tags = new ArrayList<>(list.size());
            list.forEach(item -> {
                if (item != null) {
                    tags.add(item.toString());
                }
            });
            return tags;
        }
        return List.of();
    }

    // -----------------------------------------------------------------------
    // Result and error types
    // -----------------------------------------------------------------------

    /**
     * Everything known about a stored asset.
     *
     * @param secureUrl        https delivery URL
     * @param publicId         Cloudinary identifier, used for deletion and transforms
     * @param assetId          Cloudinary's immutable asset id
     * @param resourceType     {@code image}, {@code video} or {@code raw}
     * @param format           file format, e.g. {@code jpg}
     * @param bytes            stored size
     * @param width            pixel width, null for audio and documents
     * @param height           pixel height, null for audio and documents
     * @param folder           absolute folder the asset was filed into
     * @param uploadedAt       Cloudinary's creation timestamp
     * @param etag             content hash from Cloudinary
     * @param originalFilename sanitised name as supplied by the client
     * @param mimeType         type detected from the file's bytes
     * @param checksumSha256   hex SHA-256 of the contents, for duplicate detection
     * @param kind             the media kind it was validated as
     * @param tags             tags Cloudinary recorded against the asset
     */
    public record StoredMedia(
            String secureUrl,
            String publicId,
            String assetId,
            String resourceType,
            String format,
            Long bytes,
            Integer width,
            Integer height,
            String folder,
            Instant uploadedAt,
            String etag,
            String originalFilename,
            String mimeType,
            String checksumSha256,
            MediaKind kind,
            List<String> tags) {
    }

    /** 502 — Cloudinary was reachable but the upload did not complete. */
    public static class MediaUploadException extends ApiException {
        public MediaUploadException(String message, Throwable cause) {
            super(HttpStatus.BAD_GATEWAY, "MEDIA_UPLOAD_FAILED", message, cause);
        }
    }

    /** 503 — the server is missing the configuration needed to store media. */
    public static class MediaConfigurationException extends ApiException {
        public MediaConfigurationException(String message) {
            super(HttpStatus.SERVICE_UNAVAILABLE, "MEDIA_NOT_CONFIGURED", message);
        }
    }
}

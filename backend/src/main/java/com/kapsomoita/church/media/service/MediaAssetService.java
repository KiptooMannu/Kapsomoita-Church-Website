package com.kapsomoita.church.media.service;

import com.kapsomoita.church.audit.service.AuditService;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.exception.ApiException;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.config.CloudinaryProperties;
import com.kapsomoita.church.media.domain.GalleryCategory;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.domain.MediaFolder;
import com.kapsomoita.church.media.domain.MediaKind;
import com.kapsomoita.church.media.domain.MediaVisibility;
import com.kapsomoita.church.media.dto.MediaDtos.BulkUploadResponse;
import com.kapsomoita.church.media.dto.MediaDtos.FailedUpload;
import com.kapsomoita.church.media.dto.MediaDtos.GalleryCategorySummary;
import com.kapsomoita.church.media.dto.MediaDtos.MediaAssetResponse;
import com.kapsomoita.church.media.dto.MediaDtos.MediaFolderSummary;
import com.kapsomoita.church.media.dto.MediaDtos.UpdateMediaRequest;
import com.kapsomoita.church.media.dto.MediaDtos.UploadMetadata;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import com.kapsomoita.church.media.service.CloudinaryStorageService.StoredMedia;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Orchestrates media uploads: validate, store in Cloudinary, then persist metadata.
 *
 * <h2>Why the transaction boundary is where it is</h2>
 *
 * <p>Cloudinary is not part of the database transaction, and cannot be. If the row
 * were written inside a transaction that later rolled back, the file would remain in
 * Cloudinary with nothing referencing it — an orphan that costs storage and can never
 * be found again through the application.
 *
 * <p>So the upload is deliberately performed <em>outside</em> any transaction, and the
 * metadata is saved in a short one. When that save fails, the Cloudinary asset is
 * explicitly deleted as a compensating action. The database therefore stays the source
 * of truth and never disagrees with storage in the direction that leaks.
 *
 * <p>The residual risk is the reverse: the compensating delete itself fails, leaving an
 * orphan. That is logged at ERROR with the public ID so it can be cleaned up, which is
 * the correct trade — a logged orphan is recoverable, a database row pointing at a
 * missing file renders as a broken image on the public site.
 */
@Service
public class MediaAssetService {

    private static final Logger log = LoggerFactory.getLogger(MediaAssetService.class);

    /** Cap on files per bulk request, to bound request duration and memory. */
    private static final int MAX_FILES_PER_REQUEST = 30;

    private final MediaAssetRepository mediaAssetRepository;
    private final MediaAssetWriter mediaAssetWriter;
    private final CloudinaryStorageService storageService;
    private final CloudinaryProperties cloudinaryProperties;
    private final AuditService auditService;

    public MediaAssetService(MediaAssetRepository mediaAssetRepository,
                             MediaAssetWriter mediaAssetWriter,
                             CloudinaryStorageService storageService,
                             CloudinaryProperties cloudinaryProperties,
                             AuditService auditService) {
        this.mediaAssetRepository = mediaAssetRepository;
        this.mediaAssetWriter = mediaAssetWriter;
        this.storageService = storageService;
        this.cloudinaryProperties = cloudinaryProperties;
        this.auditService = auditService;
    }

    // -----------------------------------------------------------------------
    // Upload
    // -----------------------------------------------------------------------

    /**
     * Uploads one file and records it.
     *
     * <p>Not {@code @Transactional} — see the class comment. The persistence step
     * manages its own transaction.
     */
    public MediaAssetResponse uploadSingle(MultipartFile file,
                                           UploadMetadata metadata,
                                           User actor,
                                           RequestMetadata requestMetadata) {

        MediaFolder folder = resolveFolder(metadata.folder());
        GalleryCategory category = resolveCategory(metadata.category(), folder);
        MediaVisibility visibility = resolveVisibility(metadata.visibility());
        List<String> tags = normaliseTags(metadata.tags());

        // 1. Store the file. Cloudinary creates the destination folder if needed.
        StoredMedia stored = storageService.upload(file, folder, category, tags);

        // 2. Record it, deleting the file again if this fails.
        try {
            MediaAsset saved = mediaAssetWriter.write(stored, metadata, folder, category,
                    visibility, tags, actor == null ? null : actor.getId());

            auditService.recordResourceChange("media.uploaded", actor, "media_asset",
                    saved.getId(), requestMetadata,
                    Map.of("folder", stored.folder(),
                           "publicId", stored.publicId(),
                           "bytes", stored.bytes(),
                           "category", category == null ? "none" : category.name()));

            return MediaAssetResponse.from(saved);

        } catch (RuntimeException persistenceFailure) {
            compensateFailedPersistence(stored, persistenceFailure);
            throw persistenceFailure;
        }
    }

    /**
     * Uploads several files to the same destination.
     *
     * <p>Each file is independent: one failure does not abandon the rest, and the
     * response reports exactly which ones did not make it. Titles are suffixed with an
     * index when more than one file shares the supplied title, so a batch does not
     * produce thirty assets all called "Youth Camp".
     */
    public BulkUploadResponse uploadBatch(List<MultipartFile> files,
                                          UploadMetadata metadata,
                                          User actor,
                                          RequestMetadata requestMetadata) {

        if (files == null || files.isEmpty()) {
            throw new BadRequestException("No files were uploaded.");
        }
        if (files.size() > MAX_FILES_PER_REQUEST) {
            throw new BadRequestException("You can upload at most " + MAX_FILES_PER_REQUEST
                    + " files at once. Please split the batch.");
        }

        // Resolve and validate the shared metadata once, so an invalid folder fails
        // immediately rather than after uploading part of the batch.
        MediaFolder folder = resolveFolder(metadata.folder());
        resolveCategory(metadata.category(), folder);
        resolveVisibility(metadata.visibility());

        List<MediaAssetResponse> uploaded = new ArrayList<>();
        List<FailedUpload> failed = new ArrayList<>();
        boolean numberTitles = files.size() > 1;

        for (int index = 0; index < files.size(); index++) {
            MultipartFile file = files.get(index);
            String filename = file.getOriginalFilename() == null
                    ? "file-" + (index + 1)
                    : file.getOriginalFilename();

            UploadMetadata perFile = numberTitles
                    ? withTitle(metadata, metadata.title() + " (" + (index + 1) + ")")
                    : metadata;

            try {
                uploaded.add(uploadSingle(file, perFile, actor, requestMetadata));
            } catch (ApiException expected) {
                // A rejected file type, an oversized file, a Cloudinary error — all
                // reportable per file without failing the batch.
                log.warn("Batch upload: '{}' failed ({}): {}", filename, expected.getCode(),
                        expected.getMessage());
                failed.add(new FailedUpload(filename, expected.getCode(), expected.getMessage()));
            } catch (RuntimeException unexpected) {
                log.error("Batch upload: '{}' failed unexpectedly", filename, unexpected);
                failed.add(new FailedUpload(filename, "UPLOAD_FAILED",
                        "This file could not be uploaded. Please try again."));
            }
        }

        log.info("Batch upload into {}: {} succeeded, {} failed",
                folder.name(), uploaded.size(), failed.size());

        return BulkUploadResponse.of(uploaded, failed);
    }

    /**
     * Deletes a just-uploaded file after its metadata could not be saved.
     *
     * <p>Never throws: the caller is about to propagate the original failure, which is
     * the one worth reporting.
     */
    private void compensateFailedPersistence(StoredMedia stored, RuntimeException cause) {
        log.error("Could not save metadata for '{}'; removing the uploaded file to avoid an orphan",
                stored.publicId(), cause);

        boolean deleted = storageService.delete(stored.publicId(), stored.kind());
        if (!deleted) {
            // Logged prominently: this is the one case that leaves storage and the
            // database out of step, and it needs manual cleanup.
            log.error("ORPHANED CLOUDINARY ASSET — metadata save failed and the file could not "
                            + "be deleted. Remove it manually: publicId='{}', folder='{}', type={}",
                    stored.publicId(), stored.folder(), stored.resourceType());
        }
    }

    /**
     * The absolute Cloudinary folder for a destination.
     *
     * <p>Exposed so callers that need the path before uploading — the local media
     * importer, checking for an existing copy — can resolve it through the same
     * mapping rather than composing it themselves.
     */
    public String resolveFolderFor(MediaFolder folder, GalleryCategory category) {
        return storageService.resolveFolder(folder, category);
    }

    // -----------------------------------------------------------------------
    // Duplicate detection
    // -----------------------------------------------------------------------

    /**
     * Existing assets whose contents match the given checksum in the same folder.
     *
     * <p>Advisory rather than blocking: the caller decides whether to warn or proceed.
     * Uploading the same image twice is a mistake often enough to be worth flagging,
     * but not always wrong.
     */
    @Transactional(readOnly = true)
    public List<MediaAssetResponse> findDuplicates(String checksumSha256, String folder) {
        if (checksumSha256 == null || checksumSha256.isBlank()) {
            return List.of();
        }
        return mediaAssetRepository.findAllByChecksumSha256AndFolder(checksumSha256, folder)
                .stream()
                .map(MediaAssetResponse::from)
                .toList();
    }

    // -----------------------------------------------------------------------
    // Reads
    // -----------------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<MediaAssetResponse> list(String folderName,
                                         String categoryName,
                                         String visibilityName,
                                         Boolean featured,
                                         String search,
                                         Pageable pageable) {

        MediaFolder folder = folderName == null || folderName.isBlank()
                ? null
                : resolveFolder(folderName);
        GalleryCategory category = categoryName == null || categoryName.isBlank()
                ? null
                : GalleryCategory.from(categoryName).orElseThrow(
                        () -> unknownCategory(categoryName));
        MediaVisibility visibility = visibilityName == null || visibilityName.isBlank()
                ? null
                : resolveVisibility(visibilityName);

        return mediaAssetRepository
                .search(folder, category, visibility, featured, search, pageable)
                .map(MediaAssetResponse::from);
    }

    @Transactional(readOnly = true)
    public MediaAssetResponse get(UUID id) {
        return mediaAssetRepository.findById(id)
                .map(MediaAssetResponse::from)
                .orElseThrow(() -> NotFoundException.of("Media asset", id));
    }

    /** Public gallery listing for one category. */
    @Transactional(readOnly = true)
    public Page<MediaAssetResponse> publicGallery(String categoryName, Pageable pageable) {
        GalleryCategory category = GalleryCategory.from(categoryName)
                .orElseThrow(() -> unknownCategory(categoryName));

        return mediaAssetRepository
                .findAllByGalleryCategoryAndVisibilityOrderBySortOrderAscUploadedAtDesc(
                        category, MediaVisibility.PUBLIC, pageable)
                .map(MediaAssetResponse::from);
    }

    /** Featured images for the homepage gallery preview. */
    @Transactional(readOnly = true)
    public List<MediaAssetResponse> featured(int limit) {
        int capped = Math.clamp(limit, 1, 48);
        return mediaAssetRepository
                .findAllByFeaturedTrueAndVisibilityOrderByUploadedAtDesc(
                        MediaVisibility.PUBLIC,
                        org.springframework.data.domain.PageRequest.of(0, capped))
                .stream()
                .map(MediaAssetResponse::from)
                .toList();
    }

    /** Gallery categories with their public image counts, for the dropdown. */
    @Transactional(readOnly = true)
    public List<GalleryCategorySummary> galleryCategories() {
        Map<GalleryCategory, Long> counts = mediaAssetRepository
                .countByCategory(MediaVisibility.PUBLIC).stream()
                .collect(Collectors.toMap(
                        MediaAssetRepository.CategoryCount::getCategory,
                        MediaAssetRepository.CategoryCount::getTotal,
                        (a, b) -> a,
                        LinkedHashMap::new));

        return GalleryCategory.all().stream()
                .map(category -> new GalleryCategorySummary(
                        category.name(),
                        category.slug(),
                        category.displayName(),
                        storageService.resolveFolder(MediaFolder.GALLERY, category),
                        counts.getOrDefault(category, 0L)))
                .toList();
    }

    /**
     * The full folder map, with limits and allowed types.
     *
     * <p>Lets the admin upload form drive itself from the server's configuration rather
     * than duplicating the folder list, the size caps and the accepted extensions in
     * the frontend — where they would inevitably drift.
     */
    public List<MediaFolderSummary> folders() {
        return MediaFolder.all().stream()
                .map(folder -> {
                    MediaKind kind = folder.expectedKind();
                    return new MediaFolderSummary(
                            folder.name(),
                            folder.isCategoryScoped()
                                    ? folder.resolveRelativePath(GalleryCategory.SUNDAY_SERVICES)
                                            .replace(GalleryCategory.SUNDAY_SERVICES.slug(),
                                                    "{category}")
                                    : folder.resolveRelativePath(),
                            folder.isCategoryScoped()
                                    ? cloudinaryProperties.rootFolder() + "/gallery/{category}"
                                    : storageService.resolveFolder(folder, null),
                            kind.name(),
                            folder.isCategoryScoped(),
                            maxBytesFor(kind),
                            kind.allowedExtensions().stream().sorted().toList());
                })
                .toList();
    }

    private long maxBytesFor(MediaKind kind) {
        return switch (kind) {
            case IMAGE -> cloudinaryProperties.maxImageBytes();
            case VIDEO, AUDIO -> cloudinaryProperties.maxVideoBytes();
            case DOCUMENT -> cloudinaryProperties.maxRawBytes();
        };
    }

    // -----------------------------------------------------------------------
    // Update and delete
    // -----------------------------------------------------------------------

    /** Updates editorial metadata. The stored file is untouched. */
    @Transactional
    public MediaAssetResponse update(UUID id, UpdateMediaRequest request, User actor,
                                     RequestMetadata requestMetadata) {

        MediaAsset asset = mediaAssetRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Media asset", id));

        asset.setTitle(request.title().trim());
        asset.setDescription(blankToNull(request.description()));

        if (request.category() != null && !request.category().isBlank()) {
            GalleryCategory category = GalleryCategory.from(request.category())
                    .orElseThrow(() -> unknownCategory(request.category()));
            // The CHECK constraint forbids a category on a non-gallery asset, so
            // reject it here with a message rather than letting the database do it.
            if (asset.getMediaFolder() != MediaFolder.GALLERY) {
                throw new BadRequestException(
                        "Only gallery assets can have a category.");
            }
            asset.setGalleryCategory(category);
        }

        if (request.visibility() != null && !request.visibility().isBlank()) {
            asset.setVisibility(resolveVisibility(request.visibility()));
        }
        if (request.featured() != null) {
            asset.setFeatured(request.featured());
        }
        if (request.tags() != null) {
            asset.setTags(normaliseTags(request.tags()));
        }
        if (request.sortOrder() != null) {
            asset.setSortOrder(request.sortOrder());
        }

        MediaAsset saved = mediaAssetRepository.save(asset);
        auditService.recordResourceChange("media.updated", actor, "media_asset", id,
                requestMetadata, Map.of("title", saved.getTitle(),
                        "visibility", saved.getVisibility().name()));

        return MediaAssetResponse.from(saved);
    }

    /**
     * Deletes an asset and its stored file.
     *
     * <p>Order matters: the row is removed first, then the file. If the Cloudinary
     * delete fails the file is orphaned — wasted storage, logged for cleanup — whereas
     * deleting the file first and then failing to remove the row would leave a broken
     * image on the public site.
     */
    @Transactional
    public void delete(UUID id, User actor, RequestMetadata requestMetadata) {
        MediaAsset asset = mediaAssetRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Media asset", id));

        String publicId = asset.getPublicId();
        String title = asset.getTitle();
        MediaKind kind = asset.kind();

        mediaAssetRepository.delete(asset);

        boolean deleted = storageService.delete(publicId, kind);
        if (!deleted) {
            log.error("ORPHANED CLOUDINARY ASSET — the database row was deleted but the file "
                    + "remains. Remove it manually: publicId='{}'", publicId);
        }

        auditService.recordResourceChange("media.deleted", actor, "media_asset", id,
                requestMetadata, Map.of("title", title, "publicId", publicId,
                        "fileDeleted", deleted));
    }

    // -----------------------------------------------------------------------
    // Resolution helpers
    // -----------------------------------------------------------------------

    private MediaFolder resolveFolder(String raw) {
        return MediaFolder.from(raw).orElseThrow(() -> new BadRequestException(
                "Unknown destination '" + raw + "'. Valid destinations: "
                        + Arrays.stream(MediaFolder.values()).map(Enum::name)
                                .collect(Collectors.joining(", ")) + "."));
    }

    /**
     * Resolves the gallery category, enforcing the folder's requirement.
     *
     * <p>A category on a non-gallery upload is silently dropped rather than rejected:
     * a client sending a stale form field should not have its upload fail over a value
     * that has no effect.
     */
    private GalleryCategory resolveCategory(String raw, MediaFolder folder) {
        if (!folder.isCategoryScoped()) {
            return null;
        }
        if (raw == null || raw.isBlank()) {
            throw new BadRequestException(
                    "A gallery category is required. Choose one of: "
                            + GalleryCategory.all().stream().map(GalleryCategory::slug)
                                    .collect(Collectors.joining(", ")) + ".");
        }
        return GalleryCategory.from(raw).orElseThrow(() -> unknownCategory(raw));
    }

    private MediaVisibility resolveVisibility(String raw) {
        if (raw == null || raw.isBlank()) {
            return MediaVisibility.PUBLIC;
        }
        return MediaVisibility.from(raw).orElseThrow(() -> new BadRequestException(
                "Unknown visibility '" + raw + "'. Valid values: PUBLIC, INTERNAL, ARCHIVED."));
    }

    private static BadRequestException unknownCategory(String raw) {
        return new BadRequestException("Unknown gallery category '" + raw + "'. Valid categories: "
                + GalleryCategory.all().stream().map(GalleryCategory::slug)
                        .collect(Collectors.joining(", ")) + ".");
    }

    /** Trims, lowercases, de-duplicates and caps the tag list. */
    private static List<String> normaliseTags(List<String> raw) {
        if (raw == null || raw.isEmpty()) {
            return List.of();
        }
        LinkedHashSet<String> normalised = raw.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(tag -> tag.trim().toLowerCase())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        return normalised.stream()
                .limit(com.kapsomoita.church.media.dto.MediaDtos.MAX_TAGS)
                .toList();
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static UploadMetadata withTitle(UploadMetadata metadata, String title) {
        return new UploadMetadata(
                title,
                metadata.description(),
                metadata.folder(),
                metadata.category(),
                metadata.visibility(),
                metadata.featured(),
                metadata.tags(),
                metadata.sortOrder());
    }
}

package com.kapsomoita.church.media.web;

import com.kapsomoita.church.auth.security.SecurityUser;
import com.kapsomoita.church.common.web.ActorResolver;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.media.dto.MediaDtos.BulkUploadResponse;
import com.kapsomoita.church.media.dto.MediaDtos.GalleryCategorySummary;
import com.kapsomoita.church.media.dto.MediaDtos.MediaAssetResponse;
import com.kapsomoita.church.media.dto.MediaDtos.MediaFolderSummary;
import com.kapsomoita.church.media.dto.MediaDtos.UpdateMediaRequest;
import com.kapsomoita.church.media.dto.MediaDtos.UploadMetadata;
import com.kapsomoita.church.media.service.MediaAssetService;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Media upload and management.
 *
 * <p>Uploads are {@code multipart/form-data} with the metadata as a JSON part, which
 * lets one request carry both the file and its editorial fields while keeping the
 * metadata validated by the same bean-validation annotations as any JSON body.
 *
 * <p>Permissions are per-endpoint: the Media Team can upload and delete, an Editor can
 * only amend metadata, and a Volunteer can do neither.
 */
@RestController
@RequestMapping("/api/admin/media")
@Validated
public class MediaController {

    /** Whitelisted sort fields, so a client cannot sort by an arbitrary column. */
    private static final Set<String> SORTABLE_FIELDS =
            Set.of("uploadedAt", "title", "bytes", "sortOrder", "createdAt");

    private final MediaAssetService mediaAssetService;
    private final ActorResolver actorResolver;

    public MediaController(MediaAssetService mediaAssetService, ActorResolver actorResolver) {
        this.mediaAssetService = mediaAssetService;
        this.actorResolver = actorResolver;
    }

    // -----------------------------------------------------------------------
    // Upload
    // -----------------------------------------------------------------------

    /**
     * Uploads a single file.
     *
     * <p>The destination folder is derived from {@code metadata.folder} (and
     * {@code metadata.category} for the gallery) and is created in Cloudinary
     * automatically if it does not yet exist.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('gallery:create') or hasAuthority('sermon:create') "
            + "or hasAuthority('download:create') or hasAuthority('homepage:update')")
    public ResponseEntity<MediaAssetResponse> upload(
            @RequestPart("file") MultipartFile file,
            @Valid @RequestPart("metadata") UploadMetadata metadata,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        MediaAssetResponse uploaded = mediaAssetService.uploadSingle(
                file, metadata, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));

        return ResponseEntity.status(HttpStatus.CREATED).body(uploaded);
    }

    /**
     * Uploads several files to the same destination.
     *
     * <p>Returns 200 with a per-file breakdown rather than failing the whole request on
     * one bad file — see {@code BulkUploadResponse}. A 207-style partial outcome is
     * expressed in the body, which is easier for a client to act on than a status code.
     */
    @PostMapping(path = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('gallery:create') or hasAuthority('sermon:create') "
            + "or hasAuthority('download:create') or hasAuthority('homepage:update')")
    public ResponseEntity<BulkUploadResponse> uploadBatch(
            @RequestPart("files") List<MultipartFile> files,
            @Valid @RequestPart("metadata") UploadMetadata metadata,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        BulkUploadResponse result = mediaAssetService.uploadBatch(
                files, metadata, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));

        return ResponseEntity.ok(result);
    }

    // -----------------------------------------------------------------------
    // Discovery — lets the admin UI build its upload form from the server
    // -----------------------------------------------------------------------

    /** Every destination in the folder map, with its limits and allowed types. */
    @GetMapping("/folders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MediaFolderSummary>> folders() {
        return ResponseEntity.ok(mediaAssetService.folders());
    }

    /** Gallery categories with their image counts, for the category dropdown. */
    @GetMapping("/gallery-categories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<GalleryCategorySummary>> galleryCategories() {
        return ResponseEntity.ok(mediaAssetService.galleryCategories());
    }

    // -----------------------------------------------------------------------
    // Read
    // -----------------------------------------------------------------------

    @GetMapping
    @PreAuthorize("hasAuthority('gallery:read') or hasAuthority('sermon:read') "
            + "or hasAuthority('download:read')")
    public ResponseEntity<PageResponse<MediaAssetResponse>> list(
            @RequestParam(required = false) String folder,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String visibility,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "24") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "uploadedAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        String sortField = SORTABLE_FIELDS.contains(sort) ? sort : "uploadedAt";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        return ResponseEntity.ok(PageResponse.from(mediaAssetService.list(
                folder, category, visibility, featured, search,
                PageRequest.of(page, size, Sort.by(sortDirection, sortField)))));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('gallery:read') or hasAuthority('sermon:read') "
            + "or hasAuthority('download:read')")
    public ResponseEntity<MediaAssetResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(mediaAssetService.get(id));
    }

    // -----------------------------------------------------------------------
    // Update and delete
    // -----------------------------------------------------------------------

    /** Updates editorial metadata. The stored file is never touched. */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('gallery:update') or hasAuthority('sermon:update') "
            + "or hasAuthority('download:update')")
    public ResponseEntity<MediaAssetResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMediaRequest request,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(mediaAssetService.update(id, request,
                actorResolver.resolve(principal), RequestMetadata.from(httpRequest)));
    }

    /** Deletes the metadata row and the stored file. Irreversible. */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('gallery:delete') or hasAuthority('sermon:delete') "
            + "or hasAuthority('download:delete')")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                       @AuthenticationPrincipal SecurityUser principal,
                                       HttpServletRequest httpRequest) {

        mediaAssetService.delete(id, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));
        return ResponseEntity.noContent().build();
    }
}

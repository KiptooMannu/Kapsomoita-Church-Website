package com.kapsomoita.church.media.web;

import com.kapsomoita.church.media.dto.MediaDtos.GalleryCategorySummary;
import com.kapsomoita.church.media.dto.MediaDtos.MediaAssetResponse;
import com.kapsomoita.church.media.service.MediaAssetService;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public, unauthenticated gallery endpoints.
 *
 * <p>Only {@code PUBLIC} assets are ever returned — the service filters on visibility
 * rather than relying on the caller to ask for it, so an internal or archived image
 * cannot leak through a crafted request.
 *
 * <p>Separate from {@code MediaController} on purpose: mixing anonymous reads into the
 * admin controller would mean one permission slip on a shared mapping exposes staff
 * data, whereas here the whole class is intended to be world-readable.
 */
@RestController
@RequestMapping("/api/gallery")
@Validated
public class PublicGalleryController {

    private final MediaAssetService mediaAssetService;

    public PublicGalleryController(MediaAssetService mediaAssetService) {
        this.mediaAssetService = mediaAssetService;
    }

    /**
     * The category list for the gallery navigation.
     *
     * <p>Every category is returned, including empty ones, so the gallery's shape stays
     * stable as photos are added rather than sections appearing and vanishing.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<GalleryCategorySummary>> categories() {
        return ResponseEntity.ok(mediaAssetService.galleryCategories());
    }

    /**
     * Images in one category, newest first within the manual sort order.
     *
     * <p>Accepts either the slug ({@code sunday-services}) or the enum name
     * ({@code SUNDAY_SERVICES}), so a URL stays readable.
     */
    @GetMapping("/categories/{category}")
    public ResponseEntity<PageResponse<MediaAssetResponse>> byCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "24") @Min(1) @Max(60) int size) {

        return ResponseEntity.ok(PageResponse.from(
                mediaAssetService.publicGallery(category, PageRequest.of(page, size))));
    }

    /** Featured images, for the homepage gallery preview. */
    @GetMapping("/featured")
    public ResponseEntity<List<MediaAssetResponse>> featured(
            @RequestParam(defaultValue = "12") @Min(1) @Max(48) int limit) {
        return ResponseEntity.ok(mediaAssetService.featured(limit));
    }
}

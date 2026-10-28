package com.kapsomoita.church.content.web;

import com.kapsomoita.church.content.domain.SiteImage;
import com.kapsomoita.church.content.service.SiteImageService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Public reads and admin replacements for website photographs. */
@RestController
public class SiteImageController {

    private final SiteImageService siteImageService;

    public SiteImageController(SiteImageService siteImageService) {
        this.siteImageService = siteImageService;
    }

    @GetMapping("/api/site-images")
    public List<SiteImageResponse> publicList() {
        return siteImageService.list().stream().map(SiteImageResponse::from).toList();
    }

    @GetMapping("/api/admin/site-images")
    @PreAuthorize("hasAuthority('homepage:read')")
    public List<SiteImageResponse> adminList() {
        return publicList();
    }

    @PutMapping("/api/admin/site-images/{slotKey}")
    @PreAuthorize("hasAuthority('homepage:update')")
    public SiteImageResponse replace(
            @PathVariable String slotKey,
            @Valid @RequestBody SiteImageUpdateRequest request) {
        return SiteImageResponse.from(siteImageService.replace(slotKey, request.imageUrl()));
    }

    public record SiteImageResponse(
            String slotKey,
            String label,
            String groupName,
            String imageUrl,
            String altText,
            int sortOrder) {

        public static SiteImageResponse from(SiteImage image) {
            return new SiteImageResponse(
                    image.getSlotKey(),
                    image.getLabel(),
                    image.getGroupName(),
                    image.getImageUrl(),
                    image.getAltText(),
                    image.getSortOrder());
        }
    }

    public record SiteImageUpdateRequest(
            @Size(max = 1024, message = "That image address is too long.")
            String imageUrl) {
    }
}

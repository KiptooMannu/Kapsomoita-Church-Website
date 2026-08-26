package com.kapsomoita.church.download.web;

import com.kapsomoita.church.download.dto.DownloadDtos.DownloadRequest;
import com.kapsomoita.church.download.dto.DownloadDtos.DownloadResponse;
import com.kapsomoita.church.download.service.DownloadService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    // Public endpoints
    @GetMapping("/downloads")
    public List<DownloadResponse> getPublicDownloads() {
        return downloadService.getPublicDownloads();
    }

    @PostMapping("/downloads/{id}/download")
    public DownloadResponse incrementDownloadCount(@PathVariable UUID id) {
        return downloadService.incrementDownloadCount(id);
    }

    // Admin endpoints
    @GetMapping("/admin/downloads")
    @PreAuthorize("hasAuthority('download:read')")
    public List<DownloadResponse> listDownloads(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String category) {
        return downloadService.listDownloads(published, category);
    }

    @GetMapping("/admin/downloads/{id}")
    @PreAuthorize("hasAuthority('download:read')")
    public DownloadResponse getDownload(@PathVariable UUID id) {
        return downloadService.getDownload(id);
    }

    @PostMapping("/admin/downloads")
    @PreAuthorize("hasAuthority('download:create')")
    public DownloadResponse createDownload(@Valid @RequestBody DownloadRequest request) {
        return downloadService.createDownload(request);
    }

    @PutMapping("/admin/downloads/{id}")
    @PreAuthorize("hasAuthority('download:update')")
    public DownloadResponse updateDownload(@PathVariable UUID id, @Valid @RequestBody DownloadRequest request) {
        return downloadService.updateDownload(id, request);
    }

    @DeleteMapping("/admin/downloads/{id}")
    @PreAuthorize("hasAuthority('download:delete')")
    public void deleteDownload(@PathVariable UUID id) {
        downloadService.deleteDownload(id);
    }
}

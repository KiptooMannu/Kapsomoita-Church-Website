package com.kapsomoita.church.download.service;

import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.download.domain.Download;
import com.kapsomoita.church.download.dto.DownloadDtos.DownloadRequest;
import com.kapsomoita.church.download.dto.DownloadDtos.DownloadResponse;
import com.kapsomoita.church.download.repository.DownloadRepository;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DownloadService {

    private final DownloadRepository downloadRepository;
    private final MediaAssetRepository mediaAssetRepository;

    @Transactional(readOnly = true)
    public List<DownloadResponse> getPublicDownloads() {
        return downloadRepository.findPublished().stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<DownloadResponse> listDownloads(Boolean published, String category) {
        return downloadRepository.search(published, category).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public DownloadResponse getDownload(UUID id) {
        Download download = downloadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Download not found"));
        return toResponse(download);
    }

    @Transactional
    public DownloadResponse createDownload(DownloadRequest request) {
        Download download = new Download();
        applyDownload(download, request);
        download.setDownloadCount(0);
        Download saved = downloadRepository.save(download);
        return toResponse(saved);
    }

    @Transactional
    public DownloadResponse updateDownload(UUID id, DownloadRequest request) {
        Download download = downloadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Download not found"));
        applyDownload(download, request);
        Download saved = downloadRepository.save(download);
        return toResponse(saved);
    }

    @Transactional
    public void deleteDownload(UUID id) {
        Download download = downloadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Download not found"));
        downloadRepository.delete(download);
    }

    @Transactional
    public DownloadResponse incrementDownloadCount(UUID id) {
        Download download = downloadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Download not found"));
        download.setDownloadCount(download.getDownloadCount() + 1);
        Download saved = downloadRepository.save(download);
        return toResponse(saved);
    }

    private void applyDownload(Download download, DownloadRequest request) {
        download.setTitle(request.title().trim());
        download.setDescription(request.description() != null ? request.description().trim() : null);
        download.setCategory(request.category() != null ? request.category().trim() : null);
        
        MediaAsset asset = mediaAssetRepository.findById(request.assetId())
            .orElseThrow(() -> new BadRequestException("Asset not found"));
        download.setAsset(asset);
        
        if (request.published() != null) download.setPublished(request.published());
        if (request.sortOrder() != null) download.setSortOrder(request.sortOrder());
    }

    private DownloadResponse toResponse(Download download) {
        return new DownloadResponse(
            download.getId(),
            download.getTitle(),
            download.getDescription(),
            download.getCategory(),
            download.getAsset().getId(),
            download.getAsset().getSecureUrl(),
            download.getAsset().getOriginalFilename(),
            download.getDownloadCount(),
            download.isPublished(),
            download.getSortOrder(),
            download.getCreatedAt().toString(),
            download.getUpdatedAt().toString()
        );
    }
}

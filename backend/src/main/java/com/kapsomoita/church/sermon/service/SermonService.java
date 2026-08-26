package com.kapsomoita.church.sermon.service;

import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.repository.MediaAssetRepository;
import com.kapsomoita.church.sermon.domain.Sermon;
import com.kapsomoita.church.sermon.repository.SermonRepository;
import com.kapsomoita.church.sermon.dto.SermonDtos.SermonRequest;
import com.kapsomoita.church.sermon.dto.SermonDtos.SermonResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SermonService {

    private final SermonRepository sermonRepository;
    private final MediaAssetRepository mediaAssetRepository;

    @Transactional(readOnly = true)
    public List<SermonResponse> getPublicSermons(Pageable pageable) {
        return sermonRepository.findPublished(pageable).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<SermonResponse> getFeaturedSermons(Pageable pageable) {
        return sermonRepository.findFeatured(pageable).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public SermonResponse getPublicSermonBySlug(String slug) {
        Sermon sermon = sermonRepository.findBySlug(slug)
            .orElseThrow(() -> new NotFoundException("Sermon not found"));
        
        if (!sermon.isPublished()) {
            throw new NotFoundException("Sermon not found");
        }
        
        return toResponse(sermon);
    }

    @Transactional(readOnly = true)
    public Page<SermonResponse> listSermons(Boolean published, String search, Pageable pageable) {
        return sermonRepository.search(published, search, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public SermonResponse getSermon(UUID id) {
        Sermon sermon = sermonRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Sermon not found"));
        return toResponse(sermon);
    }

    @Transactional
    public SermonResponse createSermon(SermonRequest request) {
        if (sermonRepository.findBySlug(request.slug()).isPresent()) {
            throw new BadRequestException("Slug already exists");
        }
        
        Sermon sermon = new Sermon();
        applySermon(sermon, request);
        sermon.setViewCount(0);
        Sermon saved = sermonRepository.save(sermon);
        return toResponse(saved);
    }

    @Transactional
    public SermonResponse updateSermon(UUID id, SermonRequest request) {
        Sermon sermon = sermonRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Sermon not found"));
        
        // Check if slug changed and conflicts with another sermon
        if (!sermon.getSlug().equals(request.slug())) {
            sermonRepository.findBySlug(request.slug()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BadRequestException("Slug already exists");
                }
            });
        }
        
        applySermon(sermon, request);
        Sermon saved = sermonRepository.save(sermon);
        return toResponse(saved);
    }

    @Transactional
    public void deleteSermon(UUID id) {
        Sermon sermon = sermonRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Sermon not found"));
        sermonRepository.delete(sermon);
    }

    @Transactional
    public SermonResponse incrementViewCount(UUID id) {
        Sermon sermon = sermonRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Sermon not found"));
        sermon.setViewCount(sermon.getViewCount() + 1);
        Sermon saved = sermonRepository.save(sermon);
        return toResponse(saved);
    }

    private void applySermon(Sermon sermon, SermonRequest request) {
        sermon.setTitle(request.title().trim());
        sermon.setSlug(request.slug().trim().toLowerCase());
        sermon.setSpeaker(request.speaker().trim());
        sermon.setPreachedOn(request.preachedOn());
        sermon.setSeries(request.series() != null ? request.series().trim() : null);
        sermon.setTopic(request.topic() != null ? request.topic().trim() : null);
        sermon.setBibleReference(request.bibleReference() != null ? request.bibleReference().trim() : null);
        sermon.setSummary(request.summary() != null ? request.summary().trim() : null);
        sermon.setDurationMinutes(request.durationMinutes());
        sermon.setVideoUrl(request.videoUrl() != null ? request.videoUrl().trim() : null);
        
        if (request.videoAssetId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.videoAssetId())
                .orElseThrow(() -> new BadRequestException("Video asset not found"));
            sermon.setVideoAsset(asset);
        } else {
            sermon.setVideoAsset(null);
        }
        
        if (request.audioAssetId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.audioAssetId())
                .orElseThrow(() -> new BadRequestException("Audio asset not found"));
            sermon.setAudioAsset(asset);
        } else {
            sermon.setAudioAsset(null);
        }
        
        if (request.notesAssetId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.notesAssetId())
                .orElseThrow(() -> new BadRequestException("Notes asset not found"));
            sermon.setNotesAsset(asset);
        } else {
            sermon.setNotesAsset(null);
        }
        
        if (request.thumbnailId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.thumbnailId())
                .orElseThrow(() -> new BadRequestException("Thumbnail asset not found"));
            sermon.setThumbnail(asset);
        } else {
            sermon.setThumbnail(null);
        }
        
        if (request.published() != null) sermon.setPublished(request.published());
        if (request.featured() != null) sermon.setFeatured(request.featured());
    }

    private SermonResponse toResponse(Sermon sermon) {
        return new SermonResponse(
            sermon.getId(),
            sermon.getTitle(),
            sermon.getSlug(),
            sermon.getSpeaker(),
            sermon.getPreachedOn(),
            sermon.getSeries(),
            sermon.getTopic(),
            sermon.getBibleReference(),
            sermon.getSummary(),
            sermon.getDurationMinutes(),
            sermon.getVideoUrl(),
            sermon.getVideoAsset() != null ? sermon.getVideoAsset().getId() : null,
            sermon.getVideoAsset() != null ? sermon.getVideoAsset().getSecureUrl() : null,
            sermon.getAudioAsset() != null ? sermon.getAudioAsset().getId() : null,
            sermon.getAudioAsset() != null ? sermon.getAudioAsset().getSecureUrl() : null,
            sermon.getNotesAsset() != null ? sermon.getNotesAsset().getId() : null,
            sermon.getNotesAsset() != null ? sermon.getNotesAsset().getSecureUrl() : null,
            sermon.getThumbnail() != null ? sermon.getThumbnail().getId() : null,
            sermon.getThumbnail() != null ? sermon.getThumbnail().getSecureUrl() : null,
            sermon.isPublished(),
            sermon.isFeatured(),
            sermon.getViewCount(),
            sermon.getCreatedBy() != null ? sermon.getCreatedBy().getFullName() : null,
            sermon.getCreatedAt().toString(),
            sermon.getUpdatedAt().toString()
        );
    }
}

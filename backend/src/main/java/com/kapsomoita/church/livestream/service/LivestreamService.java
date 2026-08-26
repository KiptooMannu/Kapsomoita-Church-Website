package com.kapsomoita.church.livestream.service;

import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.livestream.domain.Livestream;
import com.kapsomoita.church.livestream.dto.LivestreamDtos.LivestreamRequest;
import com.kapsomoita.church.livestream.dto.LivestreamDtos.LivestreamResponse;
import com.kapsomoita.church.livestream.repository.LivestreamRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LivestreamService {

    private final LivestreamRepository livestreamRepository;

    @Transactional(readOnly = true)
    public LivestreamResponse getLivestream() {
        Livestream livestream = livestreamRepository.findById(1)
            .orElseGet(() -> {
                Livestream newLivestream = new Livestream();
                newLivestream.setId(1);
                newLivestream.setCreatedAt(Instant.now());
                newLivestream.setUpdatedAt(Instant.now());
                return livestreamRepository.save(newLivestream);
            });
        return toResponse(livestream);
    }

    @Transactional
    public LivestreamResponse updateLivestream(LivestreamRequest request) {
        Livestream livestream = livestreamRepository.findById(1)
            .orElseGet(() -> {
                Livestream newLivestream = new Livestream();
                newLivestream.setId(1);
                newLivestream.setCreatedAt(Instant.now());
                return newLivestream;
            });
        
        applyLivestream(livestream, request);
        livestream.setUpdatedAt(Instant.now());
        Livestream saved = livestreamRepository.save(livestream);
        return toResponse(saved);
    }

    private void applyLivestream(Livestream livestream, LivestreamRequest request) {
        if (request.title() != null) livestream.setTitle(request.title().trim());
        if (request.platform() != null) livestream.setPlatform(request.platform().trim().toUpperCase());
        if (request.streamUrl() != null) livestream.setStreamUrl(request.streamUrl().trim());
        if (request.embedUrl() != null) livestream.setEmbedUrl(request.embedUrl().trim());
        if (request.scheduledFor() != null) livestream.setScheduledFor(request.scheduledFor());
        if (request.offlineMessage() != null) livestream.setOfflineMessage(request.offlineMessage().trim());
        if (request.isLive() != null) livestream.setLive(request.isLive());
    }

    private LivestreamResponse toResponse(Livestream livestream) {
        return new LivestreamResponse(
            livestream.getId(),
            livestream.isLive(),
            livestream.getTitle(),
            livestream.getPlatform(),
            livestream.getStreamUrl(),
            livestream.getEmbedUrl(),
            livestream.getScheduledFor(),
            livestream.getOfflineMessage(),
            livestream.getUpdatedBy() != null ? livestream.getUpdatedBy().getFullName() : null,
            livestream.getCreatedAt().toString(),
            livestream.getUpdatedAt().toString()
        );
    }
}

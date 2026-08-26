package com.kapsomoita.church.livestream.web;

import com.kapsomoita.church.livestream.dto.LivestreamDtos.LivestreamRequest;
import com.kapsomoita.church.livestream.dto.LivestreamDtos.LivestreamResponse;
import com.kapsomoita.church.livestream.service.LivestreamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LivestreamController {

    private final LivestreamService livestreamService;

    // Public endpoint
    @GetMapping("/livestream")
    public LivestreamResponse getLivestream() {
        return livestreamService.getLivestream();
    }

    // Admin endpoint
    @PutMapping("/admin/livestream")
    @PreAuthorize("hasAuthority('livestream:update')")
    public LivestreamResponse updateLivestream(@Valid @RequestBody LivestreamRequest request) {
        return livestreamService.updateLivestream(request);
    }
}

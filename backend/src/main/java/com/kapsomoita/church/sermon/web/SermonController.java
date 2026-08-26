package com.kapsomoita.church.sermon.web;

import com.kapsomoita.church.sermon.dto.SermonDtos.SermonRequest;
import com.kapsomoita.church.sermon.dto.SermonDtos.SermonResponse;
import com.kapsomoita.church.sermon.service.SermonService;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
public class SermonController {

    private final SermonService sermonService;

    // Public endpoints
    @GetMapping("/sermons")
    public List<SermonResponse> getPublicSermons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("preachedOn").descending());
        return sermonService.getPublicSermons(pageable);
    }

    @GetMapping("/sermons/featured")
    public List<SermonResponse> getFeaturedSermons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("preachedOn").descending());
        return sermonService.getFeaturedSermons(pageable);
    }

    @GetMapping("/sermons/{slug}")
    public SermonResponse getPublicSermonBySlug(@PathVariable String slug) {
        return sermonService.getPublicSermonBySlug(slug);
    }

    @PostMapping("/sermons/{id}/view")
    public SermonResponse incrementViewCount(@PathVariable UUID id) {
        return sermonService.incrementViewCount(id);
    }

    // Admin endpoints
    @GetMapping("/admin/sermons")
    @PreAuthorize("hasAuthority('sermon:read')")
    public PageResponse<SermonResponse> listSermons(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("preachedOn").descending());
        Page<SermonResponse> result = sermonService.listSermons(published, search, pageable);
        return PageResponse.from(result);
    }

    @GetMapping("/admin/sermons/{id}")
    @PreAuthorize("hasAuthority('sermon:read')")
    public SermonResponse getSermon(@PathVariable UUID id) {
        return sermonService.getSermon(id);
    }

    @PostMapping("/admin/sermons")
    @PreAuthorize("hasAuthority('sermon:create')")
    public SermonResponse createSermon(@Valid @RequestBody SermonRequest request) {
        return sermonService.createSermon(request);
    }

    @PutMapping("/admin/sermons/{id}")
    @PreAuthorize("hasAuthority('sermon:update')")
    public SermonResponse updateSermon(@PathVariable UUID id, @Valid @RequestBody SermonRequest request) {
        return sermonService.updateSermon(id, request);
    }

    @DeleteMapping("/admin/sermons/{id}")
    @PreAuthorize("hasAuthority('sermon:delete')")
    public void deleteSermon(@PathVariable UUID id) {
        sermonService.deleteSermon(id);
    }
}

package com.kapsomoita.church.content.service;

import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.content.domain.SiteImage;
import com.kapsomoita.church.content.repository.SiteImageRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteImageService {

    private final SiteImageRepository siteImageRepository;

    public SiteImageService(SiteImageRepository siteImageRepository) {
        this.siteImageRepository = siteImageRepository;
    }

    @Transactional(readOnly = true)
    public List<SiteImage> list() {
        return siteImageRepository.findAllByOrderByGroupNameAscSortOrderAsc();
    }

    @Transactional
    public SiteImage replace(String slotKey, String imageUrl) {
        SiteImage image = siteImageRepository.findById(slotKey)
                .orElseThrow(() -> new NotFoundException("That photo is not on the website."));
        String next = imageUrl == null ? null : imageUrl.trim();
        image.setImageUrl(next == null || next.isEmpty() ? null : next);
        image.setUpdatedAt(Instant.now());
        return siteImageRepository.save(image);
    }
}

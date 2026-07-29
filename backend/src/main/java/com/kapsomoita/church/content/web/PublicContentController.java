package com.kapsomoita.church.content.web;

import com.kapsomoita.church.content.dto.ContentDtos.AnnouncementResponse;
import com.kapsomoita.church.content.dto.ContentDtos.LeaderResponse;
import com.kapsomoita.church.content.dto.ContentDtos.ServiceTimeResponse;
import com.kapsomoita.church.content.dto.ContentDtos.TestimonialResponse;
import com.kapsomoita.church.content.service.ContentService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public content endpoints for the website frontend. */
@RestController
@RequestMapping("/api")
public class PublicContentController {

    private final ContentService contentService;

    public PublicContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/announcements")
    public List<AnnouncementResponse> getAnnouncements() {
        return contentService.publicAnnouncements();
    }

    @GetMapping("/service-times")
    public List<ServiceTimeResponse> getServiceTimes() {
        return contentService.publicServiceTimes();
    }

    @GetMapping("/leaders")
    public List<LeaderResponse> getLeaders() {
        return contentService.publicLeaders();
    }

    @GetMapping("/testimonials")
    public List<TestimonialResponse> getTestimonials() {
        return contentService.publicTestimonials(6);
    }
}

package com.kapsomoita.church.outreach.web;

import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageResponse;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestResponse;
import com.kapsomoita.church.outreach.service.OutreachService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoints for submitting contact messages and prayer requests.
 */
@RestController
@RequestMapping("/api")
public class OutreachPublicController {

    private final OutreachService outreachService;

    public OutreachPublicController(OutreachService outreachService) {
        this.outreachService = outreachService;
    }

    // ---------------------------------------------------------------------
    // Contact Messages (public submit)
    // ---------------------------------------------------------------------
    @PostMapping("/contact-messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessageResponse submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        return outreachService.submitContactMessage(request);
    }

    // ---------------------------------------------------------------------
    // Prayer Requests (public submit)
    // ---------------------------------------------------------------------
    @PostMapping("/prayer-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public PrayerRequestResponse submitPrayerRequest(@Valid @RequestBody PrayerRequestRequest request) {
        return outreachService.submitPrayerRequest(request);
    }
}

package com.kapsomoita.church.outreach.web;

import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageResponse;
import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageStatusRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestResponse;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestStatusRequest;
import com.kapsomoita.church.outreach.service.OutreachService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Admin endpoints for listing and managing contact messages and prayer requests. */
@RestController
@RequestMapping("/api/admin/outreach")
public class AdminOutreachController {

    private final OutreachService outreachService;

    public AdminOutreachController(OutreachService outreachService) {
        this.outreachService = outreachService;
    }

    // ---------------------------------------------------------------------
    // Contact Messages (admin)
    // ---------------------------------------------------------------------
    @GetMapping("/contact-messages")
    @PreAuthorize("hasAuthority('contact_message:read')")
    public Page<ContactMessageResponse> listContactMessages(@RequestParam(required = false) String search,
                                                             Pageable pageable) {
        return outreachService.listContactMessages(search, pageable);
    }

    @PutMapping("/contact-messages/{id}/status")
    @PreAuthorize("hasAuthority('contact_message:update')")
    public ContactMessageResponse updateStatus(@PathVariable java.util.UUID id,
                                                @Valid @RequestBody ContactMessageStatusRequest req) {
        return outreachService.updateContactMessageStatus(id, req.status());
    }

    @DeleteMapping("/contact-messages/{id}")
    @PreAuthorize("hasAuthority('contact_message:delete')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContactMessage(@PathVariable java.util.UUID id) {
        outreachService.deleteContactMessage(id);
    }

    // ---------------------------------------------------------------------
    // Prayer Requests (admin)
    // ---------------------------------------------------------------------
    @GetMapping("/prayer-requests")
    @PreAuthorize("hasAuthority('prayer_request:read')")
    public Page<PrayerRequestResponse> listPrayerRequests(@RequestParam(required = false) String search,
                                                             Pageable pageable) {
        return outreachService.listPrayerRequests(search, pageable);
    }

    @PutMapping("/prayer-requests/{id}/status")
    @PreAuthorize("hasAuthority('prayer_request:update')")
    public PrayerRequestResponse updateStatus(@PathVariable java.util.UUID id,
                                              @Valid @RequestBody PrayerRequestStatusRequest req) {
        return outreachService.updatePrayerRequestStatus(id, req.status());
    }

    @DeleteMapping("/prayer-requests/{id}")
    @PreAuthorize("hasAuthority('prayer_request:delete')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePrayerRequest(@PathVariable java.util.UUID id) {
        outreachService.deletePrayerRequest(id);
    }
}

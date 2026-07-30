package com.kapsomoita.church.outreach.service;

import com.kapsomoita.church.common.exception.ResourceNotFoundException;
import com.kapsomoita.church.outreach.domain.ContactMessage;
import com.kapsomoita.church.outreach.domain.ContactMessage.Status;
import com.kapsomoita.church.outreach.domain.PrayerRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.ContactMessageResponse;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestRequest;
import com.kapsomoita.church.outreach.dto.OutreachDtos.PrayerRequestResponse;
import com.kapsomoita.church.outreach.repository.ContactMessageRepository;
import com.kapsomoita.church.outreach.repository.PrayerRequestRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Business logic for outreach forms (contact messages, prayer requests).
 */
@Service
@Transactional
public class OutreachService {

    private final ContactMessageRepository contactRepo;
    private final PrayerRequestRepository prayerRepo;

    public OutreachService(ContactMessageRepository contactRepo,
                           PrayerRequestRepository prayerRepo) {
        this.contactRepo = contactRepo;
        this.prayerRepo = prayerRepo;
    }

    // -----------------------------------------------------------------------
    // Contact Messages
    // -----------------------------------------------------------------------

    public ContactMessageResponse submitContactMessage(ContactMessageRequest req) {
        ContactMessage msg = new ContactMessage();
        msg.setFullName(req.fullName());
        msg.setEmail(req.email());
        msg.setPhone(req.phone());
        msg.setSubject(req.subject());
        msg.setMessage(req.message());
        return ContactMessageResponse.from(contactRepo.save(msg));
    }

    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> listContactMessages(String search, Pageable pageable) {
        return contactRepo.search(search, pageable).map(ContactMessageResponse::from);
    }

    public ContactMessageResponse updateContactMessageStatus(UUID id, String statusStr) {
        ContactMessage msg = contactRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));
        msg.setStatus(Status.valueOf(statusStr.toUpperCase()));
        return ContactMessageResponse.from(contactRepo.save(msg));
    }

    public void deleteContactMessage(UUID id) {
        if (!contactRepo.existsById(id)) {
            throw new ResourceNotFoundException("Contact message not found");
        }
        contactRepo.deleteById(id);
    }

    // -----------------------------------------------------------------------
    // Prayer Requests
    // -----------------------------------------------------------------------

    public PrayerRequestResponse submitPrayerRequest(PrayerRequestRequest req) {
        PrayerRequest request = new PrayerRequest();
        request.setRequestorName(req.requestorName());
        request.setPhone(req.phone());
        request.setIntention(req.intention());
        request.setConfidential(req.confidential() != null && req.confidential());
        return PrayerRequestResponse.from(prayerRepo.save(request));
    }

    @Transactional(readOnly = true)
    public Page<PrayerRequestResponse> listPrayerRequests(String search, Pageable pageable) {
        return prayerRepo.search(search, pageable).map(PrayerRequestResponse::from);
    }

    public PrayerRequestResponse updatePrayerRequestStatus(UUID id, String statusStr) {
        PrayerRequest req = prayerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prayer request not found"));
        req.setStatus(PrayerRequest.Status.valueOf(statusStr.toUpperCase()));
        return PrayerRequestResponse.from(prayerRepo.save(req));
    }

    public void deletePrayerRequest(UUID id) {
        if (!prayerRepo.existsById(id)) {
            throw new ResourceNotFoundException("Prayer request not found");
        }
        prayerRepo.deleteById(id);
    }
}

package com.kapsomoita.church.donation.web;

import com.kapsomoita.church.donation.domain.Donation;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationRequest;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationResponse;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationSummaryResponse;
import com.kapsomoita.church.donation.service.DonationService;
import jakarta.validation.Valid;
import java.time.Instant;
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
public class DonationController {

    private final DonationService donationService;

    // Public endpoint
    @PostMapping("/donations")
    public DonationResponse createDonation(@Valid @RequestBody DonationRequest request) {
        return donationService.createDonation(request);
    }

    // Admin endpoints
    @GetMapping("/admin/donations")
    @PreAuthorize("hasAuthority('donation:read')")
    public Page<DonationResponse> listDonations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String purpose,
            @RequestParam(required = false) Long startDate,
            @RequestParam(required = false) Long endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Donation.DonationStatus statusEnum = null;
        if (status != null) {
            try {
                statusEnum = Donation.DonationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                statusEnum = null;
            }
        }
        
        Donation.DonationPurpose purposeEnum = null;
        if (purpose != null) {
            try {
                purposeEnum = Donation.DonationPurpose.valueOf(purpose.toUpperCase());
            } catch (IllegalArgumentException e) {
                purposeEnum = null;
            }
        }
        
        Instant startInstant = startDate != null ? Instant.ofEpochMilli(startDate) : null;
        Instant endInstant = endDate != null ? Instant.ofEpochMilli(endDate) : null;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return donationService.listDonations(statusEnum, purposeEnum, startInstant, endInstant, pageable);
    }

    @GetMapping("/admin/donations/summary")
    @PreAuthorize("hasAuthority('donation:read')")
    public DonationSummaryResponse getDonationSummary(
            @RequestParam(required = false) String purpose,
            @RequestParam(required = false) Long startDate,
            @RequestParam(required = false) Long endDate) {
        
        Donation.DonationPurpose purposeEnum = null;
        if (purpose != null) {
            try {
                purposeEnum = Donation.DonationPurpose.valueOf(purpose.toUpperCase());
            } catch (IllegalArgumentException e) {
                purposeEnum = null;
            }
        }
        
        Instant startInstant = startDate != null ? Instant.ofEpochMilli(startDate) : null;
        Instant endInstant = endDate != null ? Instant.ofEpochMilli(endDate) : null;
        
        return donationService.getDonationSummary(purposeEnum, startInstant, endInstant);
    }

    @GetMapping("/admin/donations/{id}")
    @PreAuthorize("hasAuthority('donation:read')")
    public DonationResponse getDonation(@PathVariable UUID id) {
        return donationService.getDonation(id);
    }

    @PutMapping("/admin/donations/{id}")
    @PreAuthorize("hasAuthority('donation:update')")
    public DonationResponse updateDonation(@PathVariable UUID id, @Valid @RequestBody DonationRequest request) {
        return donationService.updateDonation(id, request);
    }

    @DeleteMapping("/admin/donations/{id}")
    @PreAuthorize("hasAuthority('donation:delete')")
    public void deleteDonation(@PathVariable UUID id) {
        donationService.deleteDonation(id);
    }
}

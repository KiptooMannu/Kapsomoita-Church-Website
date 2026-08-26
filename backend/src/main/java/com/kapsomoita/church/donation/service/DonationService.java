package com.kapsomoita.church.donation.service;

import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.donation.domain.Donation;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationRequest;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationResponse;
import com.kapsomoita.church.donation.dto.DonationDtos.DonationSummaryResponse;
import com.kapsomoita.church.donation.repository.DonationRepository;
import com.kapsomoita.church.donation.domain.Donation.DonationMethod;
import com.kapsomoita.church.donation.domain.Donation.DonationPurpose;
import com.kapsomoita.church.donation.domain.Donation.DonationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;

    @Transactional
    public DonationResponse createDonation(DonationRequest request) {
        // Check for duplicate provider reference
        if (request.providerReference() != null && !request.providerReference().isBlank()) {
            donationRepository.findByProviderReference(request.providerReference()).ifPresent(existing -> {
                throw new BadRequestException("A donation with this provider reference already exists");
            });
        }
        
        Donation donation = new Donation();
        applyDonation(donation, request);
        donation.setCreatedAt(Instant.now());
        donation.setUpdatedAt(Instant.now());
        
        Donation saved = donationRepository.save(donation);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<DonationResponse> listDonations(DonationStatus status, DonationPurpose purpose, 
                                                 Instant startDate, Instant endDate, Pageable pageable) {
        return donationRepository.search(status, purpose, startDate, endDate, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public DonationResponse getDonation(UUID id) {
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Donation not found"));
        return toResponse(donation);
    }

    @Transactional
    public DonationResponse updateDonation(UUID id, DonationRequest request) {
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Donation not found"));
        
        // Check for duplicate provider reference if it changed
        if (request.providerReference() != null && !request.providerReference().isBlank()) {
            if (!request.providerReference().equals(donation.getProviderReference())) {
                donationRepository.findByProviderReference(request.providerReference()).ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("A donation with this provider reference already exists");
                    }
                });
            }
        }
        
        applyDonation(donation, request);
        donation.setUpdatedAt(Instant.now());
        
        Donation saved = donationRepository.save(donation);
        return toResponse(saved);
    }

    @Transactional
    public void deleteDonation(UUID id) {
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Donation not found"));
        donationRepository.delete(donation);
    }

    @Transactional(readOnly = true)
    public DonationSummaryResponse getDonationSummary(DonationPurpose purpose, Instant startDate, Instant endDate) {
        BigDecimal totalAmount = donationRepository.getTotalByPurposeAndDateRange(purpose, startDate, endDate);
        long totalCount = donationRepository.search(
            DonationStatus.COMPLETED, purpose, startDate, endDate, Pageable.unpaged()).getTotalElements();
        return new DonationSummaryResponse(totalAmount, totalCount);
    }

    private void applyDonation(Donation donation, DonationRequest request) {
        donation.setDonorName(request.donorName() != null ? request.donorName().trim() : null);
        donation.setDonorEmail(request.donorEmail() != null ? request.donorEmail().trim() : null);
        donation.setDonorPhone(request.donorPhone() != null ? request.donorPhone().trim() : null);
        donation.setAmount(request.amount());
        donation.setCurrency(request.currency() != null ? request.currency().trim().toUpperCase() : "KES");
        
        if (request.method() != null) {
            try {
                donation.setMethod(DonationMethod.valueOf(request.method().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid payment method. Use MPESA, BANK, PAYPAL, CARD, or CASH.");
            }
        }
        
        if (request.purpose() != null) {
            try {
                donation.setPurpose(DonationPurpose.valueOf(request.purpose().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid purpose. Use TITHE, OFFERING, BUILDING, MISSIONS, or OTHER.");
            }
        }
        
        if (request.status() != null) {
            try {
                DonationStatus newStatus = DonationStatus.valueOf(request.status().toUpperCase());
                donation.setStatus(newStatus);
                
                // Set completed_at when status changes to COMPLETED
                if (newStatus == DonationStatus.COMPLETED && donation.getCompletedAt() == null) {
                    donation.setCompletedAt(Instant.now());
                }
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status. Use PENDING, COMPLETED, FAILED, or REFUNDED.");
            }
        }
        
        donation.setProviderReference(request.providerReference() != null ? request.providerReference().trim() : null);
        donation.setProviderPayload(request.providerPayload());
        donation.setNotes(request.notes() != null ? request.notes().trim() : null);
    }

    private DonationResponse toResponse(Donation donation) {
        return new DonationResponse(
            donation.getId(),
            donation.getDonorName(),
            donation.getDonorEmail(),
            donation.getDonorPhone(),
            donation.getAmount(),
            donation.getCurrency(),
            donation.getMethod().name(),
            donation.getPurpose().name(),
            donation.getStatus().name(),
            donation.getProviderReference(),
            donation.getNotes(),
            donation.getCompletedAt() != null ? donation.getCompletedAt().toString() : null,
            donation.getCreatedAt().toString(),
            donation.getUpdatedAt().toString()
        );
    }
}

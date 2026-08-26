package com.kapsomoita.church.donation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class DonationDtos {

    private DonationDtos() {
    }

    public record DonationRequest(
            @Size(max = 180, message = "That name is too long.")
            String donorName,

            @Email(message = "Please provide a valid email address.")
            @Size(max = 255, message = "That email is too long.")
            String donorEmail,

            @Size(max = 32, message = "That phone number is too long.")
            String donorPhone,

            @NotNull(message = "An amount is required.")
            @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
            BigDecimal amount,

            @Size(max = 3, message = "That currency code is too long.")
            String currency,

            @NotNull(message = "A payment method is required.")
            String method,

            String purpose,

            String status,

            @Size(max = 120, message = "That provider reference is too long.")
            String providerReference,

            String providerPayload,

            @Size(max = 5000, message = "Please keep notes under 5000 characters.")
            String notes
    ) {}

    public record DonationResponse(
            UUID id,
            String donorName,
            String donorEmail,
            String donorPhone,
            BigDecimal amount,
            String currency,
            String method,
            String purpose,
            String status,
            String providerReference,
            String notes,
            String completedAt,
            String createdAt,
            String updatedAt
    ) {}

    public record DonationSummaryResponse(
            BigDecimal totalAmount,
            long totalCount
    ) {}
}

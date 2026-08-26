package com.kapsomoita.church.donation.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "donations")
@Getter
@Setter
public class Donation extends BaseEntity {

    @Column(name = "donor_name", length = 180)
    private String donorName;

    @Column(name = "donor_email", length = 255)
    private String donorEmail;

    @Column(name = "donor_phone", length = 32)
    private String donorPhone;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "KES";

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 16)
    private DonationMethod method;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 24)
    private DonationPurpose purpose = DonationPurpose.OFFERING;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private DonationStatus status = DonationStatus.PENDING;

    @Column(name = "provider_reference", length = 120, unique = true)
    private String providerReference;

    @Column(name = "provider_payload", columnDefinition = "jsonb")
    private String providerPayload;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "completed_at")
    private Instant completedAt;

    public enum DonationMethod {
        MPESA, BANK, PAYPAL, CARD, CASH
    }

    public enum DonationPurpose {
        TITHE, OFFERING, BUILDING, MISSIONS, OTHER
    }

    public enum DonationStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}

package com.kapsomoita.church.donation.repository;

import com.kapsomoita.church.donation.domain.Donation;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {

    Optional<Donation> findByProviderReference(String reference);

    @Query("""
            SELECT d FROM Donation d
            WHERE (:status IS NULL OR d.status = :status)
              AND (:purpose IS NULL OR d.purpose = :purpose)
              AND (:startDate IS NULL OR d.createdAt >= :startDate)
              AND (:endDate IS NULL OR d.createdAt <= :endDate)
            ORDER BY d.createdAt DESC
            """)
    Page<Donation> search(
            @Param("status") Donation.DonationStatus status,
            @Param("purpose") Donation.DonationPurpose purpose,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(d.amount), 0) FROM Donation d
            WHERE d.status = 'COMPLETED'
              AND (:purpose IS NULL OR d.purpose = :purpose)
              AND (:startDate IS NULL OR d.createdAt >= :startDate)
              AND (:endDate IS NULL OR d.createdAt <= :endDate)
            """)
    BigDecimal getTotalByPurposeAndDateRange(
            @Param("purpose") Donation.DonationPurpose purpose,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);
}

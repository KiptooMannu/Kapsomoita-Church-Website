package com.kapsomoita.church.outreach.repository;

import com.kapsomoita.church.outreach.domain.PrayerRequest;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrayerRequestRepository extends JpaRepository<PrayerRequest, UUID> {

    @Query("""
           SELECT r FROM PrayerRequest r
           WHERE (:search IS NULL OR
                  LOWER(COALESCE(r.requestorName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(r.intention) LIKE LOWER(CONCAT('%', :search, '%')))
           """)
    Page<PrayerRequest> search(@Param("search") String search, Pageable pageable);
}

package com.kapsomoita.church.ministry.repository;

import com.kapsomoita.church.ministry.domain.ApplicationEnums.ApplicationStatus;
import com.kapsomoita.church.ministry.domain.MinistryApplication;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MinistryApplicationRepository extends JpaRepository<MinistryApplication, UUID> {

    /**
     * Paged, filtered review queue.
     *
     * <p>Every filter is null-tolerant, so the controller needs no branching between
     * "everything" and each combination of filters.
     */
    @Query("""
            SELECT a FROM MinistryApplication a
            WHERE (:status IS NULL OR a.status = :status)
              AND (:ministrySlug IS NULL OR :ministrySlug = '' OR a.ministrySlug = :ministrySlug)
              AND (:search IS NULL OR :search = ''
                   OR lower(a.fullName) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(a.email)    LIKE lower(CONCAT('%', :search, '%'))
                   OR a.phone           LIKE CONCAT('%', :search, '%'))
            """)
    Page<MinistryApplication> search(@Param("status") ApplicationStatus status,
                                     @Param("ministrySlug") String ministrySlug,
                                     @Param("search") String search,
                                     Pageable pageable);

    /**
     * Recent applications from the same person to the same ministry.
     *
     * <p>Used to spot an accidental double submission — someone pressing the button
     * twice, or reapplying a minute later — without blocking a genuine reapplication
     * months down the line.
     */
    @Query("""
            SELECT a FROM MinistryApplication a
            WHERE lower(a.email) = lower(:email)
              AND a.ministrySlug = :ministrySlug
              AND a.createdAt > :since
            """)
    List<MinistryApplication> findRecentDuplicates(@Param("email") String email,
                                                   @Param("ministrySlug") String ministrySlug,
                                                   @Param("since") Instant since);

    long countByStatus(ApplicationStatus status);

    /** Per-ministry pending counts, for the admin dashboard. */
    @Query("""
            SELECT a.ministrySlug AS ministrySlug, a.ministryName AS ministryName,
                   COUNT(a) AS total
            FROM MinistryApplication a
            WHERE a.status = :status
            GROUP BY a.ministrySlug, a.ministryName
            ORDER BY COUNT(a) DESC
            """)
    List<MinistryCount> countByMinistry(@Param("status") ApplicationStatus status);

    /** Ordered export of the whole queue, respecting the status filter. */
    @Query("""
            SELECT a FROM MinistryApplication a
            WHERE (:status IS NULL OR a.status = :status)
            ORDER BY a.createdAt DESC
            """)
    List<MinistryApplication> findAllForExport(@Param("status") ApplicationStatus status);

    /** Projection for {@link #countByMinistry}. */
    interface MinistryCount {
        String getMinistrySlug();

        String getMinistryName();

        long getTotal();
    }
}

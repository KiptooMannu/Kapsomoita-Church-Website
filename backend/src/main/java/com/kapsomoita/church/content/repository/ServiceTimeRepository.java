package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.ServiceTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTimeRepository extends JpaRepository<ServiceTime, UUID> {

    @Query("SELECT s FROM ServiceTime s WHERE s.published = TRUE ORDER BY s.sortOrder ASC")
    List<ServiceTime> findPublished();

    @Query("SELECT s FROM ServiceTime s ORDER BY s.sortOrder ASC")
    List<ServiceTime> findAllOrdered();

    Optional<ServiceTime> findByPrimaryTrue();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ServiceTime s SET s.primary = FALSE WHERE s.primary = TRUE AND s.id <> :keepId")
    int clearPrimaryExcept(@Param("keepId") UUID keepId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ServiceTime s SET s.primary = FALSE WHERE s.primary = TRUE")
    int clearAllPrimary();
}

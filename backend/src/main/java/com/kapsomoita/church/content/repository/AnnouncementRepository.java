package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.Announcement;
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
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {

    @Query("""
            SELECT a FROM Announcement a
            WHERE a.published = TRUE
              AND (a.startsAt IS NULL OR a.startsAt <= :now)
              AND (a.endsAt IS NULL OR a.endsAt > :now)
            ORDER BY a.pinned DESC, a.sortOrder ASC, a.createdAt DESC
            """)
    List<Announcement> findLive(@Param("now") Instant now, Pageable pageable);

    @Query("""
            SELECT a FROM Announcement a
            WHERE (:published IS NULL OR a.published = :published)
              AND (:search IS NULL OR :search = ''
                   OR lower(a.title) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(a.body)  LIKE lower(CONCAT('%', :search, '%')))
            ORDER BY a.pinned DESC, a.sortOrder ASC, a.createdAt DESC
            """)
    Page<Announcement> search(@Param("published") Boolean published,
                              @Param("search") String search,
                              Pageable pageable);

    long countByPublishedTrue();
}

package com.kapsomoita.church.event.repository;

import com.kapsomoita.church.event.domain.Event;
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
public interface EventRepository extends JpaRepository<Event, UUID> {

    Optional<Event> findBySlug(String slug);

    @Query("""
            SELECT e FROM Event e
            WHERE e.published = TRUE
              AND e.startsAt >= :now
            ORDER BY e.startsAt ASC
            """)
    List<Event> findUpcoming(@Param("now") Instant now, Pageable pageable);

    @Query("""
            SELECT e FROM Event e
            WHERE e.published = TRUE AND e.featured = TRUE
              AND e.startsAt >= :now
            ORDER BY e.startsAt ASC
            """)
    List<Event> findFeatured(@Param("now") Instant now, Pageable pageable);

    @Query("""
            SELECT e FROM Event e
            WHERE (:published IS NULL OR e.published = :published)
              AND (:search IS NULL OR :search = ''
                   OR lower(e.title) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(e.description) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(e.venue) LIKE lower(CONCAT('%', :search, '%')))
            ORDER BY e.startsAt DESC, e.createdAt DESC
            """)
    Page<Event> search(@Param("published") Boolean published,
                      @Param("search") String search,
                      Pageable pageable);
}

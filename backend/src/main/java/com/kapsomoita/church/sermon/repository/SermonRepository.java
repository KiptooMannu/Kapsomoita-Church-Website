package com.kapsomoita.church.sermon.repository;

import com.kapsomoita.church.sermon.domain.Sermon;
import java.time.LocalDate;
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
public interface SermonRepository extends JpaRepository<Sermon, UUID> {

    Optional<Sermon> findBySlug(String slug);

    @Query("""
            SELECT s FROM Sermon s
            WHERE s.published = TRUE
            ORDER BY s.preachedOn DESC, s.createdAt DESC
            """)
    List<Sermon> findPublished(Pageable pageable);

    @Query("""
            SELECT s FROM Sermon s
            WHERE s.published = TRUE AND s.featured = TRUE
            ORDER BY s.preachedOn DESC
            """)
    List<Sermon> findFeatured(Pageable pageable);

    @Query("""
            SELECT s FROM Sermon s
            WHERE (:published IS NULL OR s.published = :published)
              AND (:search IS NULL OR :search = ''
                   OR lower(s.title) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(s.speaker) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(s.series) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(s.topic) LIKE lower(CONCAT('%', :search, '%')))
            ORDER BY s.preachedOn DESC, s.createdAt DESC
            """)
    Page<Sermon> search(@Param("published") Boolean published,
                       @Param("search") String search,
                       Pageable pageable);

    List<Sermon> findBySeries(String series);
}

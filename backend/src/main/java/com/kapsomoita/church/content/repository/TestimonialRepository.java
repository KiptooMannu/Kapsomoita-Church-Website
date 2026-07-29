package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.Testimonial;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {

    @Query("""
            SELECT t FROM Testimonial t LEFT JOIN FETCH t.photo
            WHERE t.published = TRUE
            ORDER BY t.featured DESC, t.sortOrder ASC, t.createdAt DESC
            """)
    List<Testimonial> findPublished(Pageable pageable);

    @Query("""
            SELECT t FROM Testimonial t
            WHERE (:published IS NULL OR t.published = :published)
            ORDER BY t.sortOrder ASC, t.createdAt DESC
            """)
    Page<Testimonial> search(@Param("published") Boolean published, Pageable pageable);

    long countByPublishedTrue();
}

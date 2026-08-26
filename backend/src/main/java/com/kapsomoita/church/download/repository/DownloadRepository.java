package com.kapsomoita.church.download.repository;

import com.kapsomoita.church.download.domain.Download;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DownloadRepository extends JpaRepository<Download, UUID> {

    @Query("""
            SELECT d FROM Download d
            WHERE d.published = TRUE
            ORDER BY d.category, d.sortOrder ASC, d.createdAt DESC
            """)
    List<Download> findPublished();

    @Query("""
            SELECT d FROM Download d
            WHERE (:published IS NULL OR d.published = :published)
              AND (:category IS NULL OR d.category = :category)
            ORDER BY d.category, d.sortOrder ASC, d.createdAt DESC
            """)
    List<Download> search(@Param("published") Boolean published, @Param("category") String category);
}

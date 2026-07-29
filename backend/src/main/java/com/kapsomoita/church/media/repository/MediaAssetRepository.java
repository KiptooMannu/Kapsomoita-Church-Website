package com.kapsomoita.church.media.repository;

import com.kapsomoita.church.media.domain.GalleryCategory;
import com.kapsomoita.church.media.domain.MediaAsset;
import com.kapsomoita.church.media.domain.MediaFolder;
import com.kapsomoita.church.media.domain.MediaVisibility;
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
public interface MediaAssetRepository extends JpaRepository<MediaAsset, UUID> {

    Optional<MediaAsset> findByPublicIdAndResourceType(String publicId, String resourceType);

    boolean existsByPublicIdAndResourceType(String publicId, String resourceType);

    /**
     * Finds existing copies of identical content.
     *
     * <p>Scoped to a folder so filing the same photo under two gallery categories is
     * still allowed — that is a legitimate editorial choice, not a mistake — while a
     * genuine re-upload into the same place is detectable.
     */
    List<MediaAsset> findAllByChecksumSha256AndFolder(String checksumSha256, String folder);

    /**
     * Paged admin listing with optional filters.
     *
     * <p>Each filter is null-tolerant so the controller needs no branching between
     * "list everything" and the various filtered forms.
     */
    @Query("""
            SELECT m FROM MediaAsset m
            WHERE (:mediaFolder IS NULL OR m.mediaFolder = :mediaFolder)
              AND (:category IS NULL OR m.galleryCategory = :category)
              AND (:visibility IS NULL OR m.visibility = :visibility)
              AND (:featured IS NULL OR m.featured = :featured)
              AND (:search IS NULL OR :search = ''
                   OR lower(m.title) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(m.description) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(m.originalFilename) LIKE lower(CONCAT('%', :search, '%')))
            """)
    Page<MediaAsset> search(@Param("mediaFolder") MediaFolder mediaFolder,
                            @Param("category") GalleryCategory category,
                            @Param("visibility") MediaVisibility visibility,
                            @Param("featured") Boolean featured,
                            @Param("search") String search,
                            Pageable pageable);

    /** Public gallery page for one category. */
    Page<MediaAsset> findAllByGalleryCategoryAndVisibilityOrderBySortOrderAscUploadedAtDesc(
            GalleryCategory category, MediaVisibility visibility, Pageable pageable);

    /** Featured images for the homepage gallery preview. */
    List<MediaAsset> findAllByFeaturedTrueAndVisibilityOrderByUploadedAtDesc(
            MediaVisibility visibility, Pageable pageable);

    /** Assets for a non-gallery destination, e.g. every leadership photo. */
    List<MediaAsset> findAllByMediaFolderAndVisibilityOrderBySortOrderAscUploadedAtDesc(
            MediaFolder mediaFolder, MediaVisibility visibility);

    long countByVisibility(MediaVisibility visibility);

    long countByGalleryCategory(GalleryCategory category);

    /** Per-category counts, for the gallery overview and dashboard tiles. */
    @Query("""
            SELECT m.galleryCategory AS category, COUNT(m) AS total
            FROM MediaAsset m
            WHERE m.galleryCategory IS NOT NULL AND m.visibility = :visibility
            GROUP BY m.galleryCategory
            """)
    List<CategoryCount> countByCategory(@Param("visibility") MediaVisibility visibility);

    /** Total bytes stored, for a storage-usage figure on the dashboard. */
    @Query("SELECT COALESCE(SUM(m.bytes), 0) FROM MediaAsset m")
    long sumBytes();

    /** Projection for {@link #countByCategory}. */
    interface CategoryCount {
        GalleryCategory getCategory();

        long getTotal();
    }
}

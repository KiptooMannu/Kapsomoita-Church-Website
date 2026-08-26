package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.HomepageItem;
import com.kapsomoita.church.content.domain.HomepageItem.Category;
import com.kapsomoita.church.content.domain.HomepageItem.Status;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HomepageItemRepository extends JpaRepository<HomepageItem, UUID> {

    List<HomepageItem> findByStatusOrderByDisplayOrderAsc(Status status);

    List<HomepageItem> findByCategoryAndStatusOrderByDisplayOrderAsc(Category category, Status status);

    List<HomepageItem> findByFeaturedTrueAndStatusOrderByDisplayOrderAsc(Status status);

    @Query("SELECT h FROM HomepageItem h WHERE h.status = 'PUBLISHED' ORDER BY h.displayOrder ASC")
    List<HomepageItem> findPublishedItems();

    @Query("SELECT h FROM HomepageItem h WHERE h.status = 'PUBLISHED' AND h.featured = true ORDER BY h.displayOrder ASC")
    List<HomepageItem> findFeaturedPublishedItems();

    @Query("SELECT h FROM HomepageItem h WHERE h.category = :category AND h.status = 'PUBLISHED' ORDER BY h.displayOrder ASC")
    List<HomepageItem> findPublishedByCategory(@Param("category") Category category);

    long countByStatus(Status status);
}
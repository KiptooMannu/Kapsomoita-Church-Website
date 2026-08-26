package com.kapsomoita.church.settings.repository;

import com.kapsomoita.church.settings.domain.ChurchSetting;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChurchSettingRepository extends JpaRepository<ChurchSetting, String> {

    Optional<ChurchSetting> findBySettingKey(String settingKey);

    @Query("""
            SELECT s FROM ChurchSetting s
            WHERE s.publicSetting = TRUE
            ORDER BY s.category, s.sortOrder ASC
            """)
    List<ChurchSetting> findPublic();

    @Query("""
            SELECT s FROM ChurchSetting s
            WHERE (:category IS NULL OR s.category = :category)
            ORDER BY s.category, s.sortOrder ASC
            """)
    List<ChurchSetting> search(@Param("category") String category);
}

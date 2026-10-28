package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.SiteImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteImageRepository extends JpaRepository<SiteImage, String> {

    List<SiteImage> findAllByOrderByGroupNameAscSortOrderAsc();
}

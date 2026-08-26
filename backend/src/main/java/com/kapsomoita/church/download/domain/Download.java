package com.kapsomoita.church.download.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.media.domain.MediaAsset;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "downloads")
@Getter
@Setter
public class Download extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "category", length = 64)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private MediaAsset asset;

    @Column(name = "published", nullable = false)
    private boolean published = true;

    @Column(name = "download_count", nullable = false)
    private long downloadCount = 0;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;
}

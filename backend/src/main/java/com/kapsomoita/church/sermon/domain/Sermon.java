package com.kapsomoita.church.sermon.domain;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.media.domain.MediaAsset;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sermons")
@Getter
@Setter
public class Sermon extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "slug", nullable = false, length = 220, unique = true)
    private String slug;

    @Column(name = "speaker", nullable = false, length = 180)
    private String speaker;

    @Column(name = "preached_on", nullable = false)
    private LocalDate preachedOn;

    @Column(name = "series", length = 160)
    private String series;

    @Column(name = "topic", length = 160)
    private String topic;

    @Column(name = "bible_reference", length = 200)
    private String bibleReference;

    @Column(name = "summary", columnDefinition = "text")
    private String summary;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_asset_id")
    private MediaAsset videoAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audio_asset_id")
    private MediaAsset audioAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notes_asset_id")
    private MediaAsset notesAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thumbnail_id")
    private MediaAsset thumbnail;

    @Column(name = "published", nullable = false)
    private boolean published = false;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Column(name = "view_count", nullable = false)
    private long viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}

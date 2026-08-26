package com.kapsomoita.church.event.domain;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.media.domain.MediaAsset;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "slug", nullable = false, length = 220, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "starts_at", nullable = false)
    private Instant startsAt;

    @Column(name = "ends_at")
    private Instant endsAt;

    @Column(name = "venue", nullable = false, length = 200)
    private String venue;

    @Column(name = "capacity")
    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_id")
    private MediaAsset banner;

    @Column(name = "registration_open", nullable = false)
    private boolean registrationOpen = true;

    @Column(name = "published", nullable = false)
    private boolean published = false;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Column(name = "map_url", length = 500)
    private String mapUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}

package com.kapsomoita.church.content.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Homepage content items that can be managed through the admin panel
 * and displayed on the public landing page.
 */
@Entity
@Table(name = "homepage_items")
@Getter
@Setter
public class HomepageItem extends BaseEntity {

    public enum Status {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }

    public enum Category {
        HERO_BANNER,
        ANNOUNCEMENT,
        EVENT,
        MINISTRY,
        SERMON,
        TESTIMONIAL,
        FEATURE
    }

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 32)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private Status status = Status.DRAFT;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "link_url", length = 512)
    private String linkUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_featured")
    private boolean featured = false;

    @Column(name = "published_at")
    private java.time.Instant publishedAt;

    @Column(name = "scheduled_for")
    private java.time.Instant scheduledFor;
}
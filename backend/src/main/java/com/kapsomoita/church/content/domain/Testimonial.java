package com.kapsomoita.church.content.domain;

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

/**
 * A member's testimony.
 *
 * <p>Defaults to unpublished. A testimony concerns a real person's life, so it should
 * reach the public site only after someone has deliberately approved it — the opposite
 * default would publish on save.
 */
@Entity
@Table(name = "testimonials")
@Getter
@Setter
public class Testimonial extends BaseEntity {

    @Column(name = "quote", nullable = false, columnDefinition = "text")
    private String quote;

    /** Nullable so a testimony can be published anonymously. */
    @Column(name = "author_name", length = 180)
    private String authorName;

    @Column(name = "author_role", length = 160)
    private String authorRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id")
    private MediaAsset photo;

    @Column(name = "published", nullable = false)
    private boolean published = false;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    /** Attribution for display, falling back to a neutral label when anonymous. */
    public String displayAuthor() {
        return authorName != null && !authorName.isBlank() ? authorName : "Church member";
    }
}

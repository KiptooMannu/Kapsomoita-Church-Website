package com.kapsomoita.church.content.domain;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.content.domain.ContentEnums.AnnouncementTone;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

/**
 * A church announcement shown on the homepage.
 *
 * <p>Uses Lombok for accessors — the earlier entities were written with explicit
 * getters and setters, which added hundreds of lines that said nothing.
 */
@Entity
@Table(name = "announcements")
@Getter
@Setter
public class Announcement extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "body", nullable = false, columnDefinition = "text")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "tone", nullable = false, length = 16)
    private AnnouncementTone tone = AnnouncementTone.INFO;

    /**
     * Human-readable date such as "Every Sunday" or "Date to be confirmed".
     *
     * <p>Free text rather than a date, because most church announcements are not tied
     * to one calendar day and forcing a date would produce fictional precision.
     */
    @Column(name = "display_date", length = 120)
    private String displayDate;

    /**
     * Event date for calendar-style display.
     */
    @Column(name = "event_date")
    private Instant eventDate;

    /**
     * Event end date for multi-day events.
     */
    @Column(name = "event_end_date")
    private Instant eventEndDate;

    /**
     * Event location.
     */
    @Column(name = "event_location", length = 200)
    private String eventLocation;

    /**
     * Image URL for calendar-style display.
     */
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    /**
     * Media asset ID for the announcement image.
     */
    @Column(name = "image_id")
    private java.util.UUID imageId;

    @Column(name = "link_label", length = 80)
    private String linkLabel;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "published", nullable = false)
    private boolean published = true;

    /** Pinned announcements sort above everything else. */
    @Column(name = "pinned", nullable = false)
    private boolean pinned = false;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "ends_at")
    private Instant endsAt;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    /**
     * True when this should currently appear on the public site.
     *
     * <p>Evaluated in Java as well as in the query so a single fetched announcement
     * can be checked without re-querying.
     */
    public boolean isCurrentlyVisible() {
        if (!published) {
            return false;
        }
        Instant now = Instant.now();
        boolean started = startsAt == null || !startsAt.isAfter(now);
        boolean notEnded = endsAt == null || endsAt.isAfter(now);
        return started && notEnded;
    }
}

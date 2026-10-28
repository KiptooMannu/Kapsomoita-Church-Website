package com.kapsomoita.church.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

/**
 * A photograph the public site shows in a fixed place.
 *
 * The slot key is stable (hero1, ministryYouth, gallery3). The URL is what the
 * admin replaces. Leader portraits are not stored here — those belong on the
 * leader record.
 */
@Entity
@Table(name = "site_images")
@Getter
@Setter
public class SiteImage {

    @Id
    @Column(name = "slot_key", length = 64)
    private String slotKey;

    @Column(name = "label", nullable = false, length = 160)
    private String label;

    @Column(name = "group_name", nullable = false, length = 64)
    private String groupName;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(name = "alt_text", nullable = false, length = 300)
    private String altText = "";

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}

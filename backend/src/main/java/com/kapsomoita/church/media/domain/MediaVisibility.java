package com.kapsomoita.church.media.domain;

import java.util.Arrays;
import java.util.Optional;

/**
 * Whether an asset is shown on the public website.
 *
 * <p>Deleting is destructive and irreversible in Cloudinary, so {@link #ARCHIVED}
 * gives staff a way to take something down without losing it — the common case when
 * a photo needs pulling because someone in it asked.
 */
public enum MediaVisibility {

    /** Visible to website visitors. */
    PUBLIC("Public"),

    /** Visible in the admin dashboard only. */
    INTERNAL("Internal"),

    /** Hidden everywhere but retained in storage. */
    ARCHIVED("Archived");

    private final String displayName;

    MediaVisibility(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }

    /** True when assets in this state should appear on the public site. */
    public boolean isPubliclyVisible() {
        return this == PUBLIC;
    }

    public static Optional<MediaVisibility> from(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalised = raw.trim().toUpperCase();
        return Arrays.stream(values()).filter(v -> v.name().equals(normalised)).findFirst();
    }
}

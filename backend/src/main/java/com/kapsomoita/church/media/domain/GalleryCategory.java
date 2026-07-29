package com.kapsomoita.church.media.domain;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * The gallery categories from the platform specification.
 *
 * <p>Each carries the folder slug it maps to under {@code church/gallery/}. Because
 * the slug lives here rather than in a mapping table elsewhere, selecting a
 * category in the admin UI is all that is needed to route an upload to the right
 * folder — and the same value drives which public gallery page the image appears
 * on, so no manual filing step exists.
 *
 * <p>Slugs are part of the stored folder path. Renaming one would orphan already
 * uploaded assets, so treat them as immutable; add a new constant instead.
 */
public enum GalleryCategory {

    SUNDAY_SERVICES("sunday-services", "Sunday Services"),
    YOUTH("youth", "Youth"),
    WOMEN("women", "Women"),
    MEN("men", "Men"),
    CHILDREN("children", "Children"),
    CHOIR("choir", "Choir"),
    PRAYER("prayer", "Prayer"),
    EVANGELISM("evangelism", "Evangelism"),
    MISSIONS("missions", "Missions"),
    CONFERENCES("conferences", "Conferences"),
    BAPTISMS("baptisms", "Baptism"),
    WEDDINGS("weddings", "Wedding"),
    EASTER("easter", "Easter"),
    CHRISTMAS("christmas", "Christmas"),
    HARVEST("harvest", "Harvest"),
    OUTREACH("outreach", "Community Outreach"),
    CONSTRUCTION("construction", "Construction");

    private final String slug;
    private final String displayName;

    GalleryCategory(String slug, String displayName) {
        this.slug = slug;
        this.displayName = displayName;
    }

    /** Folder segment under {@code church/gallery/}. */
    public String slug() {
        return slug;
    }

    /** Label shown in the admin dropdown and on the public gallery. */
    public String displayName() {
        return displayName;
    }

    /**
     * Resolves from either the enum name or the slug, case-insensitively.
     *
     * <p>Accepting both means the API tolerates {@code SUNDAY_SERVICES} and
     * {@code sunday-services} equally, so a client is never rejected over a
     * cosmetic difference in casing or separator.
     */
    public static Optional<GalleryCategory> from(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String trimmed = raw.trim();
        String asName = trimmed.toUpperCase().replace('-', '_');
        String asSlug = trimmed.toLowerCase().replace('_', '-');

        return Arrays.stream(values())
                .filter(category -> category.name().equals(asName) || category.slug.equals(asSlug))
                .findFirst();
    }

    public static List<GalleryCategory> all() {
        return List.of(values());
    }
}

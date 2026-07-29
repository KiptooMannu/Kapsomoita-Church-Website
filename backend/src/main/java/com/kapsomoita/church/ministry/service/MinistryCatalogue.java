package com.kapsomoita.church.ministry.service;

import java.util.List;
import java.util.Optional;

/**
 * The ministries a visitor may apply to.
 *
 * <p>Server-side authority for which slugs are valid. The frontend has its own richer
 * record of each ministry (descriptions, meeting times, photographs) in
 * {@code src/config/ministries.ts}, but that is presentation content and cannot be
 * trusted for validation — a request need not come from our own form.
 *
 * <p>The two lists must stay in step: <strong>a slug added here must also be added
 * there, and vice versa.</strong> This duplication is deliberate and temporary; it
 * disappears once the Ministries CMS module makes the database the single source and
 * both sides read from it.
 */
final class MinistryCatalogue {

    private MinistryCatalogue() {
    }

    /**
     * A ministry that can receive applications.
     *
     * @param slug                  URL-safe identifier, matching the frontend's slug
     * @param name                  display name, stored on each application
     * @param acceptingApplications whether the form is open
     */
    record Ministry(String slug, String name, boolean acceptingApplications) {
    }

    /** Mirrors {@code ministryDetails} in the frontend config. */
    private static final List<Ministry> MINISTRIES = List.of(
            new Ministry("youth", "Youth Ministry", true),
            new Ministry("women", "Women's Ministry", true),
            new Ministry("men", "Men's Ministry", true),
            new Ministry("kids", "Kids Ministry", true),
            new Ministry("sunday-school", "Sunday School", true),
            new Ministry("choir", "Choir", true),
            new Ministry("praise-team", "Praise Team", true),
            new Ministry("prayer", "Prayer Ministry", true),
            new Ministry("evangelism", "Evangelism", true),
            new Ministry("missions", "Missions", true),
            new Ministry("media", "Media Ministry", true));

    /** Case-insensitive, underscore-tolerant lookup by slug. */
    static Optional<Ministry> find(String slug) {
        if (slug == null || slug.isBlank()) {
            return Optional.empty();
        }
        String normalised = slug.trim().toLowerCase().replace('_', '-');
        return MINISTRIES.stream()
                .filter(ministry -> ministry.slug().equals(normalised))
                .findFirst();
    }

    static List<Ministry> all() {
        return MINISTRIES;
    }
}

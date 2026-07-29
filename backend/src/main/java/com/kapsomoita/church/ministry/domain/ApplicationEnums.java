package com.kapsomoita.church.ministry.domain;

import java.util.Arrays;
import java.util.Optional;

/**
 * Enumerations for ministry applications.
 *
 * <p>Grouped in one file because they are small, closely related, and only ever used
 * together. Each name must match the corresponding CHECK constraint in migration V3.
 */
public final class ApplicationEnums {

    private ApplicationEnums() {
    }

    /** Where an application sits in the review workflow. */
    public enum ApplicationStatus {
        /** Awaiting review. The state every application starts in. */
        PENDING("Pending"),
        APPROVED("Approved"),
        REJECTED("Rejected"),
        /** Closed and filed away, without approving or rejecting. */
        ARCHIVED("Archived");

        private final String displayName;

        ApplicationStatus(String displayName) {
            this.displayName = displayName;
        }

        public String displayName() {
            return displayName;
        }

        /** True for a state that represents a completed review. */
        public boolean isReviewed() {
            return this != PENDING;
        }

        public static Optional<ApplicationStatus> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /**
     * Applicant gender.
     *
     * <p>Includes an explicit opt-out rather than making the field optional, so a
     * blank value cannot be confused with a submission that failed to record it.
     */
    public enum Gender {
        MALE("Male"),
        FEMALE("Female"),
        PREFER_NOT_TO_SAY("Prefer not to say");

        private final String displayName;

        Gender(String displayName) {
            this.displayName = displayName;
        }

        public String displayName() {
            return displayName;
        }

        public static Optional<Gender> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /**
     * Age band.
     *
     * <p>Bands rather than a date of birth: the church needs to know which ministry
     * suits an applicant, not their exact age, and collecting less personal data is
     * the better default.
     */
    public enum AgeGroup {
        UNDER_13("Under 13"),
        AGE_13_17("13–17"),
        AGE_18_24("18–24"),
        AGE_25_34("25–34"),
        AGE_35_49("35–49"),
        AGE_50_64("50–64"),
        AGE_65_PLUS("65+");

        private final String displayName;

        AgeGroup(String displayName) {
            this.displayName = displayName;
        }

        public String displayName() {
            return displayName;
        }

        /** True for a band requiring parental consent before joining a ministry. */
        public boolean isMinor() {
            return this == UNDER_13 || this == AGE_13_17;
        }

        public static Optional<AgeGroup> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /** Case-insensitive, hyphen-tolerant enum lookup shared by the types above. */
    private static <E extends Enum<E>> Optional<E> lookup(E[] values, String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalised = raw.trim().toUpperCase().replace('-', '_');
        return Arrays.stream(values).filter(value -> value.name().equals(normalised)).findFirst();
    }
}

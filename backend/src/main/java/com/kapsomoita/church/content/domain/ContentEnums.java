package com.kapsomoita.church.content.domain;

import java.util.Arrays;
import java.util.Optional;

/**
 * Enumerations shared by the content modules.
 *
 * <p>Every name must match the corresponding CHECK constraint in migration V5.
 * Persisted with {@code @Enumerated(STRING)}, never ordinal — an ordinal column
 * silently remaps existing rows the moment a constant is inserted or reordered.
 */
public final class ContentEnums {

    private ContentEnums() {
    }

    /** Visual emphasis for an announcement. Always paired with text, never colour alone. */
    public enum AnnouncementTone {
        INFO("Notice"),
        SUCCESS("Good news"),
        WARNING("Important");

        private final String label;

        AnnouncementTone(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }

        public static Optional<AnnouncementTone> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /**
     * Day a service meets.
     *
     * <p>Deliberately not {@code java.time.DayOfWeek}: this needs a display label and
     * a stable persisted name of our own choosing, and reusing the JDK enum would tie
     * the column to its ordering.
     */
    public enum ServiceDay {
        SUNDAY("Sunday", 1),
        MONDAY("Monday", 2),
        TUESDAY("Tuesday", 3),
        WEDNESDAY("Wednesday", 4),
        THURSDAY("Thursday", 5),
        FRIDAY("Friday", 6),
        SATURDAY("Saturday", 7);

        private final String label;
        private final int weekPosition;

        ServiceDay(String label, int weekPosition) {
            this.label = label;
            this.weekPosition = weekPosition;
        }

        public String label() {
            return label;
        }

        /** Sunday-first ordering, matching how the church lists its week. */
        public int weekPosition() {
            return weekPosition;
        }

        public static Optional<ServiceDay> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /** Which group a leader is listed under. */
    public enum LeaderTeam {
        PASTORAL("Pastoral team"),
        MINISTRY("Ministry leaders"),
        SUPPORT("Support team");

        private final String label;

        LeaderTeam(String label) {
            this.label = label;
        }

        public String label() {
            return label;
        }

        public static Optional<LeaderTeam> from(String raw) {
            return lookup(values(), raw);
        }
    }

    /** Case-insensitive, hyphen-tolerant lookup shared by the types above. */
    private static <E extends Enum<E>> Optional<E> lookup(E[] values, String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalised = raw.trim().toUpperCase().replace('-', '_');
        return Arrays.stream(values).filter(v -> v.name().equals(normalised)).findFirst();
    }
}

package com.kapsomoita.church.auth.domain;

import java.util.Arrays;
import java.util.Optional;

/**
 * The six system roles from the platform specification.
 *
 * <p>Roles live in the database so grants can be tuned without a redeploy; this
 * enum exists so application code can refer to them without magic strings. The
 * names must match the {@code roles.name} values seeded in V1.
 */
public enum RoleName {

    SUPER_ADMIN("Super Admin"),
    PASTOR("Pastor"),
    SECRETARY("Secretary"),
    MEDIA_TEAM("Media Team"),
    EDITOR("Editor"),
    VOLUNTEER("Volunteer");

    /** Spring Security's convention for role authorities. */
    public static final String AUTHORITY_PREFIX = "ROLE_";

    private final String displayName;

    RoleName(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }

    /** The authority string as it appears in a security context, e.g. {@code ROLE_PASTOR}. */
    public String authority() {
        return AUTHORITY_PREFIX + name();
    }

    public static Optional<RoleName> from(String raw) {
        if (raw == null) {
            return Optional.empty();
        }
        String normalised = raw.trim().toUpperCase();
        return Arrays.stream(values()).filter(r -> r.name().equals(normalised)).findFirst();
    }
}

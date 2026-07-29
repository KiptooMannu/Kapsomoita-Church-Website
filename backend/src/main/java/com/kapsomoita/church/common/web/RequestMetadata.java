package com.kapsomoita.church.common.web;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Extracts the client details worth recording on sessions and audit entries.
 *
 * @param ipAddress best-effort client IP
 * @param userAgent raw User-Agent header, truncated to the column width
 */
public record RequestMetadata(String ipAddress, String userAgent) {

    /** Matches the {@code user_agent} column width in the schema. */
    private static final int USER_AGENT_MAX_LENGTH = 400;

    /**
     * Proxy headers in priority order. The app sits behind a platform load
     * balancer in production, so {@code getRemoteAddr()} alone would record the
     * proxy rather than the visitor.
     */
    private static final String[] FORWARDED_HEADERS = {
            "CF-Connecting-IP",   // Cloudflare
            "X-Real-IP",          // nginx
            "X-Forwarded-For"     // generic; may be a comma-separated chain
    };

    public static RequestMetadata from(HttpServletRequest request) {
        if (request == null) {
            return new RequestMetadata(null, null);
        }
        return new RequestMetadata(resolveIp(request), truncate(request.getHeader("User-Agent")));
    }

    private static String resolveIp(HttpServletRequest request) {
        for (String header : FORWARDED_HEADERS) {
            String value = request.getHeader(header);
            if (value != null && !value.isBlank() && !"unknown".equalsIgnoreCase(value)) {
                // X-Forwarded-For is "client, proxy1, proxy2"; the first entry is
                // the closest thing to the real client we have.
                int comma = value.indexOf(',');
                String candidate = (comma > 0 ? value.substring(0, comma) : value).trim();
                if (!candidate.isEmpty()) {
                    return trimTo(candidate, 64);
                }
            }
        }
        return trimTo(request.getRemoteAddr(), 64);
    }

    private static String truncate(String userAgent) {
        return trimTo(userAgent, USER_AGENT_MAX_LENGTH);
    }

    private static String trimTo(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}

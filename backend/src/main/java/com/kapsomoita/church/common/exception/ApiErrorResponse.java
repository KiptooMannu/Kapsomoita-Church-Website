package com.kapsomoita.church.common.exception;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * The single error shape every failing endpoint returns, so the frontend needs
 * exactly one error handler.
 *
 * @param timestamp  when the failure occurred (UTC)
 * @param status     HTTP status code
 * @param code       stable machine-readable key, e.g. {@code ACCOUNT_LOCKED}
 * @param message    human-readable summary, safe to display
 * @param path       request path that failed
 * @param fieldErrors per-field validation messages, keyed by field name
 */
public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String code,
        String message,
        String path,
        Map<String, List<String>> fieldErrors) {

    public static ApiErrorResponse of(int status, String code, String message, String path) {
        return new ApiErrorResponse(Instant.now(), status, code, message, path, null);
    }

    public static ApiErrorResponse validation(String message,
                                             String path,
                                             Map<String, List<String>> fieldErrors) {
        return new ApiErrorResponse(Instant.now(), 400, "VALIDATION_FAILED", message, path,
                fieldErrors);
    }
}

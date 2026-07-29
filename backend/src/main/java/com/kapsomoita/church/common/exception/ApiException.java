package com.kapsomoita.church.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base class for errors that map deliberately onto an HTTP status.
 *
 * <p>Anything thrown as an {@code ApiException} is treated as a message safe to
 * show a client. Unexpected exceptions are handled separately and reported as a
 * generic 500 so internal details never leak.
 */
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    protected ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    protected ApiException(HttpStatus status, String code, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    /** Stable machine-readable key, e.g. {@code RESOURCE_NOT_FOUND}. */
    public String getCode() {
        return code;
    }
}

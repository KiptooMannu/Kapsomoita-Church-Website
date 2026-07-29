package com.kapsomoita.church.common.exception;

import org.springframework.http.HttpStatus;

/**
 * The concrete {@link ApiException} types, grouped so the set of failure modes
 * the API can produce is visible in one place.
 */
public final class Exceptions {

    private Exceptions() {
    }

    /** 404 — the addressed resource does not exist. */
    public static class NotFoundException extends ApiException {
        public NotFoundException(String message) {
            super(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", message);
        }

        public static NotFoundException of(String resource, Object id) {
            return new NotFoundException(resource + " not found: " + id);
        }
    }

    /** 409 — the request conflicts with current state, e.g. a duplicate email. */
    public static class ConflictException extends ApiException {
        public ConflictException(String message) {
            super(HttpStatus.CONFLICT, "CONFLICT", message);
        }
    }

    /** 400 — semantically invalid request that bean validation cannot express. */
    public static class BadRequestException extends ApiException {
        public BadRequestException(String message) {
            super(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
        }
    }

    /**
     * 401 — credentials are missing, wrong or expired.
     *
     * <p>Login failures deliberately share one message regardless of whether the
     * email exists, so the endpoint cannot be used to enumerate accounts.
     */
    public static class UnauthorizedException extends ApiException {
        public UnauthorizedException(String message) {
            super(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", message);
        }

        public static UnauthorizedException invalidCredentials() {
            return new UnauthorizedException("Invalid email or password.");
        }

        public static UnauthorizedException invalidRefreshToken() {
            return new UnauthorizedException("Your session has expired. Please sign in again.");
        }
    }

    /** 403 — authenticated, but not permitted. */
    public static class ForbiddenException extends ApiException {
        public ForbiddenException(String message) {
            super(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
        }
    }

    /** 423 — account temporarily locked by failed-login throttling. */
    public static class AccountLockedException extends ApiException {
        public AccountLockedException(String message) {
            super(HttpStatus.LOCKED, "ACCOUNT_LOCKED", message);
        }
    }

    /** 403 — account exists but has been deactivated by an administrator. */
    public static class AccountDisabledException extends ApiException {
        public AccountDisabledException(String message) {
            super(HttpStatus.FORBIDDEN, "ACCOUNT_DISABLED", message);
        }
    }
}

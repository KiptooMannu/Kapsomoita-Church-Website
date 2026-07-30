package com.kapsomoita.church.common.exception;

/**
 * Generic exception used when a requested resource cannot be found.
 *
 * <p>This is a lightweight runtime exception that can be thrown from service
 * layers and handled by a global exception handler to produce a 404 HTTP
 * response.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

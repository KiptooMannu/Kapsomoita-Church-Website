package com.kapsomoita.church.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * Translates every exception into the {@link ApiErrorResponse} shape.
 *
 * <p>Deliberate errors are logged at WARN with their message only; unexpected
 * ones are logged at ERROR with a stack trace but reported to the client as a
 * generic 500, so internal details never reach a browser.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // -----------------------------------------------------------------------
    // Deliberate application errors
    // -----------------------------------------------------------------------

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException ex,
                                                              HttpServletRequest request) {
        log.warn("{} on {}: {}", ex.getCode(), request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(ex.getStatus())
                .body(ApiErrorResponse.of(ex.getStatus().value(), ex.getCode(), ex.getMessage(),
                        request.getRequestURI()));
    }

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    /** Bean validation failures on {@code @Valid @RequestBody} arguments. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleBodyValidation(MethodArgumentNotValidException ex,
                                                                HttpServletRequest request) {
        Map<String, List<String>> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.computeIfAbsent(error.getField(), key -> new ArrayList<>())
                        .add(error.getDefaultMessage()));
        // Class-level constraints have no field; surface them under a shared key
        // rather than dropping them silently.
        ex.getBindingResult().getGlobalErrors().forEach(error ->
                fieldErrors.computeIfAbsent("_form", key -> new ArrayList<>())
                        .add(error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(ApiErrorResponse.validation(
                "Please correct the highlighted fields.", request.getRequestURI(), fieldErrors));
    }

    /** Constraint violations on path variables and request parameters. */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex,
                                                                     HttpServletRequest request) {
        Map<String, List<String>> fieldErrors = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String path = violation.getPropertyPath().toString();
            // Property paths look like "method.argument"; keep the readable tail.
            String field = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
            fieldErrors.computeIfAbsent(field, key -> new ArrayList<>()).add(violation.getMessage());
        });

        return ResponseEntity.badRequest().body(ApiErrorResponse.validation(
                "Invalid request parameters.", request.getRequestURI(), fieldErrors));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingParameter(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        return badRequest("MISSING_PARAMETER",
                "Required parameter '" + ex.getParameterName() + "' is missing.", request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        return badRequest("INVALID_PARAMETER",
                "Parameter '" + ex.getName() + "' has an invalid value.", request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableBody(HttpMessageNotReadableException ex,
                                                                HttpServletRequest request) {
        return badRequest("MALFORMED_JSON", "Request body is missing or not valid JSON.", request);
    }

    // -----------------------------------------------------------------------
    // Security
    //
    // These are normally handled by the entry point / access-denied handler in
    // the filter chain, but they can also surface from @PreAuthorize on a
    // service method, which lands here instead.
    // -----------------------------------------------------------------------

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex,
                                                              HttpServletRequest request) {
        log.warn("Access denied on {}: {}", request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiErrorResponse.of(
                HttpStatus.FORBIDDEN.value(), "FORBIDDEN",
                "You do not have permission to perform this action.", request.getRequestURI()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(AuthenticationException ex,
                                                                HttpServletRequest request) {
        log.warn("Authentication failed on {}: {}", request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(), "UNAUTHORIZED",
                "Authentication is required to access this resource.", request.getRequestURI()));
    }

    // -----------------------------------------------------------------------
    // Persistence and transport
    // -----------------------------------------------------------------------

    /**
     * A unique or FK constraint tripped. The underlying message names database
     * objects, so it is logged but not returned.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex,
                                                               HttpServletRequest request) {
        log.warn("Data integrity violation on {}: {}", request.getRequestURI(),
                ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiErrorResponse.of(
                HttpStatus.CONFLICT.value(), "CONFLICT",
                "That change conflicts with existing data. Please review and try again.",
                request.getRequestURI()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleUploadTooLarge(MaxUploadSizeExceededException ex,
                                                                HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(ApiErrorResponse.of(
                HttpStatus.PAYLOAD_TOO_LARGE.value(), "FILE_TOO_LARGE",
                "That file is too large. The maximum upload size is 25 MB.",
                request.getRequestURI()));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ApiErrorResponse.of(
                HttpStatus.METHOD_NOT_ALLOWED.value(), "METHOD_NOT_ALLOWED",
                ex.getMethod() + " is not supported for this endpoint.", request.getRequestURI()));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNoHandler(NoHandlerFoundException ex,
                                                           HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiErrorResponse.of(
                HttpStatus.NOT_FOUND.value(), "ENDPOINT_NOT_FOUND",
                "No endpoint " + ex.getHttpMethod() + " " + ex.getRequestURL() + ".",
                request.getRequestURI()));
    }

    // -----------------------------------------------------------------------
    // Catch-all
    // -----------------------------------------------------------------------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex,
                                                            HttpServletRequest request) {
        log.error("Unhandled exception on {} {}", request.getMethod(), request.getRequestURI(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_ERROR",
                "Something went wrong on our end. Please try again.", request.getRequestURI()));
    }

    private ResponseEntity<ApiErrorResponse> badRequest(String code, String message,
                                                        HttpServletRequest request) {
        return ResponseEntity.badRequest()
                .body(ApiErrorResponse.of(HttpStatus.BAD_REQUEST.value(), code, message,
                        request.getRequestURI()));
    }
}

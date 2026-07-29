package com.kapsomoita.church.auth.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kapsomoita.church.common.exception.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Returns a JSON 401 instead of Spring Security's default HTML redirect or an
 * empty body, so the frontend's single error handler works for auth failures too.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // A WWW-Authenticate header tells well-behaved clients why the call failed.
        response.setHeader("WWW-Authenticate", "Bearer realm=\"kapsomoita-church\"");

        ApiErrorResponse body = ApiErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "UNAUTHORIZED",
                "Authentication is required to access this resource.",
                request.getRequestURI());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}

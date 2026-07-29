package com.kapsomoita.church.auth.web;

import com.kapsomoita.church.auth.dto.AuthDtos.AuthResponse;
import com.kapsomoita.church.auth.dto.AuthDtos.ChangePasswordRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.CurrentUser;
import com.kapsomoita.church.auth.dto.AuthDtos.LoginRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.LogoutRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.MessageResponse;
import com.kapsomoita.church.auth.dto.AuthDtos.RefreshRequest;
import com.kapsomoita.church.auth.dto.AuthDtos.UpdateProfileRequest;
import com.kapsomoita.church.auth.security.SecurityUser;
import com.kapsomoita.church.auth.service.AuthService;
import com.kapsomoita.church.common.web.RequestMetadata;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication endpoints.
 *
 * <p>{@code /login} and {@code /refresh} are public; everything else requires a
 * valid access token (enforced in {@code SecurityConfig}).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** Exchanges credentials for an access/refresh token pair. */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                             HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.login(request, RequestMetadata.from(httpRequest)));
    }

    /**
     * Exchanges a refresh token for a new pair. The presented token is revoked in
     * the process, so a client must always store the returned one.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request,
                                                HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                authService.refresh(request.refreshToken(), RequestMetadata.from(httpRequest)));
    }

    /** Revokes the current session, or all of the user's sessions. */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @AuthenticationPrincipal SecurityUser principal,
            @RequestBody(required = false) LogoutRequest request,
            HttpServletRequest httpRequest) {

        // The body is optional so a client with a corrupted refresh token can still
        // sign out using only its access token.
        String refreshToken = request == null ? null : request.refreshToken();
        boolean allDevices = request != null && request.allDevices();

        authService.logout(principal.getId(), refreshToken, allDevices,
                RequestMetadata.from(httpRequest));

        return ResponseEntity.ok(MessageResponse.of(
                allDevices ? "Signed out on all devices." : "Signed out."));
    }

    /**
     * The signed-in account, including roles and permissions.
     *
     * <p>Read from the database rather than the token so the admin UI reflects a
     * role change on reload, without waiting for the access token to expire.
     */
    @GetMapping("/me")
    public ResponseEntity<CurrentUser> me(@AuthenticationPrincipal SecurityUser principal) {
        return ResponseEntity.ok(authService.currentUser(principal.getId()));
    }

    @PatchMapping("/me")
    public ResponseEntity<CurrentUser> updateProfile(
            @AuthenticationPrincipal SecurityUser principal,
            @Valid @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(authService.updateProfile(principal.getId(), request,
                RequestMetadata.from(httpRequest)));
    }

    /** Changes the password and signs the user out everywhere else. */
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal SecurityUser principal,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {

        authService.changePassword(principal.getId(), request, RequestMetadata.from(httpRequest));
        return ResponseEntity.ok(MessageResponse.of(
                "Password updated. You have been signed out on other devices."));
    }
}

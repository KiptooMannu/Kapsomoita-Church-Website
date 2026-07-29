package com.kapsomoita.church.user.web;

import com.kapsomoita.church.auth.dto.AuthDtos.MessageResponse;
import com.kapsomoita.church.auth.security.SecurityUser;
import com.kapsomoita.church.common.web.ActorResolver;
import com.kapsomoita.church.common.web.RequestMetadata;
import com.kapsomoita.church.user.dto.UserDtos.CreateUserRequest;
import com.kapsomoita.church.user.dto.UserDtos.PageResponse;
import com.kapsomoita.church.user.dto.UserDtos.ResetUserPasswordRequest;
import com.kapsomoita.church.user.dto.UserDtos.UpdateUserRequest;
import com.kapsomoita.church.user.dto.UserDtos.UpdateUserRolesRequest;
import com.kapsomoita.church.user.dto.UserDtos.UserResponse;
import com.kapsomoita.church.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Staff account administration.
 *
 * <p>The whole {@code /api/admin/users/**} tree is already restricted to
 * SUPER_ADMIN in {@code SecurityConfig}; the {@code @PreAuthorize} annotations
 * here state the required permission explicitly so the rule survives a change to
 * the route matcher.
 */
@RestController
@RequestMapping("/api/admin/users")
@Validated
public class UserController {

    /** Whitelisted sort fields, so a client cannot sort by an arbitrary column. */
    private static final java.util.Set<String> SORTABLE_FIELDS = java.util.Set.of(
            "fullName", "email", "createdAt", "lastLoginAt", "active");

    private final UserService userService;
    private final ActorResolver actorResolver;

    public UserController(UserService userService, ActorResolver actorResolver) {
        this.userService = userService;
        this.actorResolver = actorResolver;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user:read')")
    public ResponseEntity<PageResponse<UserResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        String sortField = SORTABLE_FIELDS.contains(sort) ? sort : "createdAt";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Page<UserResponse> results = userService.list(search, role, active,
                PageRequest.of(page, size, Sort.by(sortDirection, sortField)));

        return ResponseEntity.ok(PageResponse.from(results));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:read')")
    public ResponseEntity<UserResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('user:create')")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request,
                                               @AuthenticationPrincipal SecurityUser principal,
                                               HttpServletRequest httpRequest) {
        UserResponse created = userService.create(request, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> update(@PathVariable UUID id,
                                               @Valid @RequestBody UpdateUserRequest request,
                                               @AuthenticationPrincipal SecurityUser principal,
                                               HttpServletRequest httpRequest) {
        return ResponseEntity.ok(userService.update(id, request, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest)));
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> updateRoles(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRolesRequest request,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(userService.updateRoles(id, request,
                actorResolver.resolve(principal), RequestMetadata.from(httpRequest)));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<MessageResponse> resetPassword(
            @PathVariable UUID id,
            @Valid @RequestBody ResetUserPasswordRequest request,
            @AuthenticationPrincipal SecurityUser principal,
            HttpServletRequest httpRequest) {

        userService.resetPassword(id, request, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));
        return ResponseEntity.ok(MessageResponse.of(
                "Password reset. The user has been signed out on all devices."));
    }

    @PostMapping("/{id}/unlock")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> unlock(@PathVariable UUID id,
                                               @AuthenticationPrincipal SecurityUser principal,
                                               HttpServletRequest httpRequest) {
        return ResponseEntity.ok(userService.unlock(id, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete')")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                       @AuthenticationPrincipal SecurityUser principal,
                                       HttpServletRequest httpRequest) {
        userService.delete(id, actorResolver.resolve(principal),
                RequestMetadata.from(httpRequest));
        return ResponseEntity.noContent().build();
    }
}

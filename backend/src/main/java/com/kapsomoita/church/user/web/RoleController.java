package com.kapsomoita.church.user.web;

import com.kapsomoita.church.auth.domain.Role;
import com.kapsomoita.church.auth.repository.PermissionRepository;
import com.kapsomoita.church.auth.repository.RoleRepository;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.user.dto.UserDtos.PermissionResponse;
import com.kapsomoita.church.user.dto.UserDtos.RoleResponse;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Read-only views of the RBAC configuration.
 *
 * <p>These power the "assign roles" picker and the permission matrix in the admin
 * UI. Editing role grants is intentionally not exposed yet: the six system roles
 * cover the specification's requirements, and a half-built grant editor is a good
 * way to lock an administrator out of their own dashboard.
 */
@RestController
@RequestMapping("/api/admin/roles")
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    public RoleController(RoleRepository roleRepository,
                          PermissionRepository permissionRepository,
                          UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
    }

    /** Every role with its grants and how many accounts hold it. */
    @GetMapping
    @PreAuthorize("hasAuthority('role:read')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<RoleResponse>> list() {
        List<RoleResponse> roles = roleRepository.findAll().stream()
                .sorted(Comparator.comparing(Role::getName))
                .map(role -> RoleResponse.from(role,
                        userRepository.countByRoleName(role.getName())))
                .toList();
        return ResponseEntity.ok(roles);
    }

    /** The full permission catalogue, grouped-ready for the matrix UI. */
    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('role:read')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionResponse>> permissions() {
        List<PermissionResponse> permissions =
                permissionRepository.findAllByOrderByResourceAscActionAsc().stream()
                        .map(PermissionResponse::from)
                        .toList();
        return ResponseEntity.ok(permissions);
    }
}

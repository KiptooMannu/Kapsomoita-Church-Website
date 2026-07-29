package com.kapsomoita.church.bootstrap;

import com.kapsomoita.church.auth.domain.Role;
import com.kapsomoita.church.auth.domain.RoleName;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.repository.RoleRepository;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.config.AppProperties;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the first Super Admin so the platform is reachable after a fresh
 * deployment.
 *
 * <p>Runs only when no SUPER_ADMIN exists. That single condition is what makes it
 * safe to leave enabled in production: once a real administrator exists, changing
 * the bootstrap environment variables has no effect, so they cannot be used to
 * inject an account or reset an existing one.
 */
@Component
public class SuperAdminBootstrapper implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SuperAdminBootstrapper.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;

    public SuperAdminBootstrapper(UserRepository userRepository,
                                  RoleRepository roleRepository,
                                  PasswordEncoder passwordEncoder,
                                  AppProperties appProperties) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long existingSuperAdmins = userRepository.countByRoleName(RoleName.SUPER_ADMIN.name());
        if (existingSuperAdmins > 0) {
            log.debug("Super Admin already present ({}), skipping bootstrap", existingSuperAdmins);
            return;
        }

        AppProperties.Bootstrap bootstrap = appProperties.bootstrap();
        if (!bootstrap.isConfigured()) {
            // Loud, because the platform is currently unusable: there is no way in.
            log.error("""
                    No Super Admin exists and ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD \
                    are not set. Nobody can sign in to the admin dashboard. Set both in \
                    backend/.env and restart.""");
            return;
        }

        String email = bootstrap.adminEmail().trim().toLowerCase();

        // An account may already exist without the role — e.g. the role was removed
        // manually. Promote it rather than failing on the unique email index.
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(User::new);
        boolean isNew = user.getId() == null;

        Role superAdmin = roleRepository.findByRoleName(RoleName.SUPER_ADMIN)
                .orElseThrow(() -> new IllegalStateException(
                        "The SUPER_ADMIN role is missing. Did migration V1 run?"));

        if (isNew) {
            user.setEmail(email);
            user.setFullName(defaultIfBlank(bootstrap.adminName(), "Super Admin"));
            user.setPasswordHash(passwordEncoder.encode(bootstrap.adminPassword()));
            user.setPasswordChangedAt(Instant.now());
            user.setActive(true);
        }
        user.addRole(superAdmin);
        userRepository.save(user);

        if (isNew) {
            log.warn("""

                    ========================================================================
                     Bootstrapped the first Super Admin: {}
                     Sign in, then change this password immediately — it is sitting in
                     plain text in backend/.env.
                    ========================================================================""",
                    email);
        } else {
            log.warn("Granted the SUPER_ADMIN role to the existing account {}", email);
        }
    }

    private static String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}

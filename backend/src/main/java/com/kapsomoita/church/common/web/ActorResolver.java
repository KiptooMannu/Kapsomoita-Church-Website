package com.kapsomoita.church.common.web;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.auth.security.SecurityUser;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Loads the acting {@link User} entity for a request principal.
 *
 * <p>The principal is reconstructed from JWT claims and is therefore detached, but
 * audit entries need a real managed entity to hold the FK. Returns {@code null}
 * for an anonymous request rather than throwing, so it is safe to call from
 * endpoints that permit both anonymous and authenticated callers.
 */
@Component
public class ActorResolver {

    private final UserRepository userRepository;

    public ActorResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User resolve(SecurityUser principal) {
        if (principal == null) {
            return null;
        }
        return userRepository.findByIdWithRoles(principal.getId()).orElse(null);
    }
}

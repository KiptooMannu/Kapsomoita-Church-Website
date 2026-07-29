package com.kapsomoita.church.auth.service;

import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.auth.security.SecurityUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Loads accounts by email for the login flow.
 *
 * <p>Only used when credentials are actually verified. Authenticated requests
 * rebuild their principal from JWT claims instead, so this does not run on every
 * call.
 */
@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmailIgnoreCase(email)
                .map(SecurityUser::from)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No account for email: " + email));
    }
}

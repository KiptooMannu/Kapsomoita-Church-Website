package com.kapsomoita.church.config;

import com.kapsomoita.church.auth.domain.RoleName;
import com.kapsomoita.church.auth.security.JwtAuthenticationFilter;
import com.kapsomoita.church.auth.security.RestAccessDeniedHandler;
import com.kapsomoita.church.auth.security.RestAuthenticationEntryPoint;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * The API's security posture.
 *
 * <p>Stateless bearer-token authentication, so there is no session and no CSRF
 * token to manage: CSRF attacks rely on the browser attaching credentials
 * automatically, which never happens for an {@code Authorization} header the
 * frontend sets explicitly. That is also why refresh tokens are sent in the
 * request body rather than a cookie — a cookie would reintroduce CSRF exposure
 * and require the matching defences.
 *
 * <p>{@code @EnableMethodSecurity} turns on {@code @PreAuthorize}, which is where
 * fine-grained permission checks live. The rules below are the coarse first line.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;
    private final AppProperties appProperties;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          RestAuthenticationEntryPoint authenticationEntryPoint,
                          RestAccessDeniedHandler accessDeniedHandler,
                          AppProperties appProperties) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.appProperties = appProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .headers(headers -> headers
                        // The API serves JSON only; deny framing outright.
                        .frameOptions(frame -> frame.deny())
                        .contentTypeOptions(options -> {})
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000))
                        .referrerPolicy(referrer -> referrer.policy(
                                ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)))
                .authorizeHttpRequests(auth -> auth
                        // --- Preflight ------------------------------------------------
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // --- Operational ----------------------------------------------
                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()

                        // --- Authentication -------------------------------------------
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password").permitAll()

                        // --- Public website reads -------------------------------------
                        // Anonymous visitors browse published content. Writes to these
                        // same paths still require authentication (declared below).
                        .requestMatchers(HttpMethod.GET,
                                "/api/public/**",
                                "/api/ministries/**",
                                "/api/events/**",
                                "/api/sermons/**",
                                "/api/gallery/**",
                                "/api/gallery-categories/**",
                                "/api/announcements/**",
                                "/api/testimonials/**",
                                "/api/leaders/**",
                                "/api/service-times/**",
                                "/api/downloads/**",
                                "/api/livestream/**",
                                "/api/church-settings",
                                "/api/social-links",
                                "/api/search").permitAll()

                        // --- Public website submissions -------------------------------
                        // Visitors may create these; only staff may read them back.
                        .requestMatchers(HttpMethod.POST,
                                "/api/contact-messages",
                                "/api/prayer-requests",
                                "/api/ministry-applications",
                                "/api/event-registrations",
                                "/api/newsletter/subscribe",
                                "/api/donations/initiate").permitAll()

                        // Payment provider callbacks are unauthenticated by nature and
                        // are verified inside the handler instead.
                        .requestMatchers(HttpMethod.POST,
                                "/api/donations/mpesa/callback",
                                "/api/donations/paypal/webhook").permitAll()

                        // --- Uploaded media -------------------------------------------
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                        // --- Administration -------------------------------------------
                        // User and role management is Super Admin only; every other
                        // admin route is guarded per-permission via @PreAuthorize.
                        .requestMatchers("/api/admin/users/**", "/api/admin/roles/**")
                                .hasRole(RoleName.SUPER_ADMIN.name())
                        .requestMatchers("/api/admin/**").authenticated()

                        // --- Default deny ---------------------------------------------
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCrypt at strength 12. Higher than the default 10 to stay ahead of GPU
     * cracking, while remaining well under a perceptible login delay.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Backs {@code AuthenticationManager} for the login flow. Exposed explicitly
     * so the same user-loading and password-checking rules apply there as
     * anywhere else in the chain.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
                                                            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        // Let the auth service distinguish "no such user" from "wrong password"
        // internally for audit logging; the HTTP response stays identical.
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }

    /**
     * Origins come from configuration rather than a wildcard: the API returns
     * credentials-bearing responses, and {@code *} would let any site read them.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(appProperties.cors().allowedOrigins());
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        // Lets the frontend read pagination metadata from list endpoints.
        configuration.setExposedHeaders(List.of("X-Total-Count", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

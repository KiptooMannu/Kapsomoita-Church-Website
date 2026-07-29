package com.kapsomoita.church.auth.repository;

import com.kapsomoita.church.auth.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Case-insensitive lookup used by the login flow. The entity graph pulls
     * roles and their permissions in one query so building the security context
     * does not trigger extra round trips to Neon.
     */
    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    @Query("SELECT u FROM User u WHERE lower(u.email) = lower(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE lower(u.email) = lower(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);

    /** Excludes a given id so an admin can keep their own email when editing. */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE lower(u.email) = lower(:email) AND u.id <> :excludedId")
    boolean existsByEmailIgnoreCaseAndIdNot(@Param("email") String email,
                                            @Param("excludedId") UUID excludedId);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleName")
    long countByRoleName(@Param("roleName") String roleName);

    /**
     * Paged admin listing with optional free-text search over name and email.
     * A blank search term returns everything, which keeps the controller free of
     * branching between "list" and "search" queries.
     */
    @EntityGraph(attributePaths = {"roles"})
    @Query("""
            SELECT DISTINCT u FROM User u
            LEFT JOIN u.roles r
            WHERE (:search IS NULL OR :search = ''
                   OR lower(u.fullName) LIKE lower(CONCAT('%', :search, '%'))
                   OR lower(u.email)    LIKE lower(CONCAT('%', :search, '%')))
              AND (:roleName IS NULL OR :roleName = '' OR r.name = :roleName)
              AND (:active IS NULL OR u.active = :active)
            """)
    Page<User> search(@Param("search") String search,
                      @Param("roleName") String roleName,
                      @Param("active") Boolean active,
                      Pageable pageable);

    long countByActiveTrue();
}

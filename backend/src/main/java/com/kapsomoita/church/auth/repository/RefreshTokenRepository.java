package com.kapsomoita.church.auth.repository;

import com.kapsomoita.church.auth.domain.RefreshToken;
import com.kapsomoita.church.auth.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /** Joins the user so the refresh flow can rebuild a security context in one query. */
    @Query("SELECT rt FROM RefreshToken rt JOIN FETCH rt.user u LEFT JOIN FETCH u.roles r "
            + "LEFT JOIN FETCH r.permissions WHERE rt.tokenHash = :tokenHash")
    Optional<RefreshToken> findByTokenHash(@Param("tokenHash") String tokenHash);

    List<RefreshToken> findAllByUserAndRevokedAtIsNull(User user);

    /**
     * Revokes every live session for a user. Used on logout-everywhere, password
     * change, deactivation and refresh-token reuse detection.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :now "
            + "WHERE rt.user.id = :userId AND rt.revokedAt IS NULL")
    int revokeAllForUser(@Param("userId") UUID userId, @Param("now") Instant now);

    /** Housekeeping: drops rows that can no longer authenticate anything. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :cutoff")
    int deleteAllExpiredBefore(@Param("cutoff") Instant cutoff);

    long countByUserAndRevokedAtIsNull(User user);
}

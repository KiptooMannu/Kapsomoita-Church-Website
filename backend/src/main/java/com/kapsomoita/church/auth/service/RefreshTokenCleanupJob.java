package com.kapsomoita.church.auth.service;

import com.kapsomoita.church.auth.repository.RefreshTokenRepository;
import java.time.Duration;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Prunes refresh tokens that can no longer authenticate anything.
 *
 * <p>Expired rows are kept for a grace period rather than deleted the moment they
 * lapse: the reuse-detection path in {@code AuthService} relies on finding a
 * revoked token to recognise a leak, and deleting rows immediately would turn
 * that signal into an indistinguishable "not found".
 */
@Component
public class RefreshTokenCleanupJob {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenCleanupJob.class);

    /** How long an expired token is retained for forensic value. */
    private static final Duration RETENTION_AFTER_EXPIRY = Duration.ofDays(30);

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenCleanupJob(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /** Runs daily at 03:15 UTC, outside any plausible service time. */
    @Scheduled(cron = "0 15 3 * * *", zone = "UTC")
    @Transactional
    public void pruneExpiredTokens() {
        Instant cutoff = Instant.now().minus(RETENTION_AFTER_EXPIRY);
        int deleted = refreshTokenRepository.deleteAllExpiredBefore(cutoff);
        if (deleted > 0) {
            log.info("Pruned {} refresh token(s) that expired before {}", deleted, cutoff);
        }
    }
}

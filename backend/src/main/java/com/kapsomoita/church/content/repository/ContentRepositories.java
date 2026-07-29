package com.kapsomoita.church.content.repository;

/**
 * Repositories for the content modules have been refactored into top-level interfaces
 * (AnnouncementRepository, ServiceTimeRepository, LeaderRepository, TestimonialRepository)
 * so Spring Data JPA component scanning can discover them automatically.
 */
public final class ContentRepositories {

    private ContentRepositories() {
    }
}

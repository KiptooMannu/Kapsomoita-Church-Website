package com.kapsomoita.church.content.dto;

import com.kapsomoita.church.content.domain.Announcement;
import com.kapsomoita.church.content.domain.Leader;
import com.kapsomoita.church.content.domain.ServiceTime;
import com.kapsomoita.church.content.domain.Testimonial;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

/**
 * Request and response payloads for the content modules.
 *
 * <p>Grouped in one file so the whole contract is reviewable together. Responses never
 * expose a Cloudinary public ID without the delivery URL beside it, so the frontend
 * can render an image without reconstructing anything.
 */
public final class ContentDtos {

    private ContentDtos() {
    }

    // =======================================================================
    // Announcements
    // =======================================================================

    public record AnnouncementRequest(
            @NotBlank(message = "A title is required.")
            @Size(max = 200, message = "That title is too long.")
            String title,

            @NotBlank(message = "Please write the announcement.")
            @Size(max = 5000, message = "Please keep it under 5000 characters.")
            String body,

            /** INFO, SUCCESS or WARNING. Defaults to INFO when omitted. */
            String tone,

            @Size(max = 120, message = "That date label is too long.")
            String displayDate,

            @Size(max = 80, message = "That link label is too long.")
            String linkLabel,

            @Size(max = 500)
            String linkUrl,

            Boolean published,
            Boolean pinned,
            Instant startsAt,
            Instant endsAt,
            Integer sortOrder) {
    }

    public record AnnouncementResponse(
            UUID id,
            String title,
            String body,
            String tone,
            String toneLabel,
            String displayDate,
            String linkLabel,
            String linkUrl,
            boolean published,
            boolean pinned,
            boolean currentlyVisible,
            Instant startsAt,
            Instant endsAt,
            int sortOrder,
            String createdByName,
            Instant createdAt,
            Instant updatedAt) {

        public static AnnouncementResponse from(Announcement a) {
            return new AnnouncementResponse(
                    a.getId(), a.getTitle(), a.getBody(),
                    a.getTone().name(), a.getTone().label(),
                    a.getDisplayDate(), a.getLinkLabel(), a.getLinkUrl(),
                    a.isPublished(), a.isPinned(), a.isCurrentlyVisible(),
                    a.getStartsAt(), a.getEndsAt(), a.getSortOrder(),
                    a.getCreatedBy() == null ? null : a.getCreatedBy().getFullName(),
                    a.getCreatedAt(), a.getUpdatedAt());
        }
    }

    // =======================================================================
    // Service times
    // =======================================================================

    public record ServiceTimeRequest(
            @NotBlank(message = "A name is required.")
            @Size(max = 120, message = "That name is too long.")
            String name,

            @NotBlank(message = "Please choose a day.")
            String dayOfWeek,

            @NotBlank(message = "Please enter the time, e.g. 8:00 AM – 12:00 PM.")
            @Size(max = 120)
            String timeLabel,

            @NotBlank(message = "Please enter the location.")
            @Size(max = 160)
            String location,

            @Size(max = 160, message = "That name is too long.")
            String leader,

            @Size(max = 2000, message = "Please keep the description under 2000 characters.")
            String description,

            Boolean primary,
            Boolean published,
            Integer sortOrder) {
    }

    public record ServiceTimeResponse(
            UUID id,
            String name,
            String dayOfWeek,
            String dayLabel,
            String timeLabel,
            String location,
            String leader,
            String description,
            boolean primary,
            boolean published,
            int sortOrder) {

        public static ServiceTimeResponse from(ServiceTime s) {
            return new ServiceTimeResponse(
                    s.getId(), s.getName(),
                    s.getDayOfWeek().name(), s.getDayOfWeek().label(),
                    s.getTimeLabel(), s.getLocation(), s.getLeader(), s.getDescription(),
                    s.isPrimary(), s.isPublished(), s.getSortOrder());
        }
    }

    // =======================================================================
    // Leaders
    // =======================================================================

    public record LeaderRequest(
            @Size(max = 180, message = "That name is too long.")
            String fullName,

            @NotBlank(message = "A role title is required.")
            @Size(max = 160, message = "That role title is too long.")
            String roleTitle,

            @Size(max = 3000, message = "Please keep the biography under 3000 characters.")
            String bio,

            @Size(max = 120)
            String ministry,

            @Email(message = "Enter a valid email address.")
            @Size(max = 255)
            String email,

            @Size(max = 32)
            String phone,

            /** Media asset id for the portrait. Null clears it. */
            UUID photoId,

            /** PASTORAL, MINISTRY or SUPPORT. */
            String team,

            Boolean published,
            Integer sortOrder) {
    }

    public record LeaderResponse(
            UUID id,
            String fullName,
            String roleTitle,
            /** Name when known, otherwise the role — so a card is never blank. */
            String displayHeading,
            String bio,
            String ministry,
            String email,
            String phone,
            UUID photoId,
            String photoUrl,
            String photoPublicId,
            String team,
            String teamLabel,
            boolean published,
            int sortOrder) {

        public static LeaderResponse from(Leader l) {
            return new LeaderResponse(
                    l.getId(), l.getFullName(), l.getRoleTitle(), l.displayHeading(),
                    l.getBio(), l.getMinistry(), l.getEmail(), l.getPhone(),
                    l.getPhoto() == null ? null : l.getPhoto().getId(),
                    l.getPhoto() == null ? null : l.getPhoto().getSecureUrl(),
                    l.getPhoto() == null ? null : l.getPhoto().getPublicId(),
                    l.getTeam().name(), l.getTeam().label(),
                    l.isPublished(), l.getSortOrder());
        }
    }

    // =======================================================================
    // Testimonials
    // =======================================================================

    public record TestimonialRequest(
            @NotBlank(message = "Please enter the testimony.")
            @Size(max = 3000, message = "Please keep it under 3000 characters.")
            String quote,

            @Size(max = 180, message = "That name is too long.")
            String authorName,

            @Size(max = 160)
            String authorRole,

            UUID photoId,
            Boolean published,
            Boolean featured,
            Integer sortOrder) {
    }

    public record TestimonialResponse(
            UUID id,
            String quote,
            String authorName,
            String displayAuthor,
            String authorRole,
            UUID photoId,
            String photoUrl,
            String photoPublicId,
            boolean published,
            boolean featured,
            int sortOrder,
            Instant createdAt) {

        public static TestimonialResponse from(Testimonial t) {
            return new TestimonialResponse(
                    t.getId(), t.getQuote(), t.getAuthorName(), t.displayAuthor(),
                    t.getAuthorRole(),
                    t.getPhoto() == null ? null : t.getPhoto().getId(),
                    t.getPhoto() == null ? null : t.getPhoto().getSecureUrl(),
                    t.getPhoto() == null ? null : t.getPhoto().getPublicId(),
                    t.isPublished(), t.isFeatured(), t.getSortOrder(), t.getCreatedAt());
        }
    }
}

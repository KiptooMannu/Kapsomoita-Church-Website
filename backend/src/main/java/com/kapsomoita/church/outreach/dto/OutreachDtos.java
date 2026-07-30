package com.kapsomoita.church.outreach.dto;

import com.kapsomoita.church.outreach.domain.ContactMessage;
import com.kapsomoita.church.outreach.domain.PrayerRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

/**
 * Request and response DTOs for outreach (contact messages, prayer requests).
 */
public final class OutreachDtos {

    private OutreachDtos() {}

    // =======================================================================
    // Contact Messages
    // =======================================================================

    public record ContactMessageRequest(
            @NotBlank(message = "Your name is required.")
            @Size(max = 120)
            String fullName,

            @NotBlank(message = "Your email address is required.")
            @Email(message = "That does not look like a valid email address.")
            @Size(max = 200)
            String email,

            @Size(max = 30)
            String phone,

            @NotBlank(message = "Please provide a subject.")
            @Size(max = 200)
            String subject,

            @NotBlank(message = "Please write your message.")
            @Size(max = 5000, message = "Please keep your message under 5000 characters.")
            String message) {
    }

    public record ContactMessageResponse(
            UUID id,
            String fullName,
            String email,
            String phone,
            String subject,
            String message,
            String status,
            Instant createdAt) {

        public static ContactMessageResponse from(ContactMessage m) {
            return new ContactMessageResponse(
                    m.getId(), m.getFullName(), m.getEmail(), m.getPhone(),
                    m.getSubject(), m.getMessage(), m.getStatus().name(),
                    m.getCreatedAt());
        }
    }

    public record ContactMessageStatusRequest(String status) {}

    // =======================================================================
    // Prayer Requests
    // =======================================================================

    public record PrayerRequestRequest(
            @Size(max = 120)
            String requestorName,

            @Size(max = 30)
            String phone,

            @NotBlank(message = "Please describe your prayer intention.")
            @Size(max = 5000, message = "Please keep your prayer request under 5000 characters.")
            String intention,

            Boolean confidential) {
    }

    public record PrayerRequestResponse(
            UUID id,
            String requestorName,
            String phone,
            String intention,
            boolean confidential,
            String status,
            Instant createdAt) {

        public static PrayerRequestResponse from(PrayerRequest r) {
            return new PrayerRequestResponse(
                    r.getId(), r.getRequestorName(), r.getPhone(),
                    r.getIntention(), r.isConfidential(), r.getStatus().name(),
                    r.getCreatedAt());
        }
    }

    public record PrayerRequestStatusRequest(String status) {}
}

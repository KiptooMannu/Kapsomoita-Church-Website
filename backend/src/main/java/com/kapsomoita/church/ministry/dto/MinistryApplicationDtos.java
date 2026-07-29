package com.kapsomoita.church.ministry.dto;

import com.kapsomoita.church.ministry.domain.MinistryApplication;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

/** Payloads for ministry applications. */
public final class MinistryApplicationDtos {

    private MinistryApplicationDtos() {
    }

    /**
     * Kenyan mobile numbers, accepting the formats people actually type:
     * {@code 0712345678}, {@code +254712345678}, {@code 254712345678}, with optional
     * spaces or hyphens. Deliberately permissive — rejecting a real number because of
     * a space is worse than accepting an odd one a human will read anyway.
     */
    private static final String PHONE_PATTERN = "^(\\+?254|0)[\\s-]?7\\d{2}[\\s-]?\\d{3}[\\s-]?\\d{3}$";

    // -----------------------------------------------------------------------
    // Public submission
    // -----------------------------------------------------------------------

    /**
     * A visitor's application to join a ministry.
     *
     * <p>Only the fields the church genuinely needs to make contact and place someone
     * are required; everything descriptive is optional, because a long mandatory form
     * is the most reliable way to stop people applying at all.
     */
    public record SubmitApplicationRequest(
            @NotBlank(message = "Please enter your full name.")
            @Size(max = 180, message = "That name is too long.")
            String fullName,

            @NotBlank(message = "Please enter your email address.")
            @Email(message = "Please enter a valid email address.")
            @Size(max = 255)
            String email,

            @NotBlank(message = "Please enter your phone number.")
            @Pattern(regexp = PHONE_PATTERN,
                     message = "Enter a valid Kenyan mobile number, e.g. 0712 345 678.")
            String phone,

            @NotBlank(message = "Please select your gender.")
            String gender,

            @NotBlank(message = "Please select your age group.")
            String ageGroup,

            @Size(max = 80, message = "That county name is too long.")
            String county,

            @Size(max = 120, message = "That occupation is too long.")
            String occupation,

            @NotBlank(message = "Please choose a ministry.")
            @Size(max = 64)
            String ministrySlug,

            @NotNull(message = "Please tell us whether you are a member of this church.")
            Boolean churchMember,

            @NotNull(message = "Please tell us whether you have been baptised.")
            Boolean baptized,

            @Size(max = 2000, message = "Please keep this under 2000 characters.")
            String skills,

            @Size(max = 2000, message = "Please keep this under 2000 characters.")
            String previousExperience,

            @Size(max = 1000, message = "Please keep this under 1000 characters.")
            String availability,

            @Size(max = 2000, message = "Please keep this under 2000 characters.")
            String prayerRequest,

            @Size(max = 2000, message = "Please keep this under 2000 characters.")
            String additionalNotes,

            /**
             * Consent to being contacted about this application.
             *
             * <p>Required, because the whole point of the form is that someone will
             * phone or email the applicant back.
             */
            @NotNull(message = "Please confirm we may contact you about your application.")
            Boolean consentToContact) {

        @AssertTrue(message = "We can only accept your application if we may contact you about it.")
        public boolean isConsentGiven() {
            return Boolean.TRUE.equals(consentToContact);
        }
    }

    /**
     * What a visitor gets back.
     *
     * <p>Deliberately minimal: a reference and a reassurance. Echoing the whole
     * submission back would put personal data in a response that may be logged or
     * cached by an intermediary.
     */
    public record SubmitApplicationResponse(UUID reference, String message) {

        public static SubmitApplicationResponse of(UUID reference, String ministryName) {
            return new SubmitApplicationResponse(
                    reference,
                    "Thank you. Your application to join " + ministryName
                            + " has been received, and one of our leaders will be in touch soon.");
        }
    }

    // -----------------------------------------------------------------------
    // Admin review
    // -----------------------------------------------------------------------

    /** Decision recorded against an application. */
    public record ReviewApplicationRequest(
            @NotBlank(message = "A decision is required.")
            String status,

            @Size(max = 2000, message = "Please keep your notes under 2000 characters.")
            String reviewNotes,

            @Size(max = 180, message = "That name is too long.")
            String assignedLeader,

            /** Set when the reviewer has already spoken to the applicant. */
            Boolean markContacted) {
    }

    /** Full application record for staff. */
    public record ApplicationResponse(
            UUID id,
            String fullName,
            String email,
            String phone,
            String gender,
            String genderLabel,
            String ageGroup,
            String ageGroupLabel,
            boolean requiresParentalConsent,
            String county,
            String occupation,
            String ministrySlug,
            String ministryName,
            boolean churchMember,
            boolean baptized,
            String skills,
            String previousExperience,
            String availability,
            String prayerRequest,
            String additionalNotes,
            String status,
            String statusLabel,
            String reviewNotes,
            String reviewedByName,
            Instant reviewedAt,
            String assignedLeader,
            Instant contactedAt,
            Instant createdAt) {

        public static ApplicationResponse from(MinistryApplication application) {
            return new ApplicationResponse(
                    application.getId(),
                    application.getFullName(),
                    application.getEmail(),
                    application.getPhone(),
                    application.getGender().name(),
                    application.getGender().displayName(),
                    application.getAgeGroup().name(),
                    application.getAgeGroup().displayName(),
                    application.requiresParentalConsent(),
                    application.getCounty(),
                    application.getOccupation(),
                    application.getMinistrySlug(),
                    application.getMinistryName(),
                    application.isChurchMember(),
                    application.isBaptized(),
                    application.getSkills(),
                    application.getPreviousExperience(),
                    application.getAvailability(),
                    application.getPrayerRequest(),
                    application.getAdditionalNotes(),
                    application.getStatus().name(),
                    application.getStatus().displayName(),
                    application.getReviewNotes(),
                    application.getReviewedBy() == null
                            ? null
                            : application.getReviewedBy().getFullName(),
                    application.getReviewedAt(),
                    application.getAssignedLeader(),
                    application.getContactedAt(),
                    application.getCreatedAt());
        }
    }

    /** Counts for the admin queue header. */
    public record ApplicationStats(
            long pending,
            long approved,
            long rejected,
            long archived) {
    }
}

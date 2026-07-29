package com.kapsomoita.church.ministry.domain;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.AgeGroup;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.ApplicationStatus;
import com.kapsomoita.church.ministry.domain.ApplicationEnums.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * An application from someone wanting to join a ministry.
 *
 * <p>Submitted anonymously — there is no account behind it — so everything the church
 * needs to follow up is captured on the record itself.
 */
@Entity
@Table(name = "ministry_applications")
public class MinistryApplication extends BaseEntity {

    // --- Applicant identity ------------------------------------------------

    @Column(name = "full_name", nullable = false, length = 180)
    private String fullName;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", nullable = false, length = 32)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 16)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_group", nullable = false, length = 24)
    private AgeGroup ageGroup;

    @Column(name = "county", length = 80)
    private String county;

    @Column(name = "occupation", length = 120)
    private String occupation;

    // --- The request -------------------------------------------------------

    @Column(name = "ministry_slug", nullable = false, length = 64)
    private String ministrySlug;

    /** Captured at submission so renaming a ministry does not rewrite history. */
    @Column(name = "ministry_name", nullable = false, length = 120)
    private String ministryName;

    @Column(name = "is_church_member", nullable = false)
    private boolean churchMember;

    @Column(name = "is_baptized", nullable = false)
    private boolean baptized;

    @Column(name = "skills", columnDefinition = "text")
    private String skills;

    @Column(name = "previous_experience", columnDefinition = "text")
    private String previousExperience;

    @Column(name = "availability", columnDefinition = "text")
    private String availability;

    @Column(name = "prayer_request", columnDefinition = "text")
    private String prayerRequest;

    @Column(name = "additional_notes", columnDefinition = "text")
    private String additionalNotes;

    // --- Review workflow ---------------------------------------------------

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    /** Internal notes. Never returned to the applicant. */
    @Column(name = "review_notes", columnDefinition = "text")
    private String reviewNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "assigned_leader", length = 180)
    private String assignedLeader;

    @Column(name = "contacted_at")
    private Instant contactedAt;

    // --- Submission provenance --------------------------------------------

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 400)
    private String userAgent;

    // -----------------------------------------------------------------------
    // Behaviour
    // -----------------------------------------------------------------------

    /**
     * Records a review decision.
     *
     * <p>Stamps the reviewer and timestamp together, which is what satisfies the
     * {@code ministry_applications_review_is_complete} constraint — a non-pending row
     * without a review timestamp is rejected by the database.
     */
    public void review(ApplicationStatus decision, User reviewer, String notes) {
        this.status = decision;
        this.reviewedBy = reviewer;
        this.reviewedAt = Instant.now();
        if (notes != null && !notes.isBlank()) {
            this.reviewNotes = notes.trim();
        }
    }

    /** Marks that a staff member has been in touch with the applicant. */
    public void markContacted() {
        if (contactedAt == null) {
            contactedAt = Instant.now();
        }
    }

    public boolean isPending() {
        return status == ApplicationStatus.PENDING;
    }

    /** True when the applicant is a minor and needs parental consent. */
    public boolean requiresParentalConsent() {
        return ageGroup != null && ageGroup.isMinor();
    }

    // -----------------------------------------------------------------------
    // Accessors
    // -----------------------------------------------------------------------

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    /** Normalised to lower case, matching the functional index used for lookups. */
    public void setEmail(String email) {
        this.email = email == null ? null : email.trim().toLowerCase();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(AgeGroup ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getMinistrySlug() {
        return ministrySlug;
    }

    public void setMinistrySlug(String ministrySlug) {
        this.ministrySlug = ministrySlug;
    }

    public String getMinistryName() {
        return ministryName;
    }

    public void setMinistryName(String ministryName) {
        this.ministryName = ministryName;
    }

    public boolean isChurchMember() {
        return churchMember;
    }

    public void setChurchMember(boolean churchMember) {
        this.churchMember = churchMember;
    }

    public boolean isBaptized() {
        return baptized;
    }

    public void setBaptized(boolean baptized) {
        this.baptized = baptized;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getPreviousExperience() {
        return previousExperience;
    }

    public void setPreviousExperience(String previousExperience) {
        this.previousExperience = previousExperience;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getPrayerRequest() {
        return prayerRequest;
    }

    public void setPrayerRequest(String prayerRequest) {
        this.prayerRequest = prayerRequest;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getReviewNotes() {
        return reviewNotes;
    }

    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getAssignedLeader() {
        return assignedLeader;
    }

    public void setAssignedLeader(String assignedLeader) {
        this.assignedLeader = assignedLeader;
    }

    public Instant getContactedAt() {
        return contactedAt;
    }

    public void setContactedAt(Instant contactedAt) {
        this.contactedAt = contactedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    @Override
    public String toString() {
        return "MinistryApplication(" + fullName + " -> " + ministrySlug + ")";
    }
}

package com.kapsomoita.church.outreach.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * A prayer request submitted by a congregation member or website visitor.
 */
@Entity
@Table(name = "prayer_requests")
@Getter
@Setter
public class PrayerRequest extends BaseEntity {

    public enum Status { PENDING, PRAYING, ANSWERED }

    @Column(name = "requestor_name", length = 120)
    private String requestorName;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "intention", nullable = false, columnDefinition = "text")
    private String intention;

    @Column(name = "confidential", nullable = false)
    private boolean confidential = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private Status status = Status.PENDING;
}

package com.kapsomoita.church.content.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.content.domain.ContentEnums.ServiceDay;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** A recurring weekly gathering. */
@Entity
@Table(name = "service_times")
@Getter
@Setter
public class ServiceTime extends BaseEntity {

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 16)
    private ServiceDay dayOfWeek;

    /**
     * Advertised time range, e.g. "8:00 AM – 12:00 PM".
     *
     * <p>Stored as text rather than two TIME columns: services are advertised as a
     * range and frequently carry qualifiers a time column cannot hold.
     */
    @Column(name = "time_label", nullable = false, length = 120)
    private String timeLabel;

    @Column(name = "location", nullable = false, length = 160)
    private String location;

    @Column(name = "leader", length = 160)
    private String leader;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    /**
     * The headline service. At most one row may set this — enforced by the partial
     * unique index {@code ux_service_times_single_primary}, so the service layer must
     * clear the previous primary before setting a new one.
     */
    @Column(name = "is_primary", nullable = false)
    private boolean primary = false;

    @Column(name = "published", nullable = false)
    private boolean published = true;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;
}

package com.kapsomoita.church.content.domain;

import com.kapsomoita.church.common.domain.BaseEntity;
import com.kapsomoita.church.content.domain.ContentEnums.LeaderTeam;
import com.kapsomoita.church.media.domain.MediaAsset;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * A pastor, elder or ministry leader.
 *
 * <p>{@code fullName} is nullable on purpose: the church can publish a role before it
 * has confirmed who holds it, and the public site falls back to showing the role.
 * That is better than either an empty card or an invented name.
 */
@Entity
@Table(name = "leaders")
@Getter
@Setter
public class Leader extends BaseEntity {

    @Column(name = "full_name", length = 180)
    private String fullName;

    @Column(name = "role_title", nullable = false, length = 160)
    private String roleTitle;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "ministry", length = 120)
    private String ministry;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id")
    private MediaAsset photo;

    @Enumerated(EnumType.STRING)
    @Column(name = "team", nullable = false, length = 16)
    private LeaderTeam team = LeaderTeam.MINISTRY;

    @Column(name = "published", nullable = false)
    private boolean published = true;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    /** The name when known, otherwise the role — so a card is never blank. */
    public String displayHeading() {
        return fullName != null && !fullName.isBlank() ? fullName : roleTitle;
    }
}

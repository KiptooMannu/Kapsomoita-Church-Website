package com.kapsomoita.church.livestream.domain;

import com.kapsomoita.church.auth.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "livestream")
@Getter
@Setter
public class Livestream {

    @Id
    @Column(name = "id")
    private Integer id = 1;

    @Column(name = "is_live", nullable = false)
    private boolean isLive = false;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "platform", nullable = false, length = 24)
    private String platform = "YOUTUBE";

    @Column(name = "stream_url", length = 500)
    private String streamUrl;

    @Column(name = "embed_url", length = 500)
    private String embedUrl;

    @Column(name = "scheduled_for")
    private Instant scheduledFor;

    @Column(name = "offline_message", columnDefinition = "text")
    private String offlineMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}

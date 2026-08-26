package com.kapsomoita.church.settings.domain;

import com.kapsomoita.church.auth.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "church_settings")
@Getter
@Setter
public class ChurchSetting {

    @Id
    @Column(name = "setting_key", nullable = false, length = 96)
    private String settingKey;

    @Column(name = "setting_value", columnDefinition = "text")
    private String settingValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "value_type", nullable = false, length = 16)
    private SettingValueType valueType = SettingValueType.STRING;

    @Column(name = "category", nullable = false, length = 48)
    private String category = "general";

    @Column(name = "label", nullable = false, length = 160)
    private String label;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "public", nullable = false)
    private boolean publicSetting = true;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public enum SettingValueType {
        STRING, NUMBER, BOOLEAN, URL, EMAIL, TEXT
    }
}

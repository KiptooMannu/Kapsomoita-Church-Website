package com.kapsomoita.church.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class SettingsDtos {

    private SettingsDtos() {
    }

    public record ChurchSettingRequest(
            @NotBlank(message = "A key is required.")
            @Size(max = 96, message = "That key is too long.")
            String settingKey,

            String settingValue,

            @NotBlank(message = "A value type is required.")
            String valueType,

            @Size(max = 48, message = "That category is too long.")
            String category,

            @NotBlank(message = "A label is required.")
            @Size(max = 160, message = "That label is too long.")
            String label,

            @Size(max = 500, message = "That description is too long.")
            String description,

            Boolean publicSetting,
            Integer sortOrder
    ) {}

    public record ChurchSettingResponse(
            String settingKey,
            String settingValue,
            String valueType,
            String category,
            String label,
            String description,
            boolean publicSetting,
            int sortOrder,
            String updatedByName,
            String createdAt,
            String updatedAt
    ) {}

    public record PublicSettingsResponse(
            List<ChurchSettingResponse> settings
    ) {}
}

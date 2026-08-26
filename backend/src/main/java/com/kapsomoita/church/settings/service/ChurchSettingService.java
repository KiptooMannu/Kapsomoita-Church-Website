package com.kapsomoita.church.settings.service;

import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.auth.repository.UserRepository;
import com.kapsomoita.church.common.exception.Exceptions.BadRequestException;
import com.kapsomoita.church.common.exception.Exceptions.NotFoundException;
import com.kapsomoita.church.settings.domain.ChurchSetting;
import com.kapsomoita.church.settings.dto.SettingsDtos.ChurchSettingRequest;
import com.kapsomoita.church.settings.dto.SettingsDtos.ChurchSettingResponse;
import com.kapsomoita.church.settings.dto.SettingsDtos.PublicSettingsResponse;
import com.kapsomoita.church.settings.repository.ChurchSettingRepository;
import com.kapsomoita.church.settings.domain.ChurchSetting.SettingValueType;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChurchSettingService {

    private final ChurchSettingRepository churchSettingRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PublicSettingsResponse getPublicSettings() {
        List<ChurchSettingResponse> settings = churchSettingRepository.findPublic().stream()
            .map(this::toResponse)
            .toList();
        return new PublicSettingsResponse(settings);
    }

    @Transactional(readOnly = true)
    public List<ChurchSettingResponse> listSettings(String category) {
        return churchSettingRepository.search(category).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ChurchSettingResponse getSetting(String settingKey) {
        ChurchSetting setting = churchSettingRepository.findById(settingKey)
            .orElseThrow(() -> new NotFoundException("Setting not found"));
        return toResponse(setting);
    }

    @Transactional
    public ChurchSettingResponse createSetting(ChurchSettingRequest request, User currentUser) {
        if (churchSettingRepository.findById(request.settingKey()).isPresent()) {
            throw new BadRequestException("Setting key already exists");
        }
        
        ChurchSetting setting = new ChurchSetting();
        applySetting(setting, request);
        setting.setUpdatedBy(currentUser);
        setting.setCreatedAt(Instant.now());
        setting.setUpdatedAt(Instant.now());
        
        ChurchSetting saved = churchSettingRepository.save(setting);
        return toResponse(saved);
    }

    @Transactional
    public ChurchSettingResponse updateSetting(String settingKey, ChurchSettingRequest request, User currentUser) {
        ChurchSetting setting = churchSettingRepository.findById(settingKey)
            .orElseThrow(() -> new NotFoundException("Setting not found"));
        
        applySetting(setting, request);
        setting.setUpdatedBy(currentUser);
        setting.setUpdatedAt(Instant.now());
        
        ChurchSetting saved = churchSettingRepository.save(setting);
        return toResponse(saved);
    }

    @Transactional
    public void deleteSetting(String settingKey) {
        ChurchSetting setting = churchSettingRepository.findById(settingKey)
            .orElseThrow(() -> new NotFoundException("Setting not found"));
        churchSettingRepository.delete(setting);
    }

    private void applySetting(ChurchSetting setting, ChurchSettingRequest request) {
        setting.setSettingKey(request.settingKey().trim().toLowerCase());
        setting.setSettingValue(request.settingValue() != null ? request.settingValue().trim() : null);
        
        if (request.valueType() != null) {
            try {
                setting.setValueType(SettingValueType.valueOf(request.valueType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid value type. Use STRING, NUMBER, BOOLEAN, URL, EMAIL, or TEXT.");
            }
        }
        
        setting.setCategory(request.category() != null ? request.category().trim().toLowerCase() : "general");
        setting.setLabel(request.label().trim());
        setting.setDescription(request.description() != null ? request.description().trim() : null);
        
        if (request.publicSetting() != null) setting.setPublicSetting(request.publicSetting());
        if (request.sortOrder() != null) setting.setSortOrder(request.sortOrder());
    }

    private ChurchSettingResponse toResponse(ChurchSetting setting) {
        return new ChurchSettingResponse(
            setting.getSettingKey(),
            setting.getSettingValue(),
            setting.getValueType().name(),
            setting.getCategory(),
            setting.getLabel(),
            setting.getDescription(),
            setting.isPublicSetting(),
            setting.getSortOrder(),
            setting.getUpdatedBy() != null ? setting.getUpdatedBy().getFullName() : null,
            setting.getCreatedAt().toString(),
            setting.getUpdatedAt().toString()
        );
    }
}

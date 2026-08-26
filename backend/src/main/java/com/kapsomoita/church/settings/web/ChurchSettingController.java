package com.kapsomoita.church.settings.web;

import com.kapsomoita.church.auth.security.CurrentUser;
import com.kapsomoita.church.auth.domain.User;
import com.kapsomoita.church.settings.dto.SettingsDtos.ChurchSettingRequest;
import com.kapsomoita.church.settings.dto.SettingsDtos.ChurchSettingResponse;
import com.kapsomoita.church.settings.dto.SettingsDtos.PublicSettingsResponse;
import com.kapsomoita.church.settings.service.ChurchSettingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChurchSettingController {

    private final ChurchSettingService churchSettingService;

    // Public endpoint
    @GetMapping("/settings")
    public PublicSettingsResponse getPublicSettings() {
        return churchSettingService.getPublicSettings();
    }

    // Admin endpoints
    @GetMapping("/admin/settings")
    @PreAuthorize("hasAuthority('church_setting:read')")
    public List<ChurchSettingResponse> listSettings(
            @RequestParam(required = false) String category) {
        return churchSettingService.listSettings(category);
    }

    @GetMapping("/admin/settings/{settingKey}")
    @PreAuthorize("hasAuthority('church_setting:read')")
    public ChurchSettingResponse getSetting(@PathVariable String settingKey) {
        return churchSettingService.getSetting(settingKey);
    }

    @PostMapping("/admin/settings")
    @PreAuthorize("hasAuthority('church_setting:create')")
    public ChurchSettingResponse createSetting(
            @Valid @RequestBody ChurchSettingRequest request,
            @CurrentUser User currentUser) {
        return churchSettingService.createSetting(request, currentUser);
    }

    @PutMapping("/admin/settings/{settingKey}")
    @PreAuthorize("hasAuthority('church_setting:update')")
    public ChurchSettingResponse updateSetting(
            @PathVariable String settingKey,
            @Valid @RequestBody ChurchSettingRequest request,
            @CurrentUser User currentUser) {
        return churchSettingService.updateSetting(settingKey, request, currentUser);
    }

    @DeleteMapping("/admin/settings/{settingKey}")
    @PreAuthorize("hasAuthority('church_setting:delete')")
    public void deleteSetting(@PathVariable String settingKey) {
        churchSettingService.deleteSetting(settingKey);
    }
}

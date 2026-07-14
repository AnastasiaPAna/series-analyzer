package org.example.series.api.controller;

import jakarta.validation.Valid;
import org.example.series.api.dto.NotificationSettingsRequest;
import org.example.series.api.dto.NotificationSettingsResponse;
import org.example.series.integration.notification.NotificationAdminSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/notification-settings")
public class AdminNotificationSettingsController {

    private final NotificationAdminSettings notificationAdminSettings;
    private final String adminAccessToken;

    public AdminNotificationSettingsController(
            NotificationAdminSettings notificationAdminSettings,
            @Value("${ADMIN_ACCESS_TOKEN:series-admin-access}") String adminAccessToken
    ) {
        this.notificationAdminSettings = notificationAdminSettings;
        this.adminAccessToken = adminAccessToken;
    }

    @GetMapping
    public NotificationSettingsResponse getSettings(@RequestHeader("X-Admin-Token") String token) {
        ensureAdmin(token);
        return new NotificationSettingsResponse(
                notificationAdminSettings.getRecipientEmail(),
                notificationAdminSettings.getNewSeriesSubjectTemplate(),
                notificationAdminSettings.getNewSeriesBodyTemplate(),
                notificationAdminSettings.getNewSeasonSubjectTemplate(),
                notificationAdminSettings.getNewSeasonBodyTemplate()
        );
    }

    @PutMapping
    public NotificationSettingsResponse updateSettings(
            @RequestHeader("X-Admin-Token") String token,
            @Valid @RequestBody NotificationSettingsRequest request
    ) {
        ensureAdmin(token);
        notificationAdminSettings.setRecipientEmail(request.getRecipientEmail().trim());
        notificationAdminSettings.setNewSeriesSubjectTemplate(request.getNewSeriesSubjectTemplate().trim());
        notificationAdminSettings.setNewSeriesBodyTemplate(request.getNewSeriesBodyTemplate().trim());
        notificationAdminSettings.setNewSeasonSubjectTemplate(request.getNewSeasonSubjectTemplate().trim());
        notificationAdminSettings.setNewSeasonBodyTemplate(request.getNewSeasonBodyTemplate().trim());
        return new NotificationSettingsResponse(
                notificationAdminSettings.getRecipientEmail(),
                notificationAdminSettings.getNewSeriesSubjectTemplate(),
                notificationAdminSettings.getNewSeriesBodyTemplate(),
                notificationAdminSettings.getNewSeasonSubjectTemplate(),
                notificationAdminSettings.getNewSeasonBodyTemplate()
        );
    }

    private void ensureAdmin(String token) {
        if (!adminAccessToken.equals(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access token is invalid");
        }
    }
}

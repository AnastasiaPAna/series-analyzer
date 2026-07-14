package org.example.series.emailservice.controller;

import jakarta.validation.Valid;
import org.example.series.emailservice.dto.EmailSettingsResponse;
import org.example.series.emailservice.dto.UpdateEmailSettingsRequest;
import org.example.series.emailservice.service.EmailRuntimeSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/admin/email-settings")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmailSettingsController {

    private final EmailRuntimeSettings emailRuntimeSettings;
    private final String adminAccessToken;

    public EmailSettingsController(EmailRuntimeSettings emailRuntimeSettings,
                                   @Value("${app.admin.access-token:series-admin-access}") String adminAccessToken) {
        this.emailRuntimeSettings = emailRuntimeSettings;
        this.adminAccessToken = adminAccessToken;
    }

    @GetMapping
    public EmailSettingsResponse getSettings(@RequestHeader("X-Admin-Token") String token) {
        ensureAdmin(token);
        return emailRuntimeSettings.getSettings();
    }

    @PutMapping
    public EmailSettingsResponse updateSettings(@RequestHeader("X-Admin-Token") String token,
                                                @Valid @RequestBody UpdateEmailSettingsRequest request) {
        ensureAdmin(token);
        return emailRuntimeSettings.update(request);
    }

    private void ensureAdmin(String token) {
        if (!adminAccessToken.equals(token)) {
            throw new ResponseStatusException(FORBIDDEN, "Admin access token is invalid");
        }
    }
}

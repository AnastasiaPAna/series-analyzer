package org.example.series.api.controller;

import org.example.series.api.dto.SubscriberOverviewResponse;
import org.example.series.core.service.SubscriberProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/subscribers")
public class AdminSubscriberController {

    private final SubscriberProfileService subscriberProfileService;
    private final String adminAccessToken;

    public AdminSubscriberController(SubscriberProfileService subscriberProfileService,
                                     @Value("${ADMIN_ACCESS_TOKEN:series-admin-access}") String adminAccessToken) {
        this.subscriberProfileService = subscriberProfileService;
        this.adminAccessToken = adminAccessToken;
    }

    @GetMapping("/overview")
    public SubscriberOverviewResponse getOverview(@RequestHeader(value = "X-Admin-Token", required = false) String accessToken) {
        if (accessToken == null || !adminAccessToken.equals(accessToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access token is invalid");
        }
        return subscriberProfileService.getOverview();
    }
}

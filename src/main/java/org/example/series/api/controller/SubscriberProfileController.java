package org.example.series.api.controller;

import jakarta.validation.Valid;
import org.example.series.api.dto.SubscriberLoginRequest;
import org.example.series.api.dto.SubscriberProfileRequest;
import org.example.series.api.dto.SubscriberProfileResponse;
import org.example.series.api.dto.SubscriberRegistrationRequest;
import org.example.series.api.dto.SubscriberSessionResponse;
import org.example.series.core.service.SubscriberProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subscribers")
public class SubscriberProfileController {

    private static final String SUBSCRIBER_TOKEN_HEADER = "X-Subscriber-Token";

    private final SubscriberProfileService subscriberProfileService;

    public SubscriberProfileController(SubscriberProfileService subscriberProfileService) {
        this.subscriberProfileService = subscriberProfileService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriberSessionResponse register(@Valid @RequestBody SubscriberRegistrationRequest request) {
        return subscriberProfileService.register(request);
    }

    @PostMapping("/login")
    public SubscriberSessionResponse login(@Valid @RequestBody SubscriberLoginRequest request) {
        return subscriberProfileService.login(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(SUBSCRIBER_TOKEN_HEADER) String authToken) {
        subscriberProfileService.logout(authToken);
    }

    @GetMapping("/me")
    public SubscriberProfileResponse getCurrentProfile(@RequestHeader(SUBSCRIBER_TOKEN_HEADER) String authToken) {
        return subscriberProfileService.getCurrentProfile(authToken);
    }

    @PutMapping("/me")
    public SubscriberProfileResponse updateCurrentProfile(@RequestHeader(SUBSCRIBER_TOKEN_HEADER) String authToken,
                                                          @Valid @RequestBody SubscriberProfileRequest request) {
        return subscriberProfileService.updateCurrentProfile(authToken, request);
    }

    @PostMapping("/me/heartbeat")
    public SubscriberProfileResponse markSeen(@RequestHeader(SUBSCRIBER_TOKEN_HEADER) String authToken) {
        return subscriberProfileService.markSeen(authToken);
    }
}

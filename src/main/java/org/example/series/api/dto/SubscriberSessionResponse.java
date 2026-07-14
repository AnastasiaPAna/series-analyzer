package org.example.series.api.dto;

public class SubscriberSessionResponse {

    private String authToken;
    private SubscriberProfileResponse profile;

    public SubscriberSessionResponse() {
    }

    public SubscriberSessionResponse(String authToken, SubscriberProfileResponse profile) {
        this.authToken = authToken;
        this.profile = profile;
    }

    public String getAuthToken() {
        return authToken;
    }

    public SubscriberProfileResponse getProfile() {
        return profile;
    }
}

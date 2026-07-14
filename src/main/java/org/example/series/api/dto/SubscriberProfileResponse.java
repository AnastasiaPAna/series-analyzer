package org.example.series.api.dto;

import java.time.LocalDateTime;

public class SubscriberProfileResponse {

    private Long id;
    private String name;
    private String email;
    private boolean notifyNewSeries;
    private boolean notifyNewSeason;
    private boolean activeNow;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastSeenAt;

    public SubscriberProfileResponse() {
    }

    public SubscriberProfileResponse(Long id,
                                     String name,
                                     String email,
                                     boolean notifyNewSeries,
                                     boolean notifyNewSeason,
                                     boolean activeNow,
                                     LocalDateTime createdAt,
                                     LocalDateTime updatedAt,
                                     LocalDateTime lastSeenAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.notifyNewSeries = notifyNewSeries;
        this.notifyNewSeason = notifyNewSeason;
        this.activeNow = activeNow;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastSeenAt = lastSeenAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isNotifyNewSeries() {
        return notifyNewSeries;
    }

    public boolean isNotifyNewSeason() {
        return notifyNewSeason;
    }

    public boolean isActiveNow() {
        return activeNow;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getLastSeenAt() {
        return lastSeenAt;
    }
}

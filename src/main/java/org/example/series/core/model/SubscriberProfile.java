package org.example.series.core.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "subscriber_profiles",
        uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class SubscriberProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 120)
    private String passwordHash;

    @Column(name = "auth_token", length = 120, unique = true)
    private String authToken;

    @Column(name = "notify_new_series", nullable = false)
    private boolean notifyNewSeries;

    @Column(name = "notify_new_season", nullable = false)
    private boolean notifyNewSeason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "last_seen_at", nullable = false)
    private LocalDateTime lastSeenAt;

    @Column(name = "auth_token_issued_at")
    private LocalDateTime authTokenIssuedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.lastSeenAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public boolean isNotifyNewSeries() {
        return notifyNewSeries;
    }

    public void setNotifyNewSeries(boolean notifyNewSeries) {
        this.notifyNewSeries = notifyNewSeries;
    }

    public boolean isNotifyNewSeason() {
        return notifyNewSeason;
    }

    public void setNotifyNewSeason(boolean notifyNewSeason) {
        this.notifyNewSeason = notifyNewSeason;
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

    public void setLastSeenAt(LocalDateTime lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public LocalDateTime getAuthTokenIssuedAt() {
        return authTokenIssuedAt;
    }

    public void setAuthTokenIssuedAt(LocalDateTime authTokenIssuedAt) {
        this.authTokenIssuedAt = authTokenIssuedAt;
    }
}

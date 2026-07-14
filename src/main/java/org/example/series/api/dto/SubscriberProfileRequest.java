package org.example.series.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SubscriberProfileRequest {

    private Long id;

    @NotBlank(message = "Name must not be blank")
    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L} .'-]{1,119}$",
            message = "Name may contain only letters, spaces, apostrophes, dots, and hyphens"
    )
    private String name;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be valid")
    @Size(max = 180, message = "Email must be shorter than 180 characters")
    private String email;

    @NotNull(message = "notifyNewSeries flag is required")
    private Boolean notifyNewSeries;

    @NotNull(message = "notifyNewSeason flag is required")
    private Boolean notifyNewSeason;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getNotifyNewSeries() {
        return notifyNewSeries;
    }

    public void setNotifyNewSeries(Boolean notifyNewSeries) {
        this.notifyNewSeries = notifyNewSeries;
    }

    public Boolean getNotifyNewSeason() {
        return notifyNewSeason;
    }

    public void setNotifyNewSeason(Boolean notifyNewSeason) {
        this.notifyNewSeason = notifyNewSeason;
    }
}
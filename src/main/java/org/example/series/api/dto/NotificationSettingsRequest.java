package org.example.series.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class NotificationSettingsRequest {

    @NotBlank
    @Email
    private String recipientEmail;
    @NotBlank
    private String newSeriesSubjectTemplate;
    @NotBlank
    private String newSeriesBodyTemplate;
    @NotBlank
    private String newSeasonSubjectTemplate;
    @NotBlank
    private String newSeasonBodyTemplate;

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getNewSeriesSubjectTemplate() {
        return newSeriesSubjectTemplate;
    }

    public void setNewSeriesSubjectTemplate(String newSeriesSubjectTemplate) {
        this.newSeriesSubjectTemplate = newSeriesSubjectTemplate;
    }

    public String getNewSeriesBodyTemplate() {
        return newSeriesBodyTemplate;
    }

    public void setNewSeriesBodyTemplate(String newSeriesBodyTemplate) {
        this.newSeriesBodyTemplate = newSeriesBodyTemplate;
    }

    public String getNewSeasonSubjectTemplate() {
        return newSeasonSubjectTemplate;
    }

    public void setNewSeasonSubjectTemplate(String newSeasonSubjectTemplate) {
        this.newSeasonSubjectTemplate = newSeasonSubjectTemplate;
    }

    public String getNewSeasonBodyTemplate() {
        return newSeasonBodyTemplate;
    }

    public void setNewSeasonBodyTemplate(String newSeasonBodyTemplate) {
        this.newSeasonBodyTemplate = newSeasonBodyTemplate;
    }
}

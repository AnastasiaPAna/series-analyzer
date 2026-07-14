package org.example.series.api.dto;

public class NotificationSettingsResponse {

    private String recipientEmail;
    private String newSeriesSubjectTemplate;
    private String newSeriesBodyTemplate;
    private String newSeasonSubjectTemplate;
    private String newSeasonBodyTemplate;

    public NotificationSettingsResponse() {
    }

    public NotificationSettingsResponse(String recipientEmail,
                                        String newSeriesSubjectTemplate,
                                        String newSeriesBodyTemplate,
                                        String newSeasonSubjectTemplate,
                                        String newSeasonBodyTemplate) {
        this.recipientEmail = recipientEmail;
        this.newSeriesSubjectTemplate = newSeriesSubjectTemplate;
        this.newSeriesBodyTemplate = newSeriesBodyTemplate;
        this.newSeasonSubjectTemplate = newSeasonSubjectTemplate;
        this.newSeasonBodyTemplate = newSeasonBodyTemplate;
    }

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

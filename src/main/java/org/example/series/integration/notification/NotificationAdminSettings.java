package org.example.series.integration.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NotificationAdminSettings {

    private String recipientEmail;
    private String newSeriesSubjectTemplate = "New series created: {title}";
    private String newSeriesBodyTemplate = """
            A new series was created in Series Analyzer.

            Title: {title}
            Genre: {genre}
            Year: {year}
            Rating: {rating}
            Studio: {studio}
            Status: {status}
            """;
    private String newSeasonSubjectTemplate = "New season released: {title}";
    private String newSeasonBodyTemplate = """
            A new season was released in Series Analyzer.

            Title: {title}
            Previous seasons: {previousSeasons}
            Current seasons: {currentSeasons}
            Genre: {genre}
            Rating: {rating}
            Year: {year}
            Studio: {studio}
            """;

    public NotificationAdminSettings(@Value("${NOTIFICATION_ADMIN_EMAIL:admin@series.local}") String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public synchronized String getRecipientEmail() {
        return recipientEmail;
    }

    public synchronized void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public synchronized String getNewSeriesSubjectTemplate() {
        return newSeriesSubjectTemplate;
    }

    public synchronized void setNewSeriesSubjectTemplate(String newSeriesSubjectTemplate) {
        this.newSeriesSubjectTemplate = newSeriesSubjectTemplate;
    }

    public synchronized String getNewSeriesBodyTemplate() {
        return newSeriesBodyTemplate;
    }

    public synchronized void setNewSeriesBodyTemplate(String newSeriesBodyTemplate) {
        this.newSeriesBodyTemplate = newSeriesBodyTemplate;
    }

    public synchronized String getNewSeasonSubjectTemplate() {
        return newSeasonSubjectTemplate;
    }

    public synchronized void setNewSeasonSubjectTemplate(String newSeasonSubjectTemplate) {
        this.newSeasonSubjectTemplate = newSeasonSubjectTemplate;
    }

    public synchronized String getNewSeasonBodyTemplate() {
        return newSeasonBodyTemplate;
    }

    public synchronized void setNewSeasonBodyTemplate(String newSeasonBodyTemplate) {
        this.newSeasonBodyTemplate = newSeasonBodyTemplate;
    }
}

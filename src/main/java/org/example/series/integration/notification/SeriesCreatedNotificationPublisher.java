package org.example.series.integration.notification;

import org.example.series.core.model.Series;
import org.example.series.core.service.SubscriberProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

@Service
public class SeriesCreatedNotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(SeriesCreatedNotificationPublisher.class);

    private final RabbitTemplate rabbitTemplate;
    private final String exchangeName;
    private final String routingKey;
    private final NotificationAdminSettings notificationAdminSettings;
    private final SubscriberProfileService subscriberProfileService;

    public SeriesCreatedNotificationPublisher(RabbitTemplate rabbitTemplate,
                                              @Value("${EMAIL_NOTIFICATION_EXCHANGE:series.notifications}") String exchangeName,
                                              @Value("${EMAIL_NOTIFICATION_ROUTING_KEY:email.notification}") String routingKey,
                                              NotificationAdminSettings notificationAdminSettings,
                                              SubscriberProfileService subscriberProfileService) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchangeName = exchangeName;
        this.routingKey = routingKey;
        this.notificationAdminSettings = notificationAdminSettings;
        this.subscriberProfileService = subscriberProfileService;
    }

    public void publishSeriesCreated(Series series) {
        List<String> recipients = resolveRecipients(subscriberProfileService.getRecipientEmailsForNewSeries());
        if (recipients.isEmpty()) {
            return;
        }

        String studioName = series.getStudio() != null ? series.getStudio().getName() : "unknown studio";
        String status = series.isFinished() ? "Finished" : "In progress";

        recipients.forEach(recipientEmail -> publishNotification(
                recipientEmail,
                "SERIES_CREATED",
                applyTemplate(notificationAdminSettings.getNewSeriesSubjectTemplate(), series, 0, studioName, status),
                applyTemplate(notificationAdminSettings.getNewSeriesBodyTemplate(), series, 0, studioName, status),
                series.getId(),
                "series creation"
        ));
    }

    public void publishSeasonReleased(Series series, int previousSeasons) {
        int currentSeasons = series.getSeasons();
        if (currentSeasons <= previousSeasons) {
            return;
        }

        List<String> recipients = resolveRecipients(subscriberProfileService.getRecipientEmailsForNewSeason());
        if (recipients.isEmpty()) {
            return;
        }

        String studioName = series.getStudio() != null ? series.getStudio().getName() : "unknown studio";
        String status = series.isFinished() ? "Finished" : "In progress";

        recipients.forEach(recipientEmail -> publishNotification(
                recipientEmail,
                "SERIES_SEASON_RELEASED",
                applyTemplate(notificationAdminSettings.getNewSeasonSubjectTemplate(), series, previousSeasons, studioName, status),
                applyTemplate(notificationAdminSettings.getNewSeasonBodyTemplate(), series, previousSeasons, studioName, status),
                series.getId(),
                "season release"
        ));
    }

    private void publishNotification(String recipientEmail,
                                     String eventType,
                                     String subject,
                                     String content,
                                     Long seriesId,
                                     String logLabel) {
        EmailNotificationMessage message = new EmailNotificationMessage();
        message.setEventId(UUID.randomUUID().toString());
        message.setEventType(eventType);
        message.setRecipientEmail(recipientEmail);
        message.setSubject(subject);
        message.setContent(content);
        message.setEntityType("SERIES");
        message.setEntityId(seriesId);
        message.setCreatedAt(OffsetDateTime.now(ZoneOffset.UTC));

        try {
            rabbitTemplate.convertAndSend(exchangeName, routingKey, message);
        } catch (Exception ex) {
            log.warn("Could not publish {} email notification: {}", logLabel, ex.getMessage());
        }
    }

    private List<String> resolveRecipients(List<String> subscriberRecipients) {
        LinkedHashSet<String> recipients = new LinkedHashSet<>(subscriberRecipients);
        String fallbackEmail = notificationAdminSettings.getRecipientEmail();
        if (fallbackEmail != null && !fallbackEmail.isBlank()) {
            recipients.add(fallbackEmail.trim().toLowerCase());
        }
        return new ArrayList<>(recipients);
    }

    private String applyTemplate(String template, Series series, int previousSeasons, String studioName, String status) {
        return template
                .replace("{title}", series.getTitle())
                .replace("{genre}", series.getGenre())
                .replace("{year}", String.valueOf(series.getYear()))
                .replace("{rating}", String.valueOf(series.getRating()))
                .replace("{studio}", studioName)
                .replace("{status}", status)
                .replace("{previousSeasons}", String.valueOf(previousSeasons))
                .replace("{currentSeasons}", String.valueOf(series.getSeasons()));
    }
}

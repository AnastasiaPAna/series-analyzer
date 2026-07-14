package org.example.series.emailservice.model;

import org.example.series.emailservice.messaging.EmailNotificationMessage;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.OffsetDateTime;

@Document(indexName = "email-messages")
public class EmailMessageDocument {

    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String eventId;

    @Field(type = FieldType.Keyword)
    private String eventType;

    @Field(type = FieldType.Keyword)
    private String entityType;

    @Field(type = FieldType.Long)
    private Long entityId;

    @Field(type = FieldType.Keyword)
    private String recipientEmail;

    @Field(type = FieldType.Text)
    private String subject;

    @Field(type = FieldType.Text)
    private String content;

    @Field(type = FieldType.Keyword)
    private EmailDeliveryStatus status;

    @Field(type = FieldType.Integer)
    private int attemptCount;

    @Field(type = FieldType.Text)
    private String errorMessage;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private OffsetDateTime createdAt;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private OffsetDateTime updatedAt;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private OffsetDateTime lastAttemptAt;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private OffsetDateTime sentAt;

    public static EmailMessageDocument fromMessage(EmailNotificationMessage message) {
        EmailMessageDocument document = new EmailMessageDocument();
        document.setEventId(message.getEventId());
        document.setEventType(message.getEventType());
        document.setEntityType(message.getEntityType());
        document.setEntityId(message.getEntityId());
        document.setRecipientEmail(message.getRecipientEmail());
        document.setSubject(message.getSubject());
        document.setContent(message.getContent());
        document.setStatus(EmailDeliveryStatus.PENDING);
        document.setCreatedAt(message.getCreatedAt());
        document.setUpdatedAt(message.getCreatedAt());
        return document;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public EmailDeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(EmailDeliveryStatus status) {
        this.status = status;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public OffsetDateTime getLastAttemptAt() {
        return lastAttemptAt;
    }

    public void setLastAttemptAt(OffsetDateTime lastAttemptAt) {
        this.lastAttemptAt = lastAttemptAt;
    }

    public OffsetDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(OffsetDateTime sentAt) {
        this.sentAt = sentAt;
    }
}

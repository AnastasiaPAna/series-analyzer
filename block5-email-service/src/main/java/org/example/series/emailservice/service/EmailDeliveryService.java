package org.example.series.emailservice.service;

import org.example.series.emailservice.messaging.EmailNotificationMessage;
import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.example.series.emailservice.repository.EmailMessageRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class EmailDeliveryService {

    private final EmailMessageRepository repository;
    private final EmailRuntimeSettings emailRuntimeSettings;

    public EmailDeliveryService(EmailMessageRepository repository,
                                EmailRuntimeSettings emailRuntimeSettings) {
        this.repository = repository;
        this.emailRuntimeSettings = emailRuntimeSettings;
    }

    public EmailMessageDocument acceptAndDeliver(EmailNotificationMessage message) {
        EmailMessageDocument stored = repository.save(EmailMessageDocument.fromMessage(message));
        return attemptDelivery(stored);
    }

    public EmailMessageDocument attemptDelivery(EmailMessageDocument document) {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        document.setLastAttemptAt(now);
        document.setUpdatedAt(now);
        document.setAttemptCount(document.getAttemptCount() + 1);

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(emailRuntimeSettings.getFromEmail());
            mailMessage.setTo(document.getRecipientEmail());
            mailMessage.setSubject(document.getSubject());
            mailMessage.setText(document.getContent());
            emailRuntimeSettings.createMailSender().send(mailMessage);

            document.setStatus(EmailDeliveryStatus.SENT);
            document.setSentAt(now);
            document.setErrorMessage(null);
        } catch (Exception ex) {
            document.setStatus(EmailDeliveryStatus.FAILED);
            document.setErrorMessage(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }

        return repository.save(document);
    }

    public int retryFailedMessages() {
        List<EmailMessageDocument> failed = repository.findTop100ByStatusOrderByLastAttemptAtAsc(EmailDeliveryStatus.FAILED);
        failed.forEach(this::attemptDelivery);
        return failed.size();
    }

    public List<EmailMessageDocument> listMessages(EmailDeliveryStatus status) {
        if (status == null) {
            return repository.findTop100ByOrderByCreatedAtDesc();
        }
        return repository.findTop100ByStatusOrderByCreatedAtDesc(status);
    }

    public EmailMessageDocument retryById(String id) {
        EmailMessageDocument document = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Email message not found"));
        return attemptDelivery(document);
    }
}

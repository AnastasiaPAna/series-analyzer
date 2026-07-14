package org.example.series.emailservice.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EmailRetryScheduler {

    private final EmailDeliveryService emailDeliveryService;

    public EmailRetryScheduler(EmailDeliveryService emailDeliveryService) {
        this.emailDeliveryService = emailDeliveryService;
    }

    @Scheduled(fixedDelayString = "${app.email.retry.fixed-delay-ms:300000}")
    public void retryFailedMessages() {
        emailDeliveryService.retryFailedMessages();
    }
}

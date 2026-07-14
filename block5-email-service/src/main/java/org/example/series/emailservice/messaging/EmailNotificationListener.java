package org.example.series.emailservice.messaging;

import jakarta.validation.Valid;
import org.example.series.emailservice.service.EmailDeliveryService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@Validated
public class EmailNotificationListener {

    private final EmailDeliveryService emailDeliveryService;

    public EmailNotificationListener(EmailDeliveryService emailDeliveryService) {
        this.emailDeliveryService = emailDeliveryService;
    }

    @RabbitListener(queues = "${app.email.queue}")
    public void consume(@Valid EmailNotificationMessage message) {
        emailDeliveryService.acceptAndDeliver(message);
    }
}

package org.example.series.emailservice.controller;

import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.example.series.emailservice.service.EmailDeliveryService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmailMessageController {

    private final EmailDeliveryService emailDeliveryService;

    public EmailMessageController(EmailDeliveryService emailDeliveryService) {
        this.emailDeliveryService = emailDeliveryService;
    }

    @GetMapping
    public List<EmailMessageDocument> list(@RequestParam(required = false) EmailDeliveryStatus status) {
        return emailDeliveryService.listMessages(status);
    }
}

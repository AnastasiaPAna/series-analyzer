package org.example.series.emailservice.controller;

import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.example.series.emailservice.service.EmailDeliveryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmailAdminController {

    private final EmailDeliveryService emailDeliveryService;
    private final String adminAccessToken;

    public EmailAdminController(EmailDeliveryService emailDeliveryService,
                                @Value("${app.admin.access-token:series-admin-access}") String adminAccessToken) {
        this.emailDeliveryService = emailDeliveryService;
        this.adminAccessToken = adminAccessToken;
    }

    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
                "service", "block5-email-service",
                "kind", "rest-api",
                "endpoints", Map.of(
                        "health", "/health",
                        "messages", "GET /api/emails",
                        "adminMessages", "GET /api/admin/messages",
                        "emailSettings", "GET /api/admin/email-settings",
                        "retryFailed", "POST /api/admin/messages/retry-failed",
                        "retrySingle", "POST /api/admin/messages/{id}/retry"
                )
        );
    }

    @GetMapping("/api/admin/messages")
    public Iterable<EmailMessageDocument> listMessages(@RequestHeader("X-Admin-Token") String token,
                                                       @RequestParam(required = false) EmailDeliveryStatus status) {
        ensureAdmin(token);
        return emailDeliveryService.listMessages(status);
    }

    @PostMapping("/api/admin/messages/retry-failed")
    public Map<String, Object> retryFailedBatch(@RequestHeader("X-Admin-Token") String token) {
        ensureAdmin(token);
        int retried = emailDeliveryService.retryFailedMessages();
        return Map.of(
                "retried", retried,
                "status", "ok"
        );
    }

    @PostMapping("/api/admin/messages/{id}/retry")
    public EmailMessageDocument retrySingle(@PathVariable String id,
                                            @RequestHeader("X-Admin-Token") String token) {
        ensureAdmin(token);
        return emailDeliveryService.retryById(id);
    }

    private void ensureAdmin(String token) {
        if (!adminAccessToken.equals(token)) {
            throw new ResponseStatusException(FORBIDDEN, "Admin access token is invalid");
        }
    }
}

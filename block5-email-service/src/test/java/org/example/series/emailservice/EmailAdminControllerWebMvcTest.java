package org.example.series.emailservice;

import org.example.series.emailservice.controller.EmailAdminController;
import org.example.series.emailservice.controller.EmailMessageController;
import org.example.series.emailservice.controller.HealthController;
import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.example.series.emailservice.service.EmailDeliveryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        EmailAdminController.class,
        EmailMessageController.class,
        HealthController.class
})
@TestPropertySource(properties = "app.admin.access-token=test-admin-token")
class EmailAdminControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailDeliveryService emailDeliveryService;

    @Test
    void shouldRejectAdminMessagesRequestWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/admin/messages")
                        .header("X-Admin-Token", "wrong-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnAdminMessagesForValidToken() throws Exception {
        EmailMessageDocument message = sampleDocument();
        when(emailDeliveryService.listMessages(eq(EmailDeliveryStatus.FAILED)))
                .thenReturn(List.of(message));

        mockMvc.perform(get("/api/admin/messages")
                        .header("X-Admin-Token", "test-admin-token")
                        .param("status", "FAILED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subject").value("New series created"))
                .andExpect(jsonPath("$[0].status").value("FAILED"));
    }

    @Test
    void shouldRejectRetryBatchWithInvalidToken() throws Exception {
        mockMvc.perform(post("/api/admin/messages/retry-failed")
                        .header("X-Admin-Token", "wrong-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRetryFailedMessagesForValidToken() throws Exception {
        when(emailDeliveryService.retryFailedMessages()).thenReturn(3);

        mockMvc.perform(post("/api/admin/messages/retry-failed")
                        .header("X-Admin-Token", "test-admin-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.retried").value(3));

        verify(emailDeliveryService).retryFailedMessages();
    }

    @Test
    void shouldExposePublicEmailListWithoutAdminToken() throws Exception {
        when(emailDeliveryService.listMessages(null)).thenReturn(List.of(sampleDocument()));

        mockMvc.perform(get("/api/emails"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].recipientEmail").value("admin@series.local"));
    }

    private EmailMessageDocument sampleDocument() {
        EmailMessageDocument document = new EmailMessageDocument();
        document.setId("mail-1");
        document.setEventId("evt-1");
        document.setEventType("SERIES_CREATED");
        document.setRecipientEmail("admin@series.local");
        document.setSubject("New series created");
        document.setContent("Series \"Dark Matter\" was created.");
        document.setEntityType("SERIES");
        document.setEntityId(42L);
        document.setStatus(EmailDeliveryStatus.FAILED);
        document.setAttemptCount(2);
        document.setErrorMessage("MailSendException: SMTP unavailable");
        document.setCreatedAt(OffsetDateTime.now());
        document.setLastAttemptAt(OffsetDateTime.now());
        return document;
    }
}

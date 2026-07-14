package org.example.series.emailservice;

import org.example.series.emailservice.messaging.EmailNotificationListener;
import org.example.series.emailservice.messaging.EmailNotificationMessage;
import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.example.series.emailservice.repository.EmailMessageRepository;
import org.example.series.emailservice.service.EmailDeliveryService;
import org.example.series.emailservice.service.EmailRuntimeSettings;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = {
        "app.email.from=test@series.local",
        "app.email.elasticsearch.init.enabled=false",
        "spring.rabbitmq.listener.simple.auto-startup=false"
})
class EmailDeliveryServiceIntegrationTest {

    @Autowired
    private EmailDeliveryService emailDeliveryService;

    @Autowired
    private EmailNotificationListener emailNotificationListener;

    @MockBean
    private EmailMessageRepository emailMessageRepository;

    @MockBean
    private EmailRuntimeSettings emailRuntimeSettings;

    private JavaMailSenderImpl javaMailSender;

    @BeforeEach
    void setUp() {
        when(emailMessageRepository.save(ArgumentMatchers.any(EmailMessageDocument.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        javaMailSender = mock(JavaMailSenderImpl.class);
        when(emailRuntimeSettings.getFromEmail()).thenReturn("test@series.local");
        when(emailRuntimeSettings.createMailSender()).thenReturn(javaMailSender);
    }

    @Test
    void shouldMarkMessageAsSentWhenMailServerAcceptsIt() {
        EmailMessageDocument result = emailDeliveryService.acceptAndDeliver(sampleMessage());

        assertThat(result.getStatus()).isEqualTo(EmailDeliveryStatus.SENT);
        assertThat(result.getAttemptCount()).isEqualTo(1);
        assertThat(result.getErrorMessage()).isNull();
        assertThat(result.getSentAt()).isNotNull();
    }

    @Test
    void shouldMarkMessageAsFailedWhenMailServerThrowsError() {
        doThrow(new MailSendException("SMTP is unavailable"))
                .when(javaMailSender)
                .send(ArgumentMatchers.any(org.springframework.mail.SimpleMailMessage.class));

        EmailMessageDocument result = emailDeliveryService.acceptAndDeliver(sampleMessage());

        assertThat(result.getStatus()).isEqualTo(EmailDeliveryStatus.FAILED);
        assertThat(result.getAttemptCount()).isEqualTo(1);
        assertThat(result.getErrorMessage()).contains("MailSendException");
    }

    @Test
    void shouldRetryFailedMessagesAndMarkThemAsSent() {
        EmailMessageDocument failed = EmailMessageDocument.fromMessage(sampleMessage());
        failed.setStatus(EmailDeliveryStatus.FAILED);
        failed.setAttemptCount(1);
        failed.setLastAttemptAt(OffsetDateTime.now().minusMinutes(10));

        when(emailMessageRepository.findTop100ByStatusOrderByLastAttemptAtAsc(EmailDeliveryStatus.FAILED))
                .thenReturn(List.of(failed));

        int retried = emailDeliveryService.retryFailedMessages();

        assertThat(retried).isEqualTo(1);
        assertThat(failed.getStatus()).isEqualTo(EmailDeliveryStatus.SENT);
        assertThat(failed.getAttemptCount()).isEqualTo(2);
        assertThat(failed.getErrorMessage()).isNull();
        assertThat(failed.getSentAt()).isNotNull();
    }

    @Test
    void shouldRetryFailedMessagesAndKeepThemFailedWhenSmtpIsStillUnavailable() {
        EmailMessageDocument failed = EmailMessageDocument.fromMessage(sampleMessage());
        failed.setStatus(EmailDeliveryStatus.FAILED);
        failed.setAttemptCount(2);
        failed.setLastAttemptAt(OffsetDateTime.now().minusMinutes(10));

        when(emailMessageRepository.findTop100ByStatusOrderByLastAttemptAtAsc(EmailDeliveryStatus.FAILED))
                .thenReturn(List.of(failed));

        doThrow(new MailSendException("SMTP is still unavailable"))
                .when(javaMailSender)
                .send(ArgumentMatchers.any(org.springframework.mail.SimpleMailMessage.class));

        int retried = emailDeliveryService.retryFailedMessages();

        assertThat(retried).isEqualTo(1);
        assertThat(failed.getStatus()).isEqualTo(EmailDeliveryStatus.FAILED);
        assertThat(failed.getAttemptCount()).isEqualTo(3);
        assertThat(failed.getErrorMessage()).contains("MailSendException");
        assertThat(failed.getLastAttemptAt()).isNotNull();
    }

    @Test
    void listenerShouldDelegateToDeliveryService() {
        emailNotificationListener.consume(sampleMessage());

        verify(emailMessageRepository, times(2)).save(ArgumentMatchers.any(EmailMessageDocument.class));
    }

    private EmailNotificationMessage sampleMessage() {
        EmailNotificationMessage message = new EmailNotificationMessage();
        message.setEventId("evt-1");
        message.setEventType("SERIES_CREATED");
        message.setRecipientEmail("admin@series.local");
        message.setSubject("New series created");
        message.setContent("Series \"Dark Matter\" was created.");
        message.setEntityType("SERIES");
        message.setEntityId(42L);
        message.setCreatedAt(OffsetDateTime.now());
        return message;
    }
}

package org.example.series.emailservice.service;

import org.example.series.emailservice.dto.EmailSettingsResponse;
import org.example.series.emailservice.dto.UpdateEmailSettingsRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class EmailRuntimeSettings {

    private String smtpHost;
    private int smtpPort;
    private String smtpUsername;
    private String smtpPassword;
    private boolean smtpAuth;
    private boolean smtpStarttls;
    private String fromEmail;

    public EmailRuntimeSettings(@Value("${spring.mail.host:localhost}") String smtpHost,
                                @Value("${spring.mail.port:1025}") int smtpPort,
                                @Value("${spring.mail.username:}") String smtpUsername,
                                @Value("${spring.mail.password:}") String smtpPassword,
                                @Value("${spring.mail.properties.mail.smtp.auth:false}") boolean smtpAuth,
                                @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}") boolean smtpStarttls,
                                @Value("${app.email.from:no-reply@series.local}") String fromEmail) {
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
        this.smtpUsername = smtpUsername;
        this.smtpPassword = smtpPassword;
        this.smtpAuth = smtpAuth;
        this.smtpStarttls = smtpStarttls;
        this.fromEmail = fromEmail;
    }

    public synchronized EmailSettingsResponse getSettings() {
        EmailSettingsResponse response = new EmailSettingsResponse();
        response.setSmtpHost(smtpHost);
        response.setSmtpPort(smtpPort);
        response.setSmtpUsername(smtpUsername);
        response.setSmtpPassword("");
        response.setSmtpAuth(smtpAuth);
        response.setSmtpStarttls(smtpStarttls);
        response.setFromEmail(fromEmail);
        return response;
    }

    public synchronized EmailSettingsResponse update(UpdateEmailSettingsRequest request) {
        smtpHost = request.getSmtpHost();
        smtpPort = request.getSmtpPort();
        smtpUsername = request.getSmtpUsername() == null ? "" : request.getSmtpUsername();
        if (request.getSmtpPassword() != null && !request.getSmtpPassword().isBlank()) {
            smtpPassword = request.getSmtpPassword();
        }
        smtpAuth = request.isSmtpAuth();
        smtpStarttls = request.isSmtpStarttls();
        fromEmail = request.getFromEmail();
        return getSettings();
    }

    public synchronized JavaMailSenderImpl createMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(smtpHost);
        sender.setPort(smtpPort);
        sender.setUsername(smtpUsername);
        sender.setPassword(smtpPassword);

        Properties properties = sender.getJavaMailProperties();
        properties.put("mail.smtp.auth", Boolean.toString(smtpAuth));
        properties.put("mail.smtp.starttls.enable", Boolean.toString(smtpStarttls));
        return sender;
    }

    public synchronized String getFromEmail() {
        return fromEmail;
    }
}

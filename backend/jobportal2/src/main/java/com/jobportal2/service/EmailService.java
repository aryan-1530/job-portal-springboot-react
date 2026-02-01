package com.jobportal2.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Best-effort email sender.
     * Email failure must NEVER break business logic.
     */
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("📧 Email sent to {}", to);

        } catch (Exception ex) {
            // 🔥 DO NOT THROW — JUST LOG
            log.warn(
                "⚠️ Email failed for {} | reason: {}",
                to,
                ex.getMessage()
            );
        }
    }
}

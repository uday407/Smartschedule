package com.smartscheduler.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:nudaykumar2005@gmail.com}")
    private String fromEmail;

    @Async
    public void sendScheduleNotification(String toEmail, String subject, String content) {
        log.info("📧 [Email Dispatch] Preparing email to '{}' | Subject: '{}'", toEmail, subject);
        
        if (mailSender != null && toEmail != null && toEmail.contains("@")) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail != null ? fromEmail : "nudaykumar2005@gmail.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                log.info("✅ [Email Sent Successfully] Sent email to '{}'", toEmail);
            } catch (Exception e) {
                log.warn("⚠️ [Email Delivery Failed] Fallback log output for {}: {}", toEmail, e.getMessage());
            }
        } else {
            log.info("ℹ️ [Mock Email Service] Recipient: {} | Subject: {}\nBody:\n{}", toEmail, subject, content);
        }
    }
}
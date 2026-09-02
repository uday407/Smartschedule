package com.smartscheduler.service;

import com.smartscheduler.entity.Notification;
import com.smartscheduler.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String recipient, String title, String message, String type) {
        Notification notification = new Notification(recipient, title, message, type);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String username) {
        return notificationRepository.findByRecipientUsernameInOrderByCreatedAtDesc(Arrays.asList(username, "ALL"));
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}

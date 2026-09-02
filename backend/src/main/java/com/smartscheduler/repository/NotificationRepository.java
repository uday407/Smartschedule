package com.smartscheduler.repository;

import com.smartscheduler.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUsernameInOrderByCreatedAtDesc(List<String> recipients);
    List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(String recipientUsername);
}

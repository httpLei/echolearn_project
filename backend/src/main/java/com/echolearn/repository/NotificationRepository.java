package com.echolearn.repository;

import com.echolearn.model.Notification;
import com.echolearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find all notifications for a user
    List<Notification> findByUser(User user);
    
    // Find unread notifications
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);
    
    // Find snoozed notifications
    List<Notification> findByUserAndIsSnoozed(User user, Boolean isSnoozed);
    
    // Count unread notifications
    long countByUserAndIsRead(User user, Boolean isRead);
    
    // Find notifications ordered by creation date
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}

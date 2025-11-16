package com.core.echolearn.repository;

import com.core.echolearn.entity.Notification;
import com.core.echolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser(User user);
    
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);
    
    List<Notification> findByUserAndStatus(User user, String status);
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    long countByUserAndIsRead(User user, Boolean isRead);
}

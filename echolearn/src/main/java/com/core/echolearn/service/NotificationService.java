package com.core.echolearn.service;

import com.core.echolearn.entity.Notification;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsRead(user, false);
    }
    
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsRead(user, false);
    }
    
    public List<Notification> getNotificationsByStatus(User user, String status) {
        return notificationRepository.findByUserAndStatus(user, status);
    }
    
    public Notification markAsRead(Long id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.markAsRead();
            return notificationRepository.save(notification);
        }
        return null;
    }
    
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserAndIsRead(user, false);
        for (Notification notification : notifications) {
            notification.markAsRead();
        }
        notificationRepository.saveAll(notifications);
    }
    
    public Notification updateNotificationStatus(Long id, String status) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setStatus(status);
            return notificationRepository.save(notification);
        }
        return null;
    }
    
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}

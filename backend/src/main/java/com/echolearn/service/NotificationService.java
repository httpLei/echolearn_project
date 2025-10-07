package com.echolearn.service;

import com.echolearn.model.Notification;
import com.echolearn.model.NotificationType;
import com.echolearn.model.User;
import com.echolearn.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserService userService;
    
    // Create a new notification
    public Notification createNotification(Long userId, String title, String message, NotificationType type) {
        User user = userService.getUserById(userId);
        
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setUser(user);
        
        return notificationRepository.save(notification);
    }
    
    // Get all notifications for a user
    public List<Notification> getNotificationsByUser(Long userId) {
        User user = userService.getUserById(userId);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    // Get unread notifications
    public List<Notification> getUnreadNotifications(Long userId) {
        User user = userService.getUserById(userId);
        return notificationRepository.findByUserAndIsRead(user, false);
    }
    
    // Get snoozed notifications
    public List<Notification> getSnoozedNotifications(Long userId) {
        User user = userService.getUserById(userId);
        return notificationRepository.findByUserAndIsSnoozed(user, true);
    }
    
    // Count unread notifications
    public long countUnreadNotifications(Long userId) {
        User user = userService.getUserById(userId);
        return notificationRepository.countByUserAndIsRead(user, false);
    }
    
    // Mark notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    // Mark all notifications as read
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
    
    // Snooze notification
    public Notification snoozeNotification(Long notificationId, int hours) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsSnoozed(true);
        notification.setSnoozedUntil(LocalDateTime.now().plusHours(hours));
        return notificationRepository.save(notification);
    }
    
    // Delete notification
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}

package com.echolearn.controller;

import com.echolearn.model.Notification;
import com.echolearn.model.NotificationType;
import com.echolearn.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }
    
    // Get unread notifications
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    // Get snoozed notifications
    @GetMapping("/user/{userId}/snoozed")
    public ResponseEntity<List<Notification>> getSnoozedNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getSnoozedNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    // Get notification stats
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Long>> getNotificationStats(@PathVariable Long userId) {
        long unreadCount = notificationService.countUnreadNotifications(userId);
        long snoozedCount = notificationService.getSnoozedNotifications(userId).size();
        long totalCount = notificationService.getNotificationsByUser(userId).size();
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("unread", unreadCount);
        stats.put("snoozed", snoozedCount);
        stats.put("total", totalCount);
        
        return ResponseEntity.ok(stats);
    }
    
    // Create new notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Map<String, String> request) {
        Long userId = Long.valueOf(request.get("userId"));
        String title = request.get("title");
        String message = request.get("message");
        NotificationType type = NotificationType.valueOf(request.get("type").toUpperCase());
        
        Notification notification = notificationService.createNotification(userId, title, message, type);
        return ResponseEntity.ok(notification);
    }
    
    // Mark notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }
    
    // Mark all notifications as read
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    // Snooze notification
    @PutMapping("/{id}/snooze")
    public ResponseEntity<Notification> snoozeNotification(
            @PathVariable Long id, 
            @RequestParam int hours) {
        Notification notification = notificationService.snoozeNotification(id, hours);
        return ResponseEntity.ok(notification);
    }
    
    // Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}

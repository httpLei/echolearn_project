package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notifId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String message;
    
    @Column(nullable = false)
    private String type; // ASSIGNMENT, DEADLINE, ACTIVITY, MESSAGE, etc.
    
    @Column(nullable = false)
    private String status; // ACTIVE, SNOOZED, DISMISSED
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "reference_id")
    private Long referenceId; // For navigation: assignmentId, conversationId, etc.
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    // Constructors
    public Notification() {
    }
    
    public Notification(String title, String message, String type) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = false;
        this.status = "ACTIVE";
    }
    
    public Notification(String title, String message, String type, Long referenceId) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.isRead = false;
        this.status = "ACTIVE";
    }
    
    // Getters and Setters
    public Long getNotifId() {
        return notifId;
    }
    
    public void setNotifId(Long notifId) {
        this.notifId = notifId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Long getReferenceId() {
        return referenceId;
    }
    
    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }
    
    // Business method
    public void markAsRead() {
        this.isRead = true;
    }
}

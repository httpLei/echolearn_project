package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "estimated_time")
    private Integer estimatedTime; // in minutes
    
    @Column(nullable = false)
    private String difficulty; // EASY, MEDIUM, HARD
    
    @Column(nullable = false)
    private Boolean completed;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "file_names", length = 2000)
    private String fileNames; // Comma-separated file names attached by teacher
    
    @Column(name = "allow_late_submission")
    private Boolean allowLateSubmission;
    
    @Column(name = "max_points")
    private Integer maxPoints; // Maximum points for the assignment
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (completed == null) {
            completed = false;
        }
    }
    
    // Constructors
    public Assignment() {
    }
    
    public Assignment(String title, String description, LocalDate dueDate, 
                     Subject subject, Integer estimatedTime, String difficulty) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.subject = subject;
        this.estimatedTime = estimatedTime;
        this.difficulty = difficulty;
        this.completed = false;
    }
    
    // Getters and Setters
    public Long getActivityId() {
        return activityId;
    }
    
    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public Subject getSubject() {
        return subject;
    }
    
    public void setSubject(Subject subject) {
        this.subject = subject;
    }
    
    public Integer getEstimatedTime() {
        return estimatedTime;
    }
    
    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public Boolean getCompleted() {
        return completed;
    }
    
    public void setCompleted(Boolean completed) {
        this.completed = completed;
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
    
    public String getFileNames() {
        return fileNames;
    }
    
    public void setFileNames(String fileNames) {
        this.fileNames = fileNames;
    }
    
    public Boolean getAllowLateSubmission() {
        return allowLateSubmission;
    }
    
    public void setAllowLateSubmission(Boolean allowLateSubmission) {
        this.allowLateSubmission = allowLateSubmission;
    }
    
    public Integer getMaxPoints() {
        return maxPoints;
    }
    
    public void setMaxPoints(Integer maxPoints) {
        this.maxPoints = maxPoints;
    }
}

package com.core.echolearn.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "class_replies")
public class ClassReply {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long replyId;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private ClassPost post; 
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isDeleted == null) {
            isDeleted = false;
        }
    }
    
    public ClassReply() {}
    
    public ClassReply(ClassPost post, User author, String content) {
        this.post = post;
        this.author = author;
        this.content = content;
    }

    // Getters and Setters
    public Long getReplyId() { return replyId; }
    public void setReplyId(Long replyId) { this.replyId = replyId; }
    public ClassPost getPost() { return post; }
    public void setPost(ClassPost post) { this.post = post; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
}
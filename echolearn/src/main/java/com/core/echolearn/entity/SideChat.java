package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "side_chats")
public class SideChat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sideChatId;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @OneToMany(mappedBy = "sideChat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean isDeleted = false;
    
    public SideChat() {
        this.createdAt = LocalDateTime.now();
        this.isDeleted = false;
    }
    
    public SideChat(Conversation conversation, String title, User createdBy) {
        this.conversation = conversation;
        this.title = title;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.isDeleted = false;
    }
    
    // Getters and Setters
    public Long getSideChatId() {
        return sideChatId;
    }
    
    public void setSideChatId(Long sideChatId) {
        this.sideChatId = sideChatId;
    }
    
    public Conversation getConversation() {
        return conversation;
    }
    
    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public List<Message> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
    
    public Boolean getIsDeleted() {
        return isDeleted;
    }
    
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}

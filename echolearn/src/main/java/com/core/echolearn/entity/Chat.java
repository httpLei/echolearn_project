package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chats")
public class Chat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "parent_chat_id")
    private Chat parentChat;
    
    @OneToMany(mappedBy = "parentChat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> sideChats = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean isEdited = false;
    
    @Column(nullable = false)
    private Boolean isDeleted = false;
    
    @Column
    private String channelName = "general";
    
    public Chat() {
        this.timestamp = LocalDateTime.now();
    }
    
    public Chat(String content, User user) {
        this.content = content;
        this.user = user;
        this.timestamp = LocalDateTime.now();
        this.isEdited = false;
        this.isDeleted = false;
    }
    
    public Chat(String content, User user, Chat parentChat) {
        this.content = content;
        this.user = user;
        this.parentChat = parentChat;
        this.timestamp = LocalDateTime.now();
        this.isEdited = false;
        this.isDeleted = false;
    }
    
    // Getters and Setters
    public Long getChatId() {
        return chatId;
    }
    
    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Chat getParentChat() {
        return parentChat;
    }
    
    public void setParentChat(Chat parentChat) {
        this.parentChat = parentChat;
    }
    
    public List<Chat> getSideChats() {
        return sideChats;
    }
    
    public void setSideChats(List<Chat> sideChats) {
        this.sideChats = sideChats;
    }
    
    public Boolean getIsEdited() {
        return isEdited;
    }
    
    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
    }
    
    public Boolean getIsDeleted() {
        return isDeleted;
    }
    
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
    
    public String getChannelName() {
        return channelName;
    }
    
    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }
}

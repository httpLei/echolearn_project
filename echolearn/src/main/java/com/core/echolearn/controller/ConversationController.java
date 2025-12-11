package com.core.echolearn.controller;

import com.core.echolearn.entity.Conversation;
import com.core.echolearn.entity.Message;
import com.core.echolearn.entity.SideChat;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Notification;
import com.core.echolearn.service.ConversationService;
import com.core.echolearn.service.UserService;
import com.core.echolearn.service.NotificationService;
import com.core.echolearn.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "http://localhost:3000")
public class ConversationController {
    
    @Autowired
    private ConversationService conversationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    // Get all conversations for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserConversations(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            List<Conversation> conversations = conversationService.getUserConversations(userOpt.get());
            
            // Transform to DTO for frontend
            List<Map<String, Object>> conversationDTOs = conversations.stream().map(conv -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", conv.getConversationId());
                
                // Determine the other user in the conversation
                User otherUser = conv.getUser1().getId().equals(userId) ? conv.getUser2() : conv.getUser1();
                dto.put("userId", otherUser.getId());
                dto.put("name", otherUser.getUsername());
                dto.put("username", otherUser.getUsername());
                dto.put("avatar", otherUser.getUsername().substring(0, 1).toUpperCase());
                
                // Get last message
                List<Message> messages = conversationService.getConversationMessages(conv.getConversationId());
                if (!messages.isEmpty()) {
                    Message lastMsg = messages.get(messages.size() - 1);
                    dto.put("lastMessage", lastMsg.getContent());
                    dto.put("time", lastMsg.getTimestamp());
                } else {
                    dto.put("lastMessage", "No messages yet");
                    dto.put("time", conv.getCreatedAt());
                }
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(conversationDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get or create conversation between two users
    @PostMapping("/start")
    public ResponseEntity<?> startConversation(@RequestBody Map<String, Long> payload) {
        try {
            Long user1Id = payload.get("user1Id");
            Long user2Id = payload.get("user2Id");
            
            Optional<User> user1Opt = userService.findById(user1Id);
            Optional<User> user2Opt = userService.findById(user2Id);
            
            if (!user1Opt.isPresent() || !user2Opt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            Conversation conversation = conversationService.getOrCreateConversation(user1Opt.get(), user2Opt.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("conversationId", conversation.getConversationId());
            response.put("createdAt", conversation.getCreatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get messages in a conversation
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long conversationId) {
        try {
            List<Message> messages = conversationService.getConversationMessages(conversationId);
            
            List<Map<String, Object>> messageDTOs = messages.stream().map(msg -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", msg.getMessageId());
                dto.put("senderId", msg.getSender().getId());
                dto.put("sender", msg.getSender().getUsername());
                dto.put("content", msg.getContent());
                dto.put("timestamp", msg.getTimestamp());
                dto.put("isEdited", msg.getIsEdited());
                dto.put("isDeleted", msg.getIsDeleted());
                dto.put("avatar", msg.getSender().getUsername().substring(0, 1).toUpperCase());
                
                if (msg.getFileUrl() != null) {
                    dto.put("fileUrl", msg.getFileUrl());
                    dto.put("fileName", msg.getFileName());
                    dto.put("fileType", msg.getFileType());
                }
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(messageDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Send a message
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long conversationId, @RequestBody Map<String, Object> payload) {
        try {
            Long senderId = Long.valueOf(payload.get("senderId").toString());
            String content = (String) payload.get("content");
            
            Optional<User> senderOpt = userService.findById(senderId);
            if (!senderOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            Message message = conversationService.sendMessage(conversationId, senderOpt.get(), content);
            
            if (message != null) {
                // Get the conversation to find the recipient
                Optional<Conversation> convOpt = conversationService.findById(conversationId);
                if (convOpt.isPresent()) {
                    Conversation conversation = convOpt.get();
                    // Determine the recipient (the other user in the conversation)
                    User recipient = conversation.getUser1().getId().equals(senderId) ? 
                                    conversation.getUser2() : conversation.getUser1();
                    
                    // Create notification for the recipient
                    Notification notification = new Notification(
                        "New Message",
                        senderOpt.get().getUsername() + " sent you a message",
                        "MESSAGE",
                        conversationId
                    );
                    notification.setUser(recipient);
                    notificationService.createNotification(notification);
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", message.getMessageId());
                response.put("senderId", message.getSender().getId());
                response.put("sender", message.getSender().getUsername());
                response.put("content", message.getContent());
                response.put("timestamp", message.getTimestamp());
                response.put("avatar", message.getSender().getUsername().substring(0, 1).toUpperCase());
                
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conversation not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Send message with file attachment
    @PostMapping("/{conversationId}/messages/upload")
    public ResponseEntity<?> sendMessageWithFile(
            @PathVariable Long conversationId,
            @RequestParam("senderId") Long senderId,
            @RequestParam(value = "content", required = false, defaultValue = "") String content,
            @RequestParam("file") MultipartFile file) {
        try {
            Optional<User> senderOpt = userService.findById(senderId);
            if (!senderOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            // Store the file
            String storedFileName = fileStorageService.storeFile(file);
            String[] parts = storedFileName.split("\\|");
            String fileUrl = parts[0]; // UUID
            String originalFileName = parts.length > 1 ? parts[1] : file.getOriginalFilename();
            
            // Create message content with file info
            String messageContent = content.isEmpty() ? "📎 " + originalFileName : content;
            
            // Send message with file information
            Message message = conversationService.sendMessageWithFile(
                conversationId, 
                senderOpt.get(), 
                messageContent,
                fileUrl,
                originalFileName,
                file.getContentType()
            );
            
            if (message != null) {
                // Get the conversation to find the recipient
                Optional<Conversation> convOpt = conversationService.findById(conversationId);
                if (convOpt.isPresent()) {
                    Conversation conversation = convOpt.get();
                    User recipient = conversation.getUser1().getId().equals(senderId) ? 
                                    conversation.getUser2() : conversation.getUser1();
                    
                    // Create notification for the recipient
                    Notification notification = new Notification(
                        "New Message",
                        senderOpt.get().getUsername() + " sent you a file",
                        "MESSAGE",
                        conversationId
                    );
                    notification.setUser(recipient);
                    notificationService.createNotification(notification);
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", message.getMessageId());
                response.put("senderId", message.getSender().getId());
                response.put("sender", message.getSender().getUsername());
                response.put("content", message.getContent());
                response.put("timestamp", message.getTimestamp());
                response.put("avatar", message.getSender().getUsername().substring(0, 1).toUpperCase());
                response.put("fileUrl", message.getFileUrl());
                response.put("fileName", message.getFileName());
                response.put("fileType", message.getFileType());
                
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conversation not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Edit a message
    @PutMapping("/messages/{messageId}")
    public ResponseEntity<?> editMessage(@PathVariable Long messageId, @RequestBody Map<String, String> payload) {
        try {
            String newContent = payload.get("content");
            Message message = conversationService.editMessage(messageId, newContent);
            
            if (message != null) {
                return ResponseEntity.ok(message);
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Delete a message
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        try {
            boolean deleted = conversationService.deleteMessage(messageId);
            
            if (deleted) {
                return ResponseEntity.ok("Message deleted successfully");
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Delete a conversation
    @DeleteMapping("/{conversationId}")
    public ResponseEntity<?> deleteConversation(@PathVariable Long conversationId) {
        try {
            boolean deleted = conversationService.deleteConversation(conversationId);
            
            if (deleted) {
                return ResponseEntity.ok("Conversation deleted successfully");
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conversation not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get side chats for a conversation
    @GetMapping("/{conversationId}/sidechats")
    public ResponseEntity<?> getSideChats(@PathVariable Long conversationId) {
        try {
            List<SideChat> sideChats = conversationService.getConversationSideChats(conversationId);
            
            List<Map<String, Object>> sideChatDTOs = sideChats.stream().map(sc -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", sc.getSideChatId());
                dto.put("title", sc.getTitle());
                dto.put("createdAt", sc.getCreatedAt());
                dto.put("createdBy", sc.getCreatedBy().getUsername());
                dto.put("messageCount", conversationService.getSideChatMessageCount(sc.getSideChatId()));
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(sideChatDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Create a side chat
    @PostMapping("/{conversationId}/sidechats")
    public ResponseEntity<?> createSideChat(@PathVariable Long conversationId, @RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            Long createdById = Long.valueOf(payload.get("createdBy").toString());
            
            Optional<User> userOpt = userService.findById(createdById);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            SideChat sideChat = conversationService.createSideChat(conversationId, title, userOpt.get());
            
            if (sideChat != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", sideChat.getSideChatId());
                response.put("title", sideChat.getTitle());
                response.put("createdAt", sideChat.getCreatedAt());
                response.put("messageCount", 0);
                
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conversation not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Delete a side chat
    @DeleteMapping("/sidechats/{sideChatId}")
    public ResponseEntity<?> deleteSideChat(@PathVariable Long sideChatId) {
        try {
            boolean deleted = conversationService.deleteSideChat(sideChatId);
            
            if (deleted) {
                return ResponseEntity.ok("Side chat deleted successfully");
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Side chat not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get messages in a side chat
    @GetMapping("/sidechats/{sideChatId}/messages")
    public ResponseEntity<?> getSideChatMessages(@PathVariable Long sideChatId) {
        try {
            List<Message> messages = conversationService.getSideChatMessages(sideChatId);
            
            List<Map<String, Object>> messageDTOs = messages.stream().map(msg -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", msg.getMessageId());
                dto.put("senderId", msg.getSender().getId());
                dto.put("sender", msg.getSender().getUsername());
                dto.put("content", msg.getContent());
                dto.put("timestamp", msg.getTimestamp());
                dto.put("avatar", msg.getSender().getUsername().substring(0, 1).toUpperCase());
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(messageDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Send message to side chat
    @PostMapping("/sidechats/{sideChatId}/messages")
    public ResponseEntity<?> sendMessageToSideChat(@PathVariable Long sideChatId, @RequestBody Map<String, Object> payload) {
        try {
            Long senderId = Long.valueOf(payload.get("senderId").toString());
            String content = (String) payload.get("content");
            
            Optional<User> senderOpt = userService.findById(senderId);
            if (!senderOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            Message message = conversationService.sendMessageToSideChat(sideChatId, senderOpt.get(), content);
            
            if (message != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", message.getMessageId());
                response.put("senderId", message.getSender().getId());
                response.put("sender", message.getSender().getUsername());
                response.put("content", message.getContent());
                response.put("timestamp", message.getTimestamp());
                response.put("avatar", message.getSender().getUsername().substring(0, 1).toUpperCase());
                
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Side chat not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}

package com.core.echolearn.controller;

import com.core.echolearn.entity.Chat;
import com.core.echolearn.entity.User;
import com.core.echolearn.service.ChatService;
import com.core.echolearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/channel/{channelName}")
    public ResponseEntity<?> getChannelMessages(@PathVariable String channelName) {
        try {
            List<Chat> messages = chatService.getChannelMessages(channelName);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{chatId}/sidechats")
    public ResponseEntity<?> getSideChats(@PathVariable Long chatId) {
        try {
            List<Chat> sideChats = chatService.getSideChats(chatId);
            Long count = chatService.getSideChatCount(chatId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sideChats", sideChats);
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload) {
        try {
            String content = (String) payload.get("content");
            Long userId = Long.valueOf(payload.get("userId").toString());
            String channelName = payload.getOrDefault("channelName", "general").toString();
            Long parentChatId = payload.get("parentChatId") != null ? 
                Long.valueOf(payload.get("parentChatId").toString()) : null;
            
            Optional<User> userOpt = userService.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
            
            Chat chat = new Chat(content, userOpt.get());
            chat.setChannelName(channelName);
            
            if (parentChatId != null) {
                Optional<Chat> parentChat = chatService.findById(parentChatId);
                if (parentChat.isPresent()) {
                    chat.setParentChat(parentChat.get());
                }
            }
            
            Chat savedChat = chatService.sendMessage(chat);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedChat);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{chatId}")
    public ResponseEntity<?> editMessage(@PathVariable Long chatId, @RequestBody Map<String, String> payload) {
        try {
            String newContent = payload.get("content");
            Chat updatedChat = chatService.editMessage(chatId, newContent);
            
            if (updatedChat != null) {
                return ResponseEntity.ok(updatedChat);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Chat not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long chatId) {
        try {
            boolean deleted = chatService.deleteMessage(chatId);
            if (deleted) {
                return ResponseEntity.ok("Message deleted successfully");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Chat not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}

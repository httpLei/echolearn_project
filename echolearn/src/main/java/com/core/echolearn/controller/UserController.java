package com.core.echolearn.controller;

import com.core.echolearn.entity.User;
import com.core.echolearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Search users by query (username or email)
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query, @RequestParam Long currentUserId) {
        try {
            List<User> allUsers = userService.getAllUsers();
            
            // Filter users by query and exclude current user
            List<Map<String, Object>> userDTOs = allUsers.stream()
                .filter(u -> !u.getId().equals(currentUserId)) // Exclude current user
                .filter(u -> 
                    u.getUsername().toLowerCase().contains(query.toLowerCase()) ||
                    u.getEmail().toLowerCase().contains(query.toLowerCase())
                )
                .map(u -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", u.getId());
                    dto.put("username", u.getUsername());
                    dto.put("email", u.getEmail());
                    dto.put("role", u.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get all users except current user
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(@RequestParam Long currentUserId) {
        try {
            List<User> allUsers = userService.getAllUsers();
            
            // Exclude current user and map to DTO
            List<Map<String, Object>> userDTOs = allUsers.stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", u.getId());
                    dto.put("username", u.getUsername());
                    dto.put("email", u.getEmail());
                    dto.put("role", u.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}

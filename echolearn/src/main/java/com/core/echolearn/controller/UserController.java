package com.core.echolearn.controller;

import com.core.echolearn.dto.UserDTO;
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
    
    // Get current user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCurrentUser(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getRole(),
                    user.getCreatedAt()
                );
                return ResponseEntity.ok(userDTO);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
        }
    }
    
    // Update user information
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> updateData) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            
            if (!userOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error);
            }
            
            User user = userOpt.get();
            
            // Update username if provided
            if (updateData.containsKey("username")) {
                String newUsername = (String) updateData.get("username");
                if (newUsername != null && !newUsername.trim().isEmpty()) {
                    // Check if username is already taken by another user
                    Optional<User> existingUser = userService.findByUsername(newUsername.trim());
                    if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "Username already taken");
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(error);
                    }
                    user.setUsername(newUsername.trim());
                }
            }
            
            // Update email if provided
            if (updateData.containsKey("email")) {
                String newEmail = (String) updateData.get("email");
                if (newEmail != null && !newEmail.trim().isEmpty()) {
                    // Check if email is already taken by another user
                    Optional<User> existingUser = userService.findByEmail(newEmail.trim());
                    if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "Email already taken");
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(error);
                    }
                    user.setEmail(newEmail.trim());
                }
            }
            
            // Update password if provided
            if (updateData.containsKey("password")) {
                String newPassword = (String) updateData.get("password");
                if (newPassword != null && !newPassword.trim().isEmpty()) {
                    // In a real application, we would hash the password here
                    user.setPassword(newPassword);
                }
            }
            
            User updatedUser = userService.updateUser(user);
            
            // Return updated user DTO
            UserDTO userDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getUsername(),
                updatedUser.getRole(),
                updatedUser.getCreatedAt()
            );
            
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
        }
    }
}

package com.echolearn.controller;

import com.echolearn.model.User;
import com.echolearn.model.UserRole;
import com.echolearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    // Register endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String fullName = request.get("fullName");
            String roleStr = request.get("role");
            
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            
            User user = userService.registerUser(email, password, fullName, role);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            User user = userService.loginUser(email, password);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Helper method to create user response without password
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("email", user.getEmail());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("role", user.getRole().toString().toLowerCase());
        return userResponse;
    }
}

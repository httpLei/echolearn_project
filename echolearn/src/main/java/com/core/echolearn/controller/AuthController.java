package com.core.echolearn.controller;

import com.core.echolearn.dto.*;
import com.core.echolearn.entity.User;
import com.core.echolearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        try {
            // Validate request
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email is required", null));
            }
            
            if (request.getUsername() == null || request.getUsername().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Username is required", null));
            }
            
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Password is required", null));
            }
            
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Passwords do not match", null));
            }
            
            // Check if email already exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email already exists", null));
            }
            
            // Check if username already exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Username already exists", null));
            }
            
            // Create user
            User user = new User(
                request.getEmail(),
                request.getUsername(),
                request.getPassword(), // In production, hash the password
                request.getRole() != null ? request.getRole().toUpperCase() : "STUDENT"
            );
            
            User savedUser = userService.createUser(user);
            
            UserDTO userDTO = new UserDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                savedUser.getRole(),
                savedUser.getCreatedAt()
            );
            
            return ResponseEntity.ok(
                new AuthResponse(true, "User registered successfully", userDTO)
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(false, "An error occurred: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // Validate request
            if (request.getEmailOrUsername() == null || request.getEmailOrUsername().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email or username is required", null));
            }
            
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Password is required", null));
            }
            
            // Authenticate user
            User user = userService.authenticate(request.getEmailOrUsername(), request.getPassword());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, "Invalid credentials", null));
            }
            
            UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt()
            );
            
            return ResponseEntity.ok(
                new AuthResponse(true, "Login successful", userDTO)
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(false, "An error occurred: " + e.getMessage(), null));
        }
    }
}

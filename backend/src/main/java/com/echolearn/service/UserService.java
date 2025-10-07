package com.echolearn.service;

import com.echolearn.model.User;
import com.echolearn.model.UserRole;
import com.echolearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Register a new user
    public User registerUser(String email, String password, String fullName, UserRole role) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user with encrypted password
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role);
        
        return userRepository.save(user);
    }
    
    // Login user
    public User loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        return user;
    }
    
    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    // Get all users by role
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    // Update user
    public User updateUser(Long id, String fullName) {
        User user = getUserById(id);
        user.setFullName(fullName);
        return userRepository.save(user);
    }
    
    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

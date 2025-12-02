package com.core.echolearn.config;

import com.core.echolearn.entity.*;
import com.core.echolearn.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private SideChatRepository sideChatRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if sample users already exist, if not create them
        User student1 = userRepository.findByEmail("jake.sim@example.com")
            .orElseGet(() -> {
                User newUser = new User("jake.sim@example.com", "jakesim", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User teacher1 = userRepository.findByEmail("joemarieamparo@example.com")
            .orElseGet(() -> {
                User newUser = new User("joemarieamparo@example.com", "joemarieamparo", "password123", "TEACHER");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        // Create additional students for chat
        User student2 = userRepository.findByEmail("pranz.rabe@example.com")
            .orElseGet(() -> {
                User newUser = new User("pranz.rabe@example.com", "pranzrabe", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User student3 = userRepository.findByEmail("richemmae.bigno@example.com")
            .orElseGet(() -> {
                User newUser = new User("richemmae.bigno@example.com", "richemmaebigno", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User student4 = userRepository.findByEmail("maxine.ocampo@example.com")
            .orElseGet(() -> {
                User newUser = new User("maxine.ocampo@example.com", "maxineocampo", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User student5 = userRepository.findByEmail("lerah.caones@example.com")
            .orElseGet(() -> {
                User newUser = new User("lerah.caones@example.com", "lerahcaones", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User student6 = userRepository.findByEmail("erica.dabalos@example.com")
            .orElseGet(() -> {
                User newUser = new User("erica.dabalos@example.com", "ericadabalos", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        User student7 = userRepository.findByEmail("clyde.benolirao@example.com")
            .orElseGet(() -> {
                User newUser = new User("clyde.benolirao@example.com", "clydebenolirao", "password123", "STUDENT");
                newUser.setIsVerified(true);
                return userRepository.save(newUser);
            });
        
        // Create sample subjects if they don't exist
        Subject subject1 = subjectRepository.findBySubjectCode("IT365")
            .orElseGet(() -> {
                Subject newSubject = new Subject(
                    "Data Analytics",
                    "IT365",
                    "Introduction to data analytics and visualization",
                    LocalDateTime.of(2025, 11, 28, 10, 0),
                    40,
                    teacher1
                );
                return subjectRepository.save(newSubject);
            });
        
        Subject subject2 = subjectRepository.findBySubjectCode("CSIT327")
            .orElseGet(() -> {
                Subject newSubject = new Subject(
                    "Information Management",
                    "CSIT327",
                    "Database design and management",
                    LocalDateTime.of(2025, 11, 28, 13, 0),
                    35,
                    teacher1
                );
                return subjectRepository.save(newSubject);
            });
        
        Subject subject3 = subjectRepository.findBySubjectCode("ES038")
            .orElseGet(() -> {
                Subject newSubject = new Subject(
                    "Entrepreneurship",
                    "ES038",
                    "Fundamentals of business and entrepreneurship",
                    LocalDateTime.of(2025, 11, 29, 15, 0),
                    30,
                    teacher1
                );
                return subjectRepository.save(newSubject);
            });
        
        
        System.out.println("Sample data initialized:");
        System.out.println("- Student Login - Email: lerah.caones@example.com | Password: password123");
        System.out.println("- Teacher Login - Email: joemarieamparo@example.com | Password: password123");
    }
}

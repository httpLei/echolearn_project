package com.core.echolearn.config;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.Notification;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.AssignmentRepository;
import com.core.echolearn.repository.NotificationRepository;
import com.core.echolearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        User student1 = new User("jake.sim@example.com", "jakesim", "password123", "STUDENT");
        student1.setIsVerified(true);
        student1 = userRepository.save(student1);
        
        User teacher1 = new User("prof.ampora@example.com", "profampora", "password123", "TEACHER");
        teacher1.setIsVerified(true);
        teacher1 = userRepository.save(teacher1);
        
        // Create sample assignments for student1
        Assignment assignment1 = new Assignment(
            "Data Visualization",
            "Create the pivot tables (label your tables' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)",
            LocalDate.of(2025, 11, 5),
            "IT365",
            120,
            "EASY"
        );
        assignment1.setUser(student1);
        assignmentRepository.save(assignment1);
        
        Assignment assignment2 = new Assignment(
            "Database Design Project",
            "Design and implement a normalized database schema for the given case study",
            LocalDate.of(2025, 11, 8),
            "CSIT327",
            180,
            "MEDIUM"
        );
        assignment2.setUser(student1);
        assignmentRepository.save(assignment2);
        
        Assignment assignment3 = new Assignment(
            "Business Plan Presentation",
            "Prepare a comprehensive business plan for your startup idea",
            LocalDate.of(2025, 11, 12),
            "ES038",
            240,
            "HARD"
        );
        assignment3.setUser(student1);
        assignmentRepository.save(assignment3);
        
        Assignment assignment4 = new Assignment(
            "Linear Regression Activity",
            "Apply linear regression techniques to analyze and predict data patterns using Python",
            LocalDate.of(2025, 11, 15),
            "IT365",
            150,
            "MEDIUM"
        );
        assignment4.setUser(student1);
        assignmentRepository.save(assignment4);
        
        // Create sample notifications for student1
        Notification notification1 = new Notification(
            "Assignment Due Soon",
            "Create the pivot tables (label your tables' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)",
            "ASSIGNMENT"
        );
        notification1.setUser(student1);
        notificationRepository.save(notification1);
        
        Notification notification2 = new Notification(
            "New Message",
            "Prof. Ampora replied to your question about the Django",
            "MESSAGE"
        );
        notification2.setUser(student1);
        notificationRepository.save(notification2);
        
        Notification notification3 = new Notification(
            "Class Reminder",
            "Your CSIT321 class starts in 30 minutes",
            "REMINDER"
        );
        notification3.setUser(student1);
        notification3.setIsRead(true);
        notificationRepository.save(notification3);
        
        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("📧 Student Login - Email: jake.sim@example.com | Password: password123");
        System.out.println("📧 Teacher Login - Email: prof.ampora@example.com | Password: password123");
    }
}

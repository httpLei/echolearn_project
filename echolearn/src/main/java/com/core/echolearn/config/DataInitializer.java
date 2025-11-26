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
        
        // Only create sample assignments if they don't already exist
        long assignmentCount = assignmentRepository.count();
        if (assignmentCount == 0) {
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
        }
        
        // Only create sample notifications if they don't already exist
        long notificationCount = notificationRepository.count();
        if (notificationCount == 0) {
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
        }
        
        // Create sample conversations and messages
        long conversationCount = conversationRepository.count();
        if (conversationCount == 0) {
            // Conversation 1: student1 with student2 (Pranz Rabe)
            Conversation conv1 = new Conversation(student1, student2);
            conv1.setLastMessageAt(LocalDateTime.now().minusHours(2));
            conversationRepository.save(conv1);
            
            Message msg1 = new Message(conv1, student2, "On the way, ma late lang ko");
            msg1.setTimestamp(LocalDateTime.now().minusHours(2));
            messageRepository.save(msg1);
            
            Message msg2 = new Message(conv1, student1, "Sige, no problem!");
            msg2.setTimestamp(LocalDateTime.now().minusHours(1).minusMinutes(58));
            messageRepository.save(msg2);
            
            // Conversation 2: student1 with student3 (Richemmae Bigno)
            Conversation conv2 = new Conversation(student1, student3);
            conv2.setLastMessageAt(LocalDateTime.now().minusHours(1).minusMinutes(30));
            conversationRepository.save(conv2);
            
            Message msg3 = new Message(conv2, student3, "Guys unsa inyo gicostume sa rizal");
            msg3.setTimestamp(LocalDateTime.now().minusHours(1).minusMinutes(30));
            messageRepository.save(msg3);
            
            Message msg4 = new Message(conv2, student1, "Wala pa ko naka decide haha");
            msg4.setTimestamp(LocalDateTime.now().minusHours(1).minusMinutes(29));
            messageRepository.save(msg4);
            
            // Conversation 3: student1 with student4 (Maxine Ocampo)
            Conversation conv3 = new Conversation(student1, student4);
            conv3.setLastMessageAt(LocalDateTime.now().minusHours(3));
            conversationRepository.save(conv3);
            
            Message msg5 = new Message(conv3, student4, "Wait, mag meeting ta later?");
            msg5.setTimestamp(LocalDateTime.now().minusHours(3));
            messageRepository.save(msg5);
            
            Message msg6 = new Message(conv3, student1, "Yes, 3pm sa library");
            msg6.setTimestamp(LocalDateTime.now().minusHours(2).minusMinutes(55));
            messageRepository.save(msg6);
            
            // Conversation 4: student1 with student5 (Lerah Caones)
            Conversation conv4 = new Conversation(student1, student5);
            conv4.setLastMessageAt(LocalDateTime.now().minusHours(5));
            conversationRepository.save(conv4);
            
            Message msg7 = new Message(conv4, student5, "Sige, noted! Thanks!");
            msg7.setTimestamp(LocalDateTime.now().minusHours(5));
            messageRepository.save(msg7);
            
            // Conversation 5: student1 with student6 (Erica Dabalos)
            Conversation conv5 = new Conversation(student1, student6);
            conv5.setLastMessageAt(LocalDateTime.now().minusDays(1));
            conversationRepository.save(conv5);
            
            Message msg8 = new Message(conv5, student6, "Ilaag nalang nato na");
            msg8.setTimestamp(LocalDateTime.now().minusDays(1));
            messageRepository.save(msg8);
            
            // Conversation 6: student1 with student7 (Clyde Benolirao)
            Conversation conv6 = new Conversation(student1, student7);
            conv6.setLastMessageAt(LocalDateTime.now().minusDays(1).minusHours(2));
            conversationRepository.save(conv6);
            
            Message msg9 = new Message(conv6, student7, "Na human mo sa activity ni sir?");
            msg9.setTimestamp(LocalDateTime.now().minusDays(1).minusHours(2));
            messageRepository.save(msg9);
            
            Message msg10 = new Message(conv6, student1, "Oo, kay nag kopyag ko sa iya haha");
            msg10.setTimestamp(LocalDateTime.now().minusDays(1).minusHours(1).minusMinutes(55));
            messageRepository.save(msg10);
            
            // Conversation 7: student1 with teacher1
            Conversation conv7 = new Conversation(student1, teacher1);
            conv7.setLastMessageAt(LocalDateTime.now().minusHours(6));
            conversationRepository.save(conv7);
            
            Message msg11 = new Message(conv7, student1, "Good afternoon sir! Question lang about sa Django assignment");
            msg11.setTimestamp(LocalDateTime.now().minusHours(6));
            messageRepository.save(msg11);
            
            Message msg12 = new Message(conv7, teacher1, "Yes? What's your question?");
            msg12.setTimestamp(LocalDateTime.now().minusHours(5).minusMinutes(55));
            messageRepository.save(msg12);
            
            // Create a side chat for conversation 1
            SideChat sideChat1 = new SideChat(conv1, "Question: Assignment 5", student1);
            sideChatRepository.save(sideChat1);
            
            Message sideChatMsg1 = new Message(conv1, student1, "Unsa ang part 3 sa assignment?");
            sideChatMsg1.setSideChat(sideChat1);
            sideChatMsg1.setTimestamp(LocalDateTime.now().minusHours(1));
            messageRepository.save(sideChatMsg1);
            
            Message sideChatMsg2 = new Message(conv1, student2, "Ang pivot tables daw");
            sideChatMsg2.setSideChat(sideChat1);
            sideChatMsg2.setTimestamp(LocalDateTime.now().minusMinutes(55));
            messageRepository.save(sideChatMsg2);
            
            SideChat sideChat2 = new SideChat(conv1, "Meeting Time Discussion", student2);
            sideChatRepository.save(sideChat2);
        }
        
        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("📧 Student Login - Email: jake.sim@example.com | Password: password123");
        System.out.println("📧 Teacher Login - Email: joemarieamparo@example.com | Password: password123");
        System.out.println("💬 Chat Users: pranzrabe, richemmaebigno, maxineocampo, lerahcaones, ericadabalos, clydebenolirao");
    }
}

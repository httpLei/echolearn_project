package com.core.echolearn.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.core.echolearn.dto.CalendarEventDTO;
import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.repository.AssignmentRepository;
import com.core.echolearn.repository.AssignmentSubmissionRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    
    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }
    
    public Optional<Assignment> findById(Long id) {
        return assignmentRepository.findById(id);
    }
    
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
    
    public List<Assignment> getAssignmentsByUser(User user) {
        // For students: get all assignments from enrolled subjects (including teacher-created)
        // For teachers: get assignments from subjects they teach
        if ("STUDENT".equals(user.getRole())) {
            return assignmentRepository.findAllForStudent(user);
        } else {
            return assignmentRepository.findAllForTeacher(user.getId());
        }
    }
    
    public List<Assignment> getAssignmentsBySubject(Subject subject) {
        return assignmentRepository.findBySubjectOrderByDueDateAsc(subject);
    }
    
    public List<Assignment> getAssignmentsBySubjectAndUser(Subject subject, User user) {
        // For students: get assignments where user is null (teacher-created) OR user is the student
        return assignmentRepository.findBySubjectForStudent(subject, user);
    }
    
    public List<Assignment> getCompletedAssignments(User user, Boolean completed) {
        return assignmentRepository.findByUserAndCompleted(user, completed);
    }
    
    public List<Assignment> getAssignmentsByUserAndSubject(User user, Subject subject) {
        return assignmentRepository.findByUserAndSubject(user, subject);
    }
    
    public List<Assignment> getAssignmentsByDifficulty(User user, String difficulty) {
        return assignmentRepository.findByUserAndDifficulty(user, difficulty);
    }
    
    public List<Assignment> getAssignmentsByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return assignmentRepository.findByUserAndDueDateBetween(user, startDate, endDate);
    }
    
    public Assignment markAsCompleted(Long id) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            Assignment assignment = assignmentOpt.get();
            assignment.setCompleted(true);
            return assignmentRepository.save(assignment);
        }
        return null;
    }
    
    public Assignment updateAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }
    
    @Transactional
    public void deleteAssignment(Long id) {
        // First, delete all submissions for this assignment
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            submissionRepository.deleteByAssignment(assignmentOpt.get());
        }
        // Then delete the assignment
        assignmentRepository.deleteById(id);
    }

    public List<CalendarEventDTO> getCalendarEventsForUser(User user) {
        List<Assignment> assignments = assignmentRepository.findByUserOrderByDueDateAsc(user);

        // Map Assignments to CalendarEventDTOs
        List<CalendarEventDTO> assignmentEvents = assignments.stream()
            .filter(a -> a.getDueDate() != null) // Only include assignments with a due date
            .map(a -> new CalendarEventDTO(
                a.getActivityId(),
                a.getTitle() + " (Due)",
                a.getDueDate().atStartOfDay(), // Convert LocalDate to start of day LocalDateTime
                a.getDueDate().atStartOfDay().plusHours(2), // Give it a 2-hour span for visualization
                "ASSIGNMENT",
                a.getCompleted()
            ))
            .collect(Collectors.toList());

        // Note: You would typically integrate Notification events here as well.
        // For simplicity, we are only including Assignments for now.

        return assignmentEvents;
    }
}

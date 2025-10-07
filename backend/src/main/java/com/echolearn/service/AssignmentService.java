package com.echolearn.service;

import com.echolearn.model.Assignment;
import com.echolearn.model.Difficulty;
import com.echolearn.model.User;
import com.echolearn.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private UserService userService;
    
    // Create a new assignment
    public Assignment createAssignment(Long studentId, String title, String description, 
                                      String subject, LocalDateTime dueDate, 
                                      Integer estimatedMinutes, Difficulty difficulty) {
        User student = userService.getUserById(studentId);
        
        Assignment assignment = new Assignment();
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setSubject(subject);
        assignment.setDueDate(dueDate);
        assignment.setEstimatedMinutes(estimatedMinutes);
        assignment.setDifficulty(difficulty);
        assignment.setStudent(student);
        
        // Calculate priority score
        int priorityScore = calculatePriorityScore(dueDate, estimatedMinutes, difficulty);
        assignment.setPriorityScore(priorityScore);
        
        return assignmentRepository.save(assignment);
    }
    
    // Calculate priority score based on urgency, difficulty, and time
    private int calculatePriorityScore(LocalDateTime dueDate, Integer estimatedMinutes, Difficulty difficulty) {
        // Calculate urgency (0-100)
        long hoursUntilDue = ChronoUnit.HOURS.between(LocalDateTime.now(), dueDate);
        int urgency = Math.max(0, Math.min(100, (int)(100 - (hoursUntilDue / 24.0 * 10))));
        
        // Difficulty score (0-100)
        int difficultyScore = switch (difficulty) {
            case EASY -> 30;
            case MEDIUM -> 60;
            case HARD -> 90;
        };
        
        // Time required score (0-100)
        int timeScore = Math.min(100, estimatedMinutes / 3);
        
        // Calculate weighted average
        return (urgency * 40 + difficultyScore * 30 + timeScore * 30) / 100;
    }
    
    // Get all assignments for a student
    public List<Assignment> getAssignmentsByStudent(Long studentId) {
        User student = userService.getUserById(studentId);
        return assignmentRepository.findByStudent(student);
    }
    
    // Get assignments by subject
    public List<Assignment> getAssignmentsBySubject(Long studentId, String subject) {
        User student = userService.getUserById(studentId);
        return assignmentRepository.findByStudentAndSubject(student, subject);
    }
    
    // Get overdue assignments
    public List<Assignment> getOverdueAssignments(Long studentId) {
        User student = userService.getUserById(studentId);
        return assignmentRepository.findByStudentAndDueDateBefore(student, LocalDateTime.now());
    }
    
    // Get assignments due today
    public List<Assignment> getAssignmentsDueToday(Long studentId) {
        User student = userService.getUserById(studentId);
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return assignmentRepository.findByStudentAndDueDateBetween(student, startOfDay, endOfDay);
    }
    
    // Get assignments due this week
    public List<Assignment> getAssignmentsDueThisWeek(Long studentId) {
        User student = userService.getUserById(studentId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endOfWeek = now.plusDays(7);
        return assignmentRepository.findByStudentAndDueDateBetween(student, now, endOfWeek);
    }
    
    // Mark assignment as complete
    public Assignment markAsComplete(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setCompleted(true);
        return assignmentRepository.save(assignment);
    }
    
    // Update assignment
    public Assignment updateAssignment(Long id, String title, String description, 
                                      LocalDateTime dueDate, Integer estimatedMinutes, 
                                      Difficulty difficulty) {
        Assignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setDueDate(dueDate);
        assignment.setEstimatedMinutes(estimatedMinutes);
        assignment.setDifficulty(difficulty);
        
        // Recalculate priority score
        int priorityScore = calculatePriorityScore(dueDate, estimatedMinutes, difficulty);
        assignment.setPriorityScore(priorityScore);
        
        return assignmentRepository.save(assignment);
    }
    
    // Delete assignment
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}

package com.core.echolearn.service;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
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
        return assignmentRepository.findByUserOrderByDueDateAsc(user);
    }
    
    public List<Assignment> getCompletedAssignments(User user, Boolean completed) {
        return assignmentRepository.findByUserAndCompleted(user, completed);
    }
    
    public List<Assignment> getAssignmentsBySubject(User user, String subject) {
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
    
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}

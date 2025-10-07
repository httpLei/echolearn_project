package com.echolearn.repository;

import com.echolearn.model.Assignment;
import com.echolearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    // Find all assignments for a student
    List<Assignment> findByStudent(User student);
    
    // Find assignments by subject
    List<Assignment> findByStudentAndSubject(User student, String subject);
    
    // Find completed assignments
    List<Assignment> findByStudentAndCompleted(User student, Boolean completed);
    
    // Find assignments due before a certain date
    List<Assignment> findByStudentAndDueDateBefore(User student, LocalDateTime date);
    
    // Find assignments due between dates
    List<Assignment> findByStudentAndDueDateBetween(User student, LocalDateTime start, LocalDateTime end);
    
    // Find assignments ordered by priority
    List<Assignment> findByStudentOrderByPriorityScoreDesc(User student);
}

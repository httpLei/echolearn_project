package com.core.echolearn.repository;

import com.core.echolearn.entity.AssignmentSubmission;
import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    
    // Find submission by assignment and student
    Optional<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, User student);
    
    // Find all submissions for an assignment
    List<AssignmentSubmission> findByAssignment(Assignment assignment);
    
    // Find all submissions by a student
    List<AssignmentSubmission> findByStudent(User student);
    
    // Check if student has submitted assignment
    boolean existsByAssignmentAndStudent(Assignment assignment, User student);
    
    // Delete all submissions for an assignment
    void deleteByAssignment(Assignment assignment);
}

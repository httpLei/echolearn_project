package com.core.echolearn.service;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.AssignmentSubmission;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.AssignmentSubmissionRepository;
import com.core.echolearn.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentSubmissionService {
    
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    // Submit an assignment
    @Transactional
    public AssignmentSubmission submitAssignment(Assignment assignment, User student, 
                                                String submissionText, String fileNames) {
        // Check if already submitted
        Optional<AssignmentSubmission> existing = submissionRepository.findByAssignmentAndStudent(assignment, student);
        if (existing.isPresent()) {
            throw new IllegalStateException("Assignment already submitted. Please unsubmit first to edit.");
        }
        
        // Create new submission
        AssignmentSubmission submission = new AssignmentSubmission(assignment, student, submissionText, fileNames);
        AssignmentSubmission saved = submissionRepository.save(submission);
        
        // Mark assignment as completed
        assignment.setCompleted(true);
        assignmentRepository.save(assignment);
        
        return saved;
    }
    
    // Unsubmit an assignment
    @Transactional
    public void unsubmitAssignment(Assignment assignment, User student) {
        Optional<AssignmentSubmission> submission = submissionRepository.findByAssignmentAndStudent(assignment, student);
        if (submission.isPresent()) {
            submissionRepository.delete(submission.get());
            
            // Mark assignment as not completed
            assignment.setCompleted(false);
            assignmentRepository.save(assignment);
        } else {
            throw new IllegalStateException("No submission found to unsubmit");
        }
    }
    
    // Get submission for an assignment by a student
    public Optional<AssignmentSubmission> getSubmission(Assignment assignment, User student) {
        return submissionRepository.findByAssignmentAndStudent(assignment, student);
    }
    
    // Get all submissions for an assignment
    public List<AssignmentSubmission> getSubmissionsByAssignment(Assignment assignment) {
        return submissionRepository.findByAssignment(assignment);
    }
    
    // Get all submissions by a student
    public List<AssignmentSubmission> getSubmissionsByStudent(User student) {
        return submissionRepository.findByStudent(student);
    }
    
    // Check if student has submitted
    public boolean hasSubmitted(Assignment assignment, User student) {
        return submissionRepository.existsByAssignmentAndStudent(assignment, student);
    }
    
    // Update submission (for editing before final submission)
    @Transactional
    public AssignmentSubmission updateSubmission(Long submissionId, String submissionText, String fileNames) {
        Optional<AssignmentSubmission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isPresent()) {
            AssignmentSubmission submission = submissionOpt.get();
            submission.setSubmissionText(submissionText);
            submission.setFileNames(fileNames);
            return submissionRepository.save(submission);
        }
        throw new IllegalArgumentException("Submission not found");
    }
}

package com.core.echolearn.controller;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.AssignmentSubmission;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.service.AssignmentService;
import com.core.echolearn.service.AssignmentSubmissionService;
import com.core.echolearn.service.UserService;
import com.core.echolearn.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private AssignmentSubmissionService submissionService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SubjectService subjectService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAssignmentsByUser(@PathVariable Long userId) { //get all the assignements of a user
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
            
            List<Assignment> assignments = assignmentService.getAssignmentsByUser(userOpt.get());
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignment(@PathVariable Long id) {
        try {
            Optional<Assignment> assignment = assignmentService.findById(id);
            if (assignment.isPresent()) {
                return ResponseEntity.ok(assignment.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Assignment not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment) {
        try {
            Assignment savedAssignment = assignmentService.createAssignment(assignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAssignment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markAsCompleted(@PathVariable Long id) {
        try {
            Assignment assignment = assignmentService.markAsCompleted(id);
            if (assignment != null) {
                return ResponseEntity.ok(assignment);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Assignment not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody Assignment assignment) {
        try {
            assignment.setActivityId(id);
            Assignment updatedAssignment = assignmentService.updateAssignment(assignment);
            return ResponseEntity.ok(updatedAssignment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentService.deleteAssignment(id);
            return ResponseEntity.ok("Assignment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get assignments by subject
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getAssignmentsBySubject(@PathVariable Long subjectId) {
        try {
            Optional<Subject> subjectOpt = subjectService.getSubjectEntityById(subjectId);
            if (!subjectOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Subject not found");
            }
            
            List<Assignment> assignments = assignmentService.getAssignmentsBySubject(subjectOpt.get());
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get assignments by subject and user (for students to see their assignments in a class)
    @GetMapping("/subject/{subjectId}/user/{userId}")
    public ResponseEntity<?> getAssignmentsBySubjectAndUser(@PathVariable Long subjectId, @PathVariable Long userId) {
        try {
            Optional<Subject> subjectOpt = subjectService.getSubjectEntityById(subjectId);
            Optional<User> userOpt = userService.findById(userId);
            
            if (!subjectOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Subject not found");
            }
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
            
            List<Assignment> assignments = assignmentService.getAssignmentsBySubjectAndUser(subjectOpt.get(), userOpt.get());
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Submit an assignment
    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<?> submitAssignment(@PathVariable Long assignmentId, @RequestBody Map<String, Object> payload) {
        try {
            Long studentId = Long.valueOf(payload.get("studentId").toString());
            String submissionText = (String) payload.get("submissionText");
            String fileNames = (String) payload.get("fileNames");
            
            Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
            Optional<User> studentOpt = userService.findById(studentId);
            
            if (!assignmentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
            }
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
            }
            
            AssignmentSubmission submission = submissionService.submitAssignment(
                assignmentOpt.get(), 
                studentOpt.get(), 
                submissionText, 
                fileNames
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(submission);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Unsubmit an assignment
    @DeleteMapping("/{assignmentId}/unsubmit")
    public ResponseEntity<?> unsubmitAssignment(@PathVariable Long assignmentId, @RequestParam Long studentId) {
        try {
            Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
            Optional<User> studentOpt = userService.findById(studentId);
            
            if (!assignmentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
            }
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
            }
            
            submissionService.unsubmitAssignment(assignmentOpt.get(), studentOpt.get());
            
            return ResponseEntity.ok("Assignment unsubmitted successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get submission for an assignment
    @GetMapping("/{assignmentId}/submission")
    public ResponseEntity<?> getSubmission(@PathVariable Long assignmentId, @RequestParam Long studentId) {
        try {
            Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
            Optional<User> studentOpt = userService.findById(studentId);
            
            if (!assignmentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
            }
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
            }
            
            Optional<AssignmentSubmission> submission = submissionService.getSubmission(
                assignmentOpt.get(), 
                studentOpt.get()
            );
            
            if (submission.isPresent()) {
                return ResponseEntity.ok(submission.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No submission found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    // Get all submissions for an assignment (for teachers)
    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<?> getAllSubmissions(@PathVariable Long assignmentId) {
        try {
            Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
            
            if (!assignmentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
            }
            
            List<AssignmentSubmission> submissions = submissionService.getSubmissionsByAssignment(assignmentOpt.get());
            
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}

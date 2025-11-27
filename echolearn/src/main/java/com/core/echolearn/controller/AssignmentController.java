package com.core.echolearn.controller;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.service.AssignmentService;
import com.core.echolearn.service.UserService;
import com.core.echolearn.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
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
}

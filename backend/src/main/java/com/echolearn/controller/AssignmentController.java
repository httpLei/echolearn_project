package com.echolearn.controller;

import com.echolearn.model.Assignment;
import com.echolearn.model.Difficulty;
import com.echolearn.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    // Get all assignments for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByStudent(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByStudent(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    // Get assignments by subject
    @GetMapping("/student/{studentId}/subject/{subject}")
    public ResponseEntity<List<Assignment>> getAssignmentsBySubject(
            @PathVariable Long studentId, 
            @PathVariable String subject) {
        List<Assignment> assignments = assignmentService.getAssignmentsBySubject(studentId, subject);
        return ResponseEntity.ok(assignments);
    }
    
    // Get overdue assignments
    @GetMapping("/student/{studentId}/overdue")
    public ResponseEntity<List<Assignment>> getOverdueAssignments(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getOverdueAssignments(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    // Get assignments due today
    @GetMapping("/student/{studentId}/due-today")
    public ResponseEntity<List<Assignment>> getAssignmentsDueToday(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getAssignmentsDueToday(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    // Get assignments due this week
    @GetMapping("/student/{studentId}/due-this-week")
    public ResponseEntity<List<Assignment>> getAssignmentsDueThisWeek(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getAssignmentsDueThisWeek(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    // Create new assignment
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Map<String, Object> request) {
        Long studentId = Long.valueOf(request.get("studentId").toString());
        String title = request.get("title").toString();
        String description = request.get("description").toString();
        String subject = request.get("subject").toString();
        LocalDateTime dueDate = LocalDateTime.parse(request.get("dueDate").toString());
        Integer estimatedMinutes = Integer.valueOf(request.get("estimatedMinutes").toString());
        Difficulty difficulty = Difficulty.valueOf(request.get("difficulty").toString().toUpperCase());
        
        Assignment assignment = assignmentService.createAssignment(
            studentId, title, description, subject, dueDate, estimatedMinutes, difficulty
        );
        
        return ResponseEntity.ok(assignment);
    }
    
    // Mark assignment as complete
    @PutMapping("/{id}/complete")
    public ResponseEntity<Assignment> markAsComplete(@PathVariable Long id) {
        Assignment assignment = assignmentService.markAsComplete(id);
        return ResponseEntity.ok(assignment);
    }
    
    // Delete assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }
}

package com.echolearn.controller;

import com.echolearn.model.Subject;
import com.echolearn.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    // Get all subjects for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Subject>> getSubjectsByStudent(@PathVariable Long studentId) {
        List<Subject> subjects = subjectService.getSubjectsByStudent(studentId);
        return ResponseEntity.ok(subjects);
    }
    
    // Get subject by ID
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        Subject subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(subject);
    }
    
    // Create new subject
    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Map<String, String> request) {
        Long studentId = Long.valueOf(request.get("studentId"));
        String name = request.get("name");
        String description = request.get("description");
        String teacher = request.get("teacher");
        String color = request.get("color");
        
        Subject subject = subjectService.createSubject(studentId, name, description, teacher, color);
        return ResponseEntity.ok(subject);
    }
    
    // Update subject
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String description = request.get("description");
        String teacher = request.get("teacher");
        String color = request.get("color");
        
        Subject subject = subjectService.updateSubject(id, name, description, teacher, color);
        return ResponseEntity.ok(subject);
    }
    
    // Delete subject
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok().build();
    }
}

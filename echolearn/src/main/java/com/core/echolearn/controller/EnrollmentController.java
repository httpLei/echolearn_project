package com.core.echolearn.controller;

import com.core.echolearn.dto.EnrollmentDTO;
import com.core.echolearn.dto.SubjectDTO;
import com.core.echolearn.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSubjects(@RequestParam Long studentId) {
        try {
            List<SubjectDTO> subjects = enrollmentService.getAvailableSubjectsForEnrollment(studentId);
            return ResponseEntity.ok(createSuccessResponse(subjects));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getEnrollmentsByStudent(@PathVariable Long studentId) {
        try {
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
            return ResponseEntity.ok(createSuccessResponse(enrollments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestParam Long studentId, 
                                          @RequestParam Long subjectId) {
        try {
            EnrollmentDTO enrollment = enrollmentService.enrollStudent(studentId, subjectId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createSuccessResponse(enrollment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @DeleteMapping
    public ResponseEntity<?> unenrollStudent(@RequestParam Long studentId,
                                            @RequestParam Long subjectId) {
        try {
            enrollmentService.unenrollStudent(studentId, subjectId);
            return ResponseEntity.ok(createSuccessResponse("Successfully unenrolled from subject"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> createSuccessResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}


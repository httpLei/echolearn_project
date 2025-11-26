package com.core.echolearn.controller;

import com.core.echolearn.dto.CreateSubjectRequest;
import com.core.echolearn.dto.SubjectDTO;
import com.core.echolearn.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody CreateSubjectRequest request,
                                           @RequestParam Long teacherId) {
        try {
            
            if (request.getSubjectName() == null || request.getSubjectName().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject name is required"));
            }
            
            if (request.getSubjectCode() == null || request.getSubjectCode().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject code is required"));
            }
            
            if (request.getSubjectSchedule() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject schedule is required"));
            }
            
            if (request.getSubjectCapacity() == null || request.getSubjectCapacity() <= 0) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject capacity must be greater than 0"));
            }
            
            SubjectDTO createdSubject = subjectService.createSubject(request, teacherId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createSuccessResponse(createdSubject));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getSubjectsForUser(@RequestParam Long userId, @RequestParam String role) {
        try {
            List<SubjectDTO> subjects;
            
            if ("TEACHER".equalsIgnoreCase(role)) {
              
                subjects = subjectService.getSubjectsByTeacher(userId);
            } else if ("STUDENT".equalsIgnoreCase(role)) {
              
                subjects = java.util.Collections.emptyList();
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid user role"));
            }
            
            return ResponseEntity.ok(createSuccessResponse(subjects));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getSubjectsByTeacher(@PathVariable Long teacherId) {
        try {
            List<SubjectDTO> subjects = subjectService.getSubjectsByTeacher(teacherId);
            return ResponseEntity.ok(createSuccessResponse(subjects));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{subjectId}")
    public ResponseEntity<?> getSubjectById(@PathVariable Long subjectId,
                                             @RequestParam(required = false) Long userId,
                                             @RequestParam(required = false) String role) {
        try {
            return subjectService.getSubjectById(subjectId)
                .map(subject -> {
                   
                    if (userId != null && role != null && "TEACHER".equalsIgnoreCase(role)) {
                        if (!subject.getTeacherId().equals(userId)) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(createErrorResponse("You don't have permission to view this subject"));
                        }
                    }
                  
                    return ResponseEntity.ok(createSuccessResponse(subject));
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{subjectId}")
    public ResponseEntity<?> updateSubject(@PathVariable Long subjectId,
                                          @RequestBody CreateSubjectRequest request,
                                          @RequestParam Long teacherId) {
        try {
            
            if (request.getSubjectName() == null || request.getSubjectName().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject name is required"));
            }
            
            if (request.getSubjectCode() == null || request.getSubjectCode().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject code is required"));
            }
            
            if (request.getSubjectSchedule() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject schedule is required"));
            }
            
            if (request.getSubjectCapacity() == null || request.getSubjectCapacity() <= 0) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Subject capacity must be greater than 0"));
            }
            
            SubjectDTO updatedSubject = subjectService.updateSubject(subjectId, request, teacherId);
            return ResponseEntity.ok(createSuccessResponse(updatedSubject));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long subjectId,
                                           @RequestParam Long teacherId) {
        try {
            subjectService.deleteSubject(subjectId, teacherId);
            return ResponseEntity.ok(createSuccessResponse("Subject deleted successfully"));
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


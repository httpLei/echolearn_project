package com.core.echolearn.controller;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.AssignmentSubmission;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.Notification;
import com.core.echolearn.entity.Enrollment;
import com.core.echolearn.service.AssignmentService;
import com.core.echolearn.service.AssignmentSubmissionService;
import com.core.echolearn.service.UserService;
import com.core.echolearn.service.SubjectService;
import com.core.echolearn.service.NotificationService;
import com.core.echolearn.service.FileStorageService;
import com.core.echolearn.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

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
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAssignmentsByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String subjectCode,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
            
            User user = userOpt.get();
            List<Assignment> assignments = assignmentService.getAssignmentsByUser(user);
            
            // Apply filtering in backend
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate weekFromNow = today.plusDays(7);
            
            assignments = assignments.stream()
                .filter(assignment -> {
                    // Search filter
                    if (search != null && !search.isEmpty()) {
                        if (!assignment.getTitle().toLowerCase().contains(search.toLowerCase())) {
                            return false;
                        }
                    }
                    
                    // Subject filter - by ID for teachers, by code for students
                    if (subjectId != null) {
                        if (assignment.getSubject() == null || 
                            !assignment.getSubject().getSubjectId().equals(subjectId)) {
                            return false;
                        }
                    }
                    if (subjectCode != null && !subjectCode.isEmpty()) {
                        if (assignment.getSubject() == null || 
                            !assignment.getSubject().getSubjectCode().equals(subjectCode)) {
                            return false;
                        }
                    }
                    
                    // Status filter (for students)
                    if (status != null && "STUDENT".equals(user.getRole())) {
                        boolean isCompleted = submissionService.hasSubmitted(assignment, user);
                        java.time.LocalDate dueDate = assignment.getDueDate();
                        
                        switch (status) {
                            case "completed":
                                return isCompleted;
                            case "overdue":
                                return !isCompleted && dueDate.isBefore(today);
                            case "today":
                                return !isCompleted && dueDate.isEqual(today);
                            case "week":
                                return !isCompleted && !dueDate.isBefore(today) && !dueDate.isAfter(weekFromNow);
                            case "upcoming":
                                return !isCompleted && dueDate.isAfter(weekFromNow);
                            case "all":
                                return !isCompleted;
                            default:
                                return true;
                        }
                    }
                    
                    return true;
                })
                .collect(java.util.stream.Collectors.toList());
            
            // Apply sorting in backend
            if (sortBy != null) {
                assignments = assignments.stream()
                    .sorted((a, b) -> {
                        if ("dueDate".equals(sortBy)) {
                            return a.getDueDate().compareTo(b.getDueDate());
                        } else if ("difficulty".equals(sortBy)) {
                            Map<String, Integer> difficultyOrder = new HashMap<>();
                            difficultyOrder.put("HARD", 3);
                            difficultyOrder.put("MEDIUM", 2);
                            difficultyOrder.put("EASY", 1);
                            
                            int aOrder = difficultyOrder.getOrDefault(a.getDifficulty(), 0);
                            int bOrder = difficultyOrder.getOrDefault(b.getDifficulty(), 0);
                            return Integer.compare(bOrder, aOrder); // Descending order
                        }
                        return 0;
                    })
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // For students, add submission status to each assignment
            if ("STUDENT".equals(user.getRole())) {
                List<Map<String, Object>> assignmentsWithStatus = assignments.stream()
                    .map(assignment -> {
                        Map<String, Object> assignmentMap = new HashMap<>();
                        assignmentMap.put("activityId", assignment.getActivityId());
                        assignmentMap.put("title", assignment.getTitle());
                        assignmentMap.put("description", assignment.getDescription());
                        assignmentMap.put("dueDate", assignment.getDueDate());
                        assignmentMap.put("estimatedTime", assignment.getEstimatedTime());
                        assignmentMap.put("difficulty", assignment.getDifficulty());
                        assignmentMap.put("createdAt", assignment.getCreatedAt());
                        assignmentMap.put("subject", assignment.getSubject());
                        assignmentMap.put("user", assignment.getUser());
                        assignmentMap.put("fileNames", assignment.getFileNames());
                        
                        // Check if student has submitted
                        boolean hasSubmitted = submissionService.hasSubmitted(assignment, user);
                        assignmentMap.put("completed", hasSubmitted);
                        
                        return assignmentMap;
                    })
                    .collect(java.util.stream.Collectors.toList());
                
                return ResponseEntity.ok(assignmentsWithStatus);
            }
            
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
    
    //idk if this is still relevant
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
            
            // Create notifications for all enrolled students in the subject
            if (savedAssignment.getSubject() != null) {
                Long subjectId = savedAssignment.getSubject().getSubjectId();
                Optional<Subject> subjectOpt = subjectService.getSubjectEntityById(subjectId);
                
                if (subjectOpt.isPresent()) {
                    Subject subject = subjectOpt.get();
                    List<Enrollment> enrollments = enrollmentRepository.findAll();
                    for (Enrollment enrollment : enrollments) {
                        if (enrollment.getSubject().getSubjectId().equals(subjectId)) {
                            Notification notification = new Notification(
                                "New Assignment Created",
                                "New assignment '" + savedAssignment.getTitle() + "' has been posted in " + 
                                subject.getSubjectCode(),
                                "ASSIGNMENT",
                                savedAssignment.getActivityId()
                            );
                            notification.setUser(enrollment.getStudent());
                            notificationService.createNotification(notification);
                        }
                    }
                }
            }
            
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
            
            User user = userOpt.get();
            List<Assignment> assignments = assignmentService.getAssignmentsBySubjectAndUser(subjectOpt.get(), user);
            
            // For students, add submission status to each assignment
            if ("STUDENT".equals(user.getRole())) {
                List<Map<String, Object>> assignmentsWithStatus = assignments.stream()
                    .map(assignment -> {
                        Map<String, Object> assignmentMap = new HashMap<>();
                        assignmentMap.put("activityId", assignment.getActivityId());
                        assignmentMap.put("title", assignment.getTitle());
                        assignmentMap.put("description", assignment.getDescription());
                        assignmentMap.put("dueDate", assignment.getDueDate());
                        assignmentMap.put("estimatedTime", assignment.getEstimatedTime());
                        assignmentMap.put("difficulty", assignment.getDifficulty());
                        assignmentMap.put("createdAt", assignment.getCreatedAt());
                        assignmentMap.put("subject", assignment.getSubject());
                        assignmentMap.put("user", assignment.getUser());
                        
                        // Check if student has submitted
                        boolean hasSubmitted = submissionService.hasSubmitted(assignment, user);
                        assignmentMap.put("completed", hasSubmitted);
                        
                        return assignmentMap;
                    })
                    .collect(Collectors.toList());
                
                return ResponseEntity.ok(assignmentsWithStatus);
            }
            
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
    
    // Upload files for assignment
    @PostMapping("/upload-files")
    public ResponseEntity<?> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> fileNames = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String storedFileName = fileStorageService.storeFile(file);
                    fileNames.add(storedFileName);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("fileNames", String.join(",", fileNames));
            response.put("count", fileNames.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error uploading files: " + e.getMessage());
        }
    }
    
    // Download assignment file
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.loadFile(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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

package com.core.echolearn.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.core.echolearn.entity.ClassPost;
import com.core.echolearn.entity.ClassReply;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Notification;
import com.core.echolearn.entity.Enrollment;
import com.core.echolearn.service.ClassPostService;
import com.core.echolearn.service.UserService;
import com.core.echolearn.service.NotificationService;
import com.core.echolearn.repository.EnrollmentRepository;

@RestController
@RequestMapping("/api/classes/{subjectId}/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class ClassPostController {
    
    @Autowired
    private ClassPostService classPostService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
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

    @GetMapping
    public ResponseEntity<?> getSubjectFeed(@PathVariable Long subjectId) {
        try {
            List<ClassPost> posts = classPostService.getPostsBySubject(subjectId);
            return ResponseEntity.ok(createSuccessResponse(posts));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createNewPost(@PathVariable Long subjectId, 
                                           @RequestBody Map<String, Object> payload) {
        try {
            String content = (String) payload.get("content");
            Long authorId = Long.valueOf(payload.get("authorId").toString());
            
            if (content == null || content.isBlank()) {
                 return ResponseEntity.badRequest().body(createErrorResponse("Post content cannot be empty"));
            }
            Optional<User> authorOpt = userService.findById(authorId);
            if (authorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("Author not found"));
            }
            
            ClassPost savedPost = classPostService.createPost(subjectId, authorId, content);
            
            // Create notifications for all users in the subject except the author
            List<Enrollment> enrollments = enrollmentRepository.findAll();
            for (Enrollment enrollment : enrollments) {
                if (enrollment.getSubject().getSubjectId().equals(subjectId) && 
                    !enrollment.getStudent().getId().equals(authorId)) {
                    Notification notification = new Notification(
                        "New Class Post",
                        authorOpt.get().getUsername() + " posted in " + enrollment.getSubject().getSubjectCode(),
                        "POST",
                        subjectId
                    );
                    notification.setUser(enrollment.getStudent());
                    notificationService.createNotification(notification);
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createSuccessResponse(savedPost));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{postId}/replies")
    public ResponseEntity<?> getPostReplies(@PathVariable Long postId) {
        try {
            List<ClassReply> replies = classPostService.getRepliesByPost(postId);
            return ResponseEntity.ok(createSuccessResponse(replies));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/{postId}/replies")
    public ResponseEntity<?> createReply(@PathVariable Long postId,
                                         @RequestBody Map<String, Object> payload) {
        try {
            String content = (String) payload.get("content");
            Long authorId = Long.valueOf(payload.get("authorId").toString());
            
            if (content == null || content.isBlank()) {
                 return ResponseEntity.badRequest().body(createErrorResponse("Reply content cannot be empty"));
            }
            
            ClassReply savedReply = classPostService.createReply(postId, authorId, content);
            
            // Get the post to access its author and subject
            ClassPost post = savedReply.getPost();
            User replyAuthor = savedReply.getAuthor();
            
            // Create notification for the post author (if it's not the same person replying)
            if (!post.getAuthor().getId().equals(authorId)) {
                Notification notification = new Notification(
                    "New Reply",
                    replyAuthor.getUsername() + " replied to your post in " + post.getSubject().getSubjectCode(),
                    "REPLY",
                    post.getSubject().getSubjectId()
                );
                notification.setUser(post.getAuthor());
                notificationService.createNotification(notification);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createSuccessResponse(savedReply));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            boolean deleted = classPostService.deletePost(postId);
            if (deleted) {
                return ResponseEntity.ok(createSuccessResponse("Post deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("Post not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{postId}")
    public ResponseEntity<?> editPost(@PathVariable Long postId, @RequestBody Map<String, String> payload) {
        try {
            String newContent = payload.get("content");
            ClassPost updatedPost = classPostService.editPost(postId, newContent);
            if (updatedPost != null) {
                return ResponseEntity.ok(createSuccessResponse(updatedPost));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("Post not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{postId}/replies/{replyId}")
    public ResponseEntity<?> deleteReply(@PathVariable Long replyId) {
        try {
            boolean deleted = classPostService.deleteReply(replyId);
            if (deleted) {
                return ResponseEntity.ok(createSuccessResponse("Reply deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("Reply not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PutMapping("/{postId}/replies/{replyId}")
    public ResponseEntity<?> editReply(@PathVariable Long replyId, @RequestBody Map<String, String> payload) {
        try {
            String newContent = payload.get("content");
            ClassReply updatedReply = classPostService.editReply(replyId, newContent);
            if (updatedReply != null) {
                return ResponseEntity.ok(createSuccessResponse(updatedReply));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("Reply not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred: " + e.getMessage()));
        }
    }
}
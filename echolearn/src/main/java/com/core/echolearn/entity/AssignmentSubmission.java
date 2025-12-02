package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
public class AssignmentSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long submissionId;
    
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(length = 2000)
    private String submissionText;
    
    @Column(length = 1000)
    private String fileNames; // Comma-separated file names
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    @Column(nullable = false)
    private String status; // SUBMITTED, GRADED
    
    @Column
    private Integer grade;
    
    @Column(length = 1000)
    private String feedback;
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) {
            status = "SUBMITTED";
        }
    }
    
    // Constructors
    public AssignmentSubmission() {
    }
    
    public AssignmentSubmission(Assignment assignment, User student, String submissionText, String fileNames) {
        this.assignment = assignment;
        this.student = student;
        this.submissionText = submissionText;
        this.fileNames = fileNames;
        this.status = "SUBMITTED";
    }
    
    // Getters and Setters
    public Long getSubmissionId() {
        return submissionId;
    }
    
    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }
    
    public Assignment getAssignment() {
        return assignment;
    }
    
    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }
    
    public User getStudent() {
        return student;
    }
    
    public void setStudent(User student) {
        this.student = student;
    }
    
    public String getSubmissionText() {
        return submissionText;
    }
    
    public void setSubmissionText(String submissionText) {
        this.submissionText = submissionText;
    }
    
    public String getFileNames() {
        return fileNames;
    }
    
    public void setFileNames(String fileNames) {
        this.fileNames = fileNames;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Integer getGrade() {
        return grade;
    }
    
    public void setGrade(Integer grade) {
        this.grade = grade;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}

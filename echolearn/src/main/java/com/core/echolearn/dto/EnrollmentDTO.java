package com.core.echolearn.dto;

import java.time.LocalDateTime;

public class EnrollmentDTO {
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private Long subjectId;
    private SubjectDTO subject;
    private LocalDateTime enrolledAt;
    
    public EnrollmentDTO() {
    }
    
    public EnrollmentDTO(Long enrollmentId, Long studentId, String studentName, 
                        Long subjectId, SubjectDTO subject, LocalDateTime enrolledAt) {
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.subjectId = subjectId;
        this.subject = subject;
        this.enrolledAt = enrolledAt;
    }
    
    // Getters and Setters
    public Long getEnrollmentId() {
        return enrollmentId;
    }
    
    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public Long getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
    
    public SubjectDTO getSubject() {
        return subject;
    }
    
    public void setSubject(SubjectDTO subject) {
        this.subject = subject;
    }
    
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    
    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
}


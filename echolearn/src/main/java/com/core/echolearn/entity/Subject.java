package com.core.echolearn.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subjects")
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;
    
    @Column(name = "subject_name", nullable = false)
    private String subjectName;
    
    @Column(name = "subject_code", nullable = false)
    private String subjectCode;
    
    @Column(name = "subject_desc", columnDefinition = "TEXT")
    private String subjectDesc;
    
    @Column(name = "subject_schedule", nullable = false)
    private LocalDateTime subjectSchedule;
    
    @Column(name = "subject_capacity", nullable = false)
    private Integer subjectCapacity;
    
    @Column(name = "enrolled_students", nullable = false)
    private Integer enrolledStudents;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (enrolledStudents == null) {
            enrolledStudents = 0;
        }
    }
    
    // Constructors
    public Subject() {
    }
    
    public Subject(String subjectName, String subjectCode, String subjectDesc, 
                   LocalDateTime subjectSchedule, Integer subjectCapacity, User teacher) {
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.subjectDesc = subjectDesc;
        this.subjectSchedule = subjectSchedule;
        this.subjectCapacity = subjectCapacity;
        this.teacher = teacher;
        this.enrolledStudents = 0;
    }
    
    // Getters and Setters
    public Long getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
    
    public String getSubjectName() {
        return subjectName;
    }
    
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
    
    public String getSubjectCode() {
        return subjectCode;
    }
    
    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }
    
    public String getSubjectDesc() {
        return subjectDesc;
    }
    
    public void setSubjectDesc(String subjectDesc) {
        this.subjectDesc = subjectDesc;
    }
    
    public LocalDateTime getSubjectSchedule() {
        return subjectSchedule;
    }
    
    public void setSubjectSchedule(LocalDateTime subjectSchedule) {
        this.subjectSchedule = subjectSchedule;
    }
    
    public Integer getSubjectCapacity() {
        return subjectCapacity;
    }
    
    public void setSubjectCapacity(Integer subjectCapacity) {
        this.subjectCapacity = subjectCapacity;
    }
    
    public Integer getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(Integer enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getTeacher() {
        return teacher;
    }
    
    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }
}


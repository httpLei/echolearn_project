package com.core.echolearn.dto;

import java.time.LocalDateTime;

public class SubjectDTO {
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String subjectDesc;
    private LocalDateTime subjectSchedule;
    private Integer subjectCapacity;
    private Integer enrolledStudents;
    private LocalDateTime createdAt;
    private Long teacherId;
    private String teacherName;
    private String teacherUsername;
    
    public SubjectDTO() {
    }
    
    public SubjectDTO(Long subjectId, String subjectName, String subjectCode, String subjectDesc,
                     LocalDateTime subjectSchedule, Integer subjectCapacity, Integer enrolledStudents,
                     LocalDateTime createdAt, Long teacherId, String teacherName, String teacherUsername) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.subjectDesc = subjectDesc;
        this.subjectSchedule = subjectSchedule;
        this.subjectCapacity = subjectCapacity;
        this.enrolledStudents = enrolledStudents;
        this.createdAt = createdAt;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherUsername = teacherUsername;
    }
    
    
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
    
    public Long getTeacherId() {
        return teacherId;
    }
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
    
    public String getTeacherName() {
        return teacherName;
    }
    
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    
    public String getTeacherUsername() {
        return teacherUsername;
    }
    
    public void setTeacherUsername(String teacherUsername) {
        this.teacherUsername = teacherUsername;
    }
}


package com.core.echolearn.dto;

import java.time.LocalDateTime;

public class CreateSubjectRequest {
    private String subjectName;
    private String subjectCode;
    private String subjectDesc;
    private LocalDateTime subjectSchedule;
    private Integer subjectCapacity;
    
    public CreateSubjectRequest() {
    }
    
    public CreateSubjectRequest(String subjectName, String subjectCode, String subjectDesc,
                               LocalDateTime subjectSchedule, Integer subjectCapacity) {
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.subjectDesc = subjectDesc;
        this.subjectSchedule = subjectSchedule;
        this.subjectCapacity = subjectCapacity;
    }
    
    // Getters and Setters
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
}


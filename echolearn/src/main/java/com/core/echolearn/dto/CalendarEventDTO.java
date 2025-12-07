package com.core.echolearn.dto;

import java.time.LocalDateTime;

public class CalendarEventDTO {
    private Long id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String resourceType;
    private Boolean completed;
    // ⭐️ NEW FIELDS
    private String location;
    private String description;

    // ⭐️ UPDATED CONSTRUCTOR (8 Arguments)
    public CalendarEventDTO(Long id, String title, LocalDateTime start, LocalDateTime end, String resourceType, Boolean completed, String location, String description) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.resourceType = resourceType;
        this.completed = completed;
        this.location = location;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDateTime getStart() { return start; }
    public void setStart(LocalDateTime start) { this.start = start; }
    public LocalDateTime getEnd() { return end; }
    public void setEnd(LocalDateTime end) { this.end = end; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    
    // ⭐️ New Getters/Setters
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
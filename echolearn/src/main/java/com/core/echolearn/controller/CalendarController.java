package com.core.echolearn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.core.echolearn.dto.CalendarEventDTO; // Add these
import com.core.echolearn.dto.CreateEventRequest;
import com.core.echolearn.entity.Calendar;
import com.core.echolearn.entity.User;
import com.core.echolearn.service.CalendarService;
import com.core.echolearn.service.UserService;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private UserService userService; 

    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventDTO>> getCalendarEvents(@RequestParam("userId") Long userId) {
        User currentUser = userService.findById(userId).orElse(null); 
        if (currentUser == null) return ResponseEntity.status(404).build(); 

        return ResponseEntity.ok(calendarService.getFullCalendarForUser(currentUser));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(
        @RequestParam("userId") Long userId,
        @RequestBody CreateEventRequest request
    ) {
        User currentUser = userService.findById(userId).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Calendar createdEvent = calendarService.createEvent(request, currentUser);
        return ResponseEntity.ok(createdEvent);
    }

    // ⭐️ NEW: Update Endpoint
    @PutMapping("/update/{eventId}")
    public ResponseEntity<?> updateEvent(
        @PathVariable Long eventId,
        @RequestParam("userId") Long userId,
        @RequestBody CreateEventRequest request
    ) {
        User currentUser = userService.findById(userId).orElse(null);
        if (currentUser == null) return ResponseEntity.status(404).body("User not found");

        try {
            Calendar updated = calendarService.updateEvent(eventId, request, currentUser);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // ⭐️ NEW: Delete Endpoint
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<?> deleteEvent(
        @PathVariable Long eventId,
        @RequestParam("userId") Long userId
    ) {
        User currentUser = userService.findById(userId).orElse(null);
        if (currentUser == null) return ResponseEntity.status(404).body("User not found");

        boolean deleted = calendarService.deleteEvent(eventId, currentUser);
        if (deleted) {
            return ResponseEntity.ok("Event deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Event not found");
        }
    }
}
package com.core.echolearn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // You'll need this to get the current user
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.core.echolearn.dto.CalendarEventDTO;
import com.core.echolearn.entity.User;
import com.core.echolearn.service.AssignmentService;
import com.core.echolearn.service.UserService;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService; 

    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventDTO>> getCalendarEvents(
        @RequestParam("userId") Long userId 
    ) {
        User currentUser = userService.findById(userId).orElse(null); 

        if (currentUser == null) {
            // if the user from the frontend doesn't match a user in the db, return 404.
            return ResponseEntity.status(404).build(); 
        }

        // fetch events
        List<CalendarEventDTO> events = assignmentService.getCalendarEventsForUser(currentUser);
        
        // return events list
        return ResponseEntity.ok(events);
    }
}
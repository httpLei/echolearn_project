package com.core.echolearn.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.core.echolearn.dto.CalendarEventDTO;
import com.core.echolearn.dto.CreateEventRequest;
import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.Calendar;
import com.core.echolearn.entity.Enrollment;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.AssignmentRepository;
import com.core.echolearn.repository.CalendarRepository;
import com.core.echolearn.repository.EnrollmentRepository;
import com.core.echolearn.repository.SubjectRepository;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository; // ⭐️ Added to fetch enrollments

    public List<CalendarEventDTO> getFullCalendarForUser(User user) {
        List<CalendarEventDTO> allEvents = new ArrayList<>();

        // 1. Fetch Manual Events
        List<Calendar> calendarEvents = calendarRepository.findByUser(user);
        allEvents.addAll(calendarEvents.stream()
            .map(c -> new CalendarEventDTO(
                c.getEventID(),
                c.getTitle(),
                c.getDate(),
                c.getEndTime() != null ? c.getEndTime() : c.getDate().plusHours(1),
                "EVENT",
                false,
                c.getLocation(),
                c.getDescription()
            )).collect(Collectors.toList()));

        // 2. Fetch Assignments
        List<Assignment> allAssignments = new ArrayList<>();
        allAssignments.addAll(assignmentRepository.findByUserOrderByDueDateAsc(user));

        if (user.getRole().equals("STUDENT")) {
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
            for (Enrollment enrollment : enrollments) {
                Subject subject = enrollment.getSubject();
                // Ensure AssignmentRepository has findBySubject(Subject s)
                allAssignments.addAll(assignmentRepository.findBySubject(subject));
            }
        } else if (user.getRole().equals("TEACHER")) {
            List<Subject> teacherSubjects = subjectRepository.findByTeacherId(user.getId());
            for (Subject sub : teacherSubjects) {
                allAssignments.addAll(assignmentRepository.findBySubject(sub));
            }
        }

        // Add distinct Assignments to the event list
        allEvents.addAll(allAssignments.stream()
            .filter(a -> a.getDueDate() != null)
            .distinct()
            .map(a -> new CalendarEventDTO(
                a.getActivityId(),
                a.getTitle() + " (Due)",
                a.getDueDate().atStartOfDay(),
                a.getDueDate().atStartOfDay().plusHours(1),
                "ASSIGNMENT",
                a.getCompleted(),
                null, // ⭐️ Location is null for assignments
                a.getDescription() // ⭐️ Description comes from assignment
            )).collect(Collectors.toList()));

        return allEvents;
    
    }

    public Calendar createEvent(CreateEventRequest request, User user) {
        Calendar newEvent = new Calendar();
        newEvent.setTitle(request.getTitle());
        newEvent.setDate(request.getDate());
        newEvent.setEndTime(request.getEndTime());
        newEvent.setReminderTime(request.getReminderTime());
        newEvent.setLocation(request.getLocation());
        newEvent.setDescription(request.getDescription());
        newEvent.setUser(user);
        newEvent.setSubject(null); 
        return calendarRepository.save(newEvent);
    }

    // ⭐️ NEW: Update an existing event
    public Calendar updateEvent(Long eventId, CreateEventRequest request, User user) {
        Optional<Calendar> eventOpt = calendarRepository.findById(eventId);
        
        if (eventOpt.isPresent()) {
            Calendar event = eventOpt.get();
            // Security check: Ensure the user owns this event
            if (!event.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized: You do not own this event.");
            }

            // Update fields
            event.setTitle(request.getTitle());
            event.setDate(request.getDate()); // Start Time
            event.setEndTime(request.getEndTime());
            event.setReminderTime(request.getReminderTime());
            event.setLocation(request.getLocation());
            event.setDescription(request.getDescription());

            return calendarRepository.save(event);
        }
        return null;
    }

    // ⭐️ NEW: Delete an event
    public boolean deleteEvent(Long eventId, User user) {
        Optional<Calendar> eventOpt = calendarRepository.findById(eventId);
        
        if (eventOpt.isPresent()) {
            Calendar event = eventOpt.get();
            if (!event.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized");
            }
            calendarRepository.delete(event);
            return true;
        }
        return false;
    }
}
package com.echolearn.service;

import com.echolearn.model.Subject;
import com.echolearn.model.User;
import com.echolearn.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserService userService;
    
    // Create a new subject
    public Subject createSubject(Long studentId, String name, String description, String teacher, String color) {
        User student = userService.getUserById(studentId);
        
        Subject subject = new Subject();
        subject.setName(name);
        subject.setDescription(description);
        subject.setTeacher(teacher);
        subject.setColor(color);
        subject.setStudent(student);
        
        return subjectRepository.save(subject);
    }
    
    // Get all subjects for a student
    public List<Subject> getSubjectsByStudent(Long studentId) {
        User student = userService.getUserById(studentId);
        return subjectRepository.findByStudent(student);
    }
    
    // Get subject by ID
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
    }
    
    // Update subject
    public Subject updateSubject(Long id, String name, String description, String teacher, String color) {
        Subject subject = getSubjectById(id);
        subject.setName(name);
        subject.setDescription(description);
        subject.setTeacher(teacher);
        subject.setColor(color);
        return subjectRepository.save(subject);
    }
    
    // Delete subject
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}

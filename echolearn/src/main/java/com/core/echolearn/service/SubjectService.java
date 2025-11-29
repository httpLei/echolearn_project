package com.core.echolearn.service;

import com.core.echolearn.dto.CreateSubjectRequest;
import com.core.echolearn.dto.SubjectDTO;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.SubjectRepository;
import com.core.echolearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public SubjectDTO createSubject(CreateSubjectRequest request, Long teacherId) {
        Optional<User> teacherOpt = userRepository.findById(teacherId);
        if (teacherOpt.isEmpty() || !teacherOpt.get().getRole().equals("TEACHER")) {
            throw new IllegalArgumentException("Invalid teacher ID or user is not a teacher");
        }
        
        User teacher = teacherOpt.get();
        Subject subject = new Subject(
            request.getSubjectName(),
            request.getSubjectCode(),
            request.getSubjectDesc(),
            request.getSubjectSchedule(),
            request.getSubjectCapacity(),
            teacher
        );
        
        Subject savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }
    
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<SubjectDTO> getSubjectsByTeacher(Long teacherId) {
        return subjectRepository.findByTeacherId(teacherId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<SubjectDTO> getSubjectById(Long subjectId) {
        return subjectRepository.findById(subjectId)
            .map(this::convertToDTO);
    }
    
    public Optional<Subject> getSubjectEntityById(Long subjectId) {
        return subjectRepository.findById(subjectId);
    }
    
    @Transactional
    public SubjectDTO updateSubject(Long subjectId, CreateSubjectRequest request, Long teacherId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }
        
        Subject subject = subjectOpt.get();
        
        
        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new IllegalArgumentException("You don't have permission to edit this subject");
        }
        
     
        subject.setSubjectName(request.getSubjectName());
        subject.setSubjectCode(request.getSubjectCode());
        subject.setSubjectDesc(request.getSubjectDesc());
        subject.setSubjectSchedule(request.getSubjectSchedule());
        subject.setSubjectCapacity(request.getSubjectCapacity());
        
        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDTO(updatedSubject);
    }
    
    @Transactional
    public void deleteSubject(Long subjectId, Long teacherId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }
        
        Subject subject = subjectOpt.get();
        
        
        if (!subject.getTeacher().getId().equals(teacherId)) {
            throw new IllegalArgumentException("You don't have permission to delete this subject");
        }
        
        subjectRepository.delete(subject);
    }
    
    public SubjectDTO convertToDTO(Subject subject) {
        User teacher = subject.getTeacher();
        return new SubjectDTO(
            subject.getSubjectId(),
            subject.getSubjectName(),
            subject.getSubjectCode(),
            subject.getSubjectDesc(),
            subject.getSubjectSchedule(),
            subject.getSubjectCapacity(),
            subject.getEnrolledStudents(),
            subject.getCreatedAt(),
            teacher.getId(),
            teacher.getUsername(), // Using username as teacher name
            teacher.getUsername()
        );
    }
}


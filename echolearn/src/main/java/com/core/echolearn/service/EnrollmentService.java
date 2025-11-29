package com.core.echolearn.service;

import com.core.echolearn.dto.EnrollmentDTO;
import com.core.echolearn.dto.SubjectDTO;
import com.core.echolearn.entity.Enrollment;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.EnrollmentRepository;
import com.core.echolearn.repository.SubjectRepository;
import com.core.echolearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectService subjectService;
    
    @Transactional
    public EnrollmentDTO enrollStudent(Long studentId, Long subjectId) {
        
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty() || !studentOpt.get().getRole().equals("STUDENT")) {
            throw new IllegalArgumentException("Invalid student ID or user is not a student");
        }
        
    
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }
        
        User student = studentOpt.get();
        Subject subject = subjectOpt.get();
        
        
        if (enrollmentRepository.existsByStudentIdAndSubjectSubjectId(studentId, subjectId)) {
            throw new IllegalArgumentException("Student is already enrolled in this subject");
        }
        
        
        if (subject.getEnrolledStudents() >= subject.getSubjectCapacity()) {
            throw new IllegalArgumentException("Subject has reached maximum capacity");
        }
        
      
        Enrollment enrollment = new Enrollment(student, subject);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        
        
        subject.setEnrolledStudents(subject.getEnrolledStudents() + 1);
        subjectRepository.save(subject);
        
        return convertToDTO(savedEnrollment);
    }
    
    @Transactional
    public void unenrollStudent(Long studentId, Long subjectId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndSubjectSubjectId(studentId, subjectId);
        if (enrollmentOpt.isEmpty()) {
            throw new IllegalArgumentException("Enrollment not found");
        }
        
        Enrollment enrollment = enrollmentOpt.get();
        
      
        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("You don't have permission to unenroll from this subject");
        }
        
       
        Subject subject = enrollment.getSubject();
        if (subject.getEnrolledStudents() > 0) {
            subject.setEnrolledStudents(subject.getEnrolledStudents() - 1);
            subjectRepository.save(subject);
        }
        
       
        enrollmentRepository.delete(enrollment);
    }
    
    public List<EnrollmentDTO> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<SubjectDTO> getAvailableSubjectsForEnrollment(Long studentId) {
        
        List<Subject> allSubjects = subjectRepository.findAllByOrderByCreatedAtDesc();
        
        
        List<Long> enrolledSubjectIds = enrollmentRepository.findByStudentId(studentId).stream()
            .map(e -> e.getSubject().getSubjectId())
            .collect(Collectors.toList());
        
       
        return allSubjects.stream()
            .filter(subject -> !enrolledSubjectIds.contains(subject.getSubjectId()))
            .map(subject -> subjectService.convertToDTO(subject))
            .collect(Collectors.toList());
    }
    
    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        User student = enrollment.getStudent();
        SubjectDTO subjectDTO = subjectService.convertToDTO(enrollment.getSubject());
        
        return new EnrollmentDTO(
            enrollment.getEnrollmentId(),
            student.getId(),
            student.getUsername(),
            enrollment.getSubject().getSubjectId(),
            subjectDTO,
            enrollment.getEnrolledAt()
        );
    }
}


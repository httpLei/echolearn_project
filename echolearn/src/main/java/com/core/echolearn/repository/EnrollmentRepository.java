package com.core.echolearn.repository;

import com.core.echolearn.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudentId(Long studentId);
    
    Optional<Enrollment> findByStudentIdAndSubjectSubjectId(Long studentId, Long subjectId);
    
    boolean existsByStudentIdAndSubjectSubjectId(Long studentId, Long subjectId);
    
    void deleteByStudentIdAndSubjectSubjectId(Long studentId, Long subjectId);
}


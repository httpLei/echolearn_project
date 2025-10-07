package com.echolearn.repository;

import com.echolearn.model.Subject;
import com.echolearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    // Find all subjects for a student
    List<Subject> findByStudent(User student);
    
    // Find subject by name and student
    Subject findByStudentAndName(User student, String name);
}

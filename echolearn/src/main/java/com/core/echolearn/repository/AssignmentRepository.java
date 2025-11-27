package com.core.echolearn.repository;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import com.core.echolearn.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByUser(User user);
    
    List<Assignment> findByUserAndCompleted(User user, Boolean completed);
    
    List<Assignment> findByUserAndDueDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    List<Assignment> findByUserAndSubject(User user, Subject subject);
    
    List<Assignment> findByUserAndDifficulty(User user, String difficulty);
    
    List<Assignment> findByUserOrderByDueDateAsc(User user);
    
    List<Assignment> findBySubjectOrderByDueDateAsc(Subject subject);
    
    List<Assignment> findBySubjectAndUserOrderByDueDateAsc(Subject subject, User user);
    
    // Get assignments for a student: assignments created by teacher (user=null) OR assigned to student
    @Query("SELECT a FROM Assignment a WHERE a.subject = :subject AND (a.user IS NULL OR a.user = :user) ORDER BY a.dueDate ASC")
    List<Assignment> findBySubjectForStudent(@Param("subject") Subject subject, @Param("user") User user);
}

package com.core.echolearn.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.Subject;
import com.core.echolearn.entity.User;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByUser(User user);

    List<Assignment> findBySubject(Subject subject);
    
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
    
    // Get all assignments for a user across all enrolled subjects (includes teacher-created assignments)
    @Query("SELECT a FROM Assignment a JOIN a.subject s JOIN Enrollment e ON e.subject = s WHERE e.student = :user AND (a.user IS NULL OR a.user = :user) ORDER BY a.dueDate ASC")
    List<Assignment> findAllForStudent(@Param("user") User user);
    
    // Get all assignments from subjects a teacher teaches
    @Query("SELECT a FROM Assignment a WHERE a.subject.teacher.id = :teacherId ORDER BY a.dueDate ASC")
    List<Assignment> findAllForTeacher(@Param("teacherId") Long teacherId);
}

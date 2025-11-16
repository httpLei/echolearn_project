package com.core.echolearn.repository;

import com.core.echolearn.entity.Assignment;
import com.core.echolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByUser(User user);
    
    List<Assignment> findByUserAndCompleted(User user, Boolean completed);
    
    List<Assignment> findByUserAndDueDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    List<Assignment> findByUserAndSubject(User user, String subject);
    
    List<Assignment> findByUserAndDifficulty(User user, String difficulty);
    
    List<Assignment> findByUserOrderByDueDateAsc(User user);
}

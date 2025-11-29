package com.core.echolearn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.core.echolearn.entity.ClassPost;
import com.core.echolearn.entity.Subject;

@Repository
public interface ClassPostRepository extends JpaRepository<ClassPost, Long> {
    
    // Fetch all non-deleted posts for a given subject, ordered by creation date (newest first)
    List<ClassPost> findBySubjectAndIsDeletedFalseOrderByCreatedAtDesc(Subject subject);
}
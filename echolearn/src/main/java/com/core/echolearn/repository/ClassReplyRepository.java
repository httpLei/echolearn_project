package com.core.echolearn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.core.echolearn.entity.ClassPost;
import com.core.echolearn.entity.ClassReply;

@Repository
public interface ClassReplyRepository extends JpaRepository<ClassReply, Long> {
    
    // Fetch all non-deleted replies for a given post, ordered by creation date 
    List<ClassReply> findByPostAndIsDeletedFalseOrderByCreatedAtAsc(ClassPost post);

    // Count non-deleted replies for a given post
    long countByPostAndIsDeletedFalse(ClassPost post);
}
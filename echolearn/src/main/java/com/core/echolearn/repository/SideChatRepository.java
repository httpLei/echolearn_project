package com.core.echolearn.repository;

import com.core.echolearn.entity.Conversation;
import com.core.echolearn.entity.SideChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SideChatRepository extends JpaRepository<SideChat, Long> {
    
    List<SideChat> findByConversationAndIsDeletedFalseOrderByCreatedAtDesc(Conversation conversation);
    
    Long countByConversationAndIsDeletedFalse(Conversation conversation);
}

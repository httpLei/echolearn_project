package com.core.echolearn.repository;

import com.core.echolearn.entity.Conversation;
import com.core.echolearn.entity.Message;
import com.core.echolearn.entity.SideChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByConversationAndSideChatIsNullAndIsDeletedFalseOrderByTimestampAsc(Conversation conversation);
    
    List<Message> findBySideChatAndIsDeletedFalseOrderByTimestampAsc(SideChat sideChat);
    
    Long countBySideChatAndIsDeletedFalse(SideChat sideChat);
}

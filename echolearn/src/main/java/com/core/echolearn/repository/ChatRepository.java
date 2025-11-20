package com.core.echolearn.repository;

import com.core.echolearn.entity.Chat;
import com.core.echolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    List<Chat> findByChannelNameAndParentChatIsNullAndIsDeletedFalseOrderByTimestampAsc(String channelName);
    
    List<Chat> findByParentChatAndIsDeletedFalseOrderByTimestampAsc(Chat parentChat);
    
    List<Chat> findByUserAndIsDeletedFalseOrderByTimestampDesc(User user);
    
    Long countByParentChatAndIsDeletedFalse(Chat parentChat);
}

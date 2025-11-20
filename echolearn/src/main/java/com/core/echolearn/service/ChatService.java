package com.core.echolearn.service;

import com.core.echolearn.entity.Chat;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {
    
    @Autowired
    private ChatRepository chatRepository;
    
    public Chat sendMessage(Chat chat) {
        chat.setTimestamp(LocalDateTime.now());
        chat.setIsEdited(false);
        chat.setIsDeleted(false);
        return chatRepository.save(chat);
    }
    
    public Chat editMessage(Long chatId, String newContent) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            Chat chat = chatOpt.get();
            chat.setContent(newContent);
            chat.setIsEdited(true);
            return chatRepository.save(chat);
        }
        return null;
    }
    
    public boolean deleteMessage(Long chatId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            Chat chat = chatOpt.get();
            chat.setIsDeleted(true);
            chat.setContent("[Message deleted]");
            chatRepository.save(chat);
            return true;
        }
        return false;
    }
    
    public List<Chat> getChannelMessages(String channelName) {
        return chatRepository.findByChannelNameAndParentChatIsNullAndIsDeletedFalseOrderByTimestampAsc(channelName);
    }
    
    public List<Chat> getSideChats(Long parentChatId) {
        Optional<Chat> parentChat = chatRepository.findById(parentChatId);
        if (parentChat.isPresent()) {
            return chatRepository.findByParentChatAndIsDeletedFalseOrderByTimestampAsc(parentChat.get());
        }
        return List.of();
    }
    
    public Long getSideChatCount(Long parentChatId) {
        Optional<Chat> parentChat = chatRepository.findById(parentChatId);
        if (parentChat.isPresent()) {
            return chatRepository.countByParentChatAndIsDeletedFalse(parentChat.get());
        }
        return 0L;
    }
    
    public Optional<Chat> findById(Long chatId) {
        return chatRepository.findById(chatId);
    }
    
    public List<Chat> getUserMessages(User user) {
        return chatRepository.findByUserAndIsDeletedFalseOrderByTimestampDesc(user);
    }
}

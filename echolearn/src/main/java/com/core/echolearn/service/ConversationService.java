package com.core.echolearn.service;

import com.core.echolearn.entity.Conversation;
import com.core.echolearn.entity.Message;
import com.core.echolearn.entity.SideChat;
import com.core.echolearn.entity.User;
import com.core.echolearn.repository.ConversationRepository;
import com.core.echolearn.repository.MessageRepository;
import com.core.echolearn.repository.SideChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private SideChatRepository sideChatRepository;
    
    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findByUser(user);
    }
    
    public Optional<Conversation> getConversation(Long conversationId) {
        return conversationRepository.findById(conversationId);
    }
    
    @Transactional
    public Conversation getOrCreateConversation(User user1, User user2) {
        Optional<Conversation> existingConversation = conversationRepository.findByUsers(user1, user2);
        
        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }
        
        Conversation newConversation = new Conversation(user1, user2);
        return conversationRepository.save(newConversation);
    }
    
    public List<Message> getConversationMessages(Long conversationId) {
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);
        if (conversation.isPresent()) {
            return messageRepository.findByConversationAndSideChatIsNullAndIsDeletedFalseOrderByTimestampAsc(conversation.get());
        }
        return List.of();
    }
    
    @Transactional
    public Message sendMessage(Long conversationId, User sender, String content) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            Message message = new Message(conversation, sender, content);
            
            // Update conversation's last message timestamp
            conversation.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conversation);
            
            return messageRepository.save(message);
        }
        
        return null;
    }
    
    @Transactional
    public Message sendMessageToSideChat(Long sideChatId, User sender, String content) {
        Optional<SideChat> sideChatOpt = sideChatRepository.findById(sideChatId);
        
        if (sideChatOpt.isPresent()) {
            SideChat sideChat = sideChatOpt.get();
            Message message = new Message(sideChat.getConversation(), sender, content);
            message.setSideChat(sideChat);
            
            // Update conversation's last message timestamp
            sideChat.getConversation().setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(sideChat.getConversation());
            
            return messageRepository.save(message);
        }
        
        return null;
    }
    
    @Transactional
    public Message editMessage(Long messageId, String newContent) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        
        if (messageOpt.isPresent()) {
            Message message = messageOpt.get();
            message.setContent(newContent);
            message.setIsEdited(true);
            return messageRepository.save(message);
        }
        
        return null;
    }
    
    @Transactional
    public boolean deleteMessage(Long messageId) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        
        if (messageOpt.isPresent()) {
            Message message = messageOpt.get();
            message.setIsDeleted(true);
            message.setContent("[Message deleted]");
            messageRepository.save(message);
            return true;
        }
        
        return false;
    }
    
    public List<SideChat> getConversationSideChats(Long conversationId) {
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);
        if (conversation.isPresent()) {
            return sideChatRepository.findByConversationAndIsDeletedFalseOrderByCreatedAtDesc(conversation.get());
        }
        return List.of();
    }
    
    public List<Message> getSideChatMessages(Long sideChatId) {
        Optional<SideChat> sideChat = sideChatRepository.findById(sideChatId);
        if (sideChat.isPresent()) {
            return messageRepository.findBySideChatAndIsDeletedFalseOrderByTimestampAsc(sideChat.get());
        }
        return List.of();
    }
    
    @Transactional
    public SideChat createSideChat(Long conversationId, String title, User createdBy) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            SideChat sideChat = new SideChat(conversation, title, createdBy);
            return sideChatRepository.save(sideChat);
        }
        
        return null;
    }
    
    @Transactional
    public boolean deleteSideChat(Long sideChatId) {
        Optional<SideChat> sideChatOpt = sideChatRepository.findById(sideChatId);
        
        if (sideChatOpt.isPresent()) {
            SideChat sideChat = sideChatOpt.get();
            sideChat.setIsDeleted(true);
            sideChatRepository.save(sideChat);
            return true;
        }
        
        return false;
    }
    
    public Long getSideChatMessageCount(Long sideChatId) {
        Optional<SideChat> sideChat = sideChatRepository.findById(sideChatId);
        if (sideChat.isPresent()) {
            return messageRepository.countBySideChatAndIsDeletedFalse(sideChat.get());
        }
        return 0L;
    }
}

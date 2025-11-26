import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import { conversationAPI } from '../../services/api';
import '../css/Chat.css';

function Chat({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sideChats, setSideChats] = useState([]);
  const [selectedSideChat, setSelectedSideChat] = useState(null);
  const [sideChatMessages, setSideChatMessages] = useState([]);
  const [sideChatTitle, setSideChatTitle] = useState('');
  const [showSideChatModal, setShowSideChatModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat, sideChatMessages, selectedSideChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationAPI.getUserConversations(user.id);
      setChatUsers(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await conversationAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchSideChats = async (conversationId) => {
    try {
      const response = await conversationAPI.getSideChats(conversationId);
      setSideChats(response.data);
    } catch (error) {
      console.error('Error fetching side chats:', error);
    }
  };

  const fetchSideChatMessages = async (sideChatId) => {
    try {
      const response = await conversationAPI.getSideChatMessages(sideChatId);
      setSideChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching side chat messages:', error);
    }
  };

  const filteredUsers = chatUsers.filter(chatUser =>
    chatUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (chatUser) => {
    setSelectedChat(chatUser);
    setSelectedSideChat(null);
    fetchMessages(chatUser.id);
    fetchSideChats(chatUser.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const response = await conversationAPI.sendMessage(
        selectedChat.id,
        user.id,
        messageText
      );
      
      setMessages([...messages, {
        ...response.data,
        isOwn: true
      }]);
      setMessageText('');
      
      // Refresh conversations to update last message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    const fileMessage = {
      id: Date.now(),
      sender: 'You',
      text: `📎 ${file.name}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: user.username.charAt(0).toUpperCase(),
      isFile: true,
      fileType: file.type,
      fileName: file.name
    };

    setMessages({
      ...messages,
      [selectedChat.id]: [...(messages[selectedChat.id] || []), fileMessage]
    });
  };

  const handleCreateSideChat = async () => {
    if (!sideChatTitle.trim() || !selectedChat) return;

    try {
      const response = await conversationAPI.createSideChat(
        selectedChat.id,
        sideChatTitle,
        user.id
      );
      
      setSideChats([...sideChats, response.data]);
      setSideChatTitle('');
      setShowSideChatModal(false);
    } catch (error) {
      console.error('Error creating side chat:', error);
      alert('Failed to create side chat');
    }
  };

  const handleSideChatClick = (sideChat) => {
    setSelectedSideChat(sideChat);
    fetchSideChatMessages(sideChat.id);
  };

  const handleCloseSideChat = () => {
    setSelectedSideChat(null);
    setSideChatMessages([]);
  };

  const handleDeleteSideChat = async (sideChatId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this side chat?')) {
      return;
    }

    try {
      await conversationAPI.deleteSideChat(sideChatId);
      setSideChats(sideChats.filter(sc => sc.id !== sideChatId));
      
      if (selectedSideChat?.id === sideChatId) {
        handleCloseSideChat();
      }
    } catch (error) {
      console.error('Error deleting side chat:', error);
      alert('Failed to delete side chat');
    }
  };

  const handleSendSideChatMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedSideChat) return;

    try {
      const response = await conversationAPI.sendSideChatMessage(
        selectedSideChat.id,
        user.id,
        messageText
      );
      
      setSideChatMessages([...sideChatMessages, {
        ...response.data,
        isOwn: true
      }]);
      setMessageText('');
      
      // Update message count
      const updatedSideChats = sideChats.map(sc => 
        sc.id === selectedSideChat.id 
          ? { ...sc, messageCount: sc.messageCount + 1 }
          : sc
      );
      setSideChats(updatedSideChats);
    } catch (error) {
      console.error('Error sending side chat message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} activePage="chat">
      <div className="chat-page-wrapper">
        {/* Left Sidebar - User List */}
        <div className="chat-users-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-sidebar-title">Chats</h2>
          </div>
          
          <div className="search-container">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="chat-user-list">
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading conversations...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No conversations found
              </div>
            ) : (
              filteredUsers.map((chatUser) => (
                <div 
                  key={chatUser.id} 
                  className={`chat-user-item ${selectedChat?.id === chatUser.id ? 'active' : ''}`}
                  onClick={() => handleUserClick(chatUser)}
                >
                  <div className="chat-user-avatar">{chatUser.avatar}</div>
                  <div className="chat-user-info">
                    <div className="chat-user-header">
                      <h3 className="chat-user-name">{chatUser.name}</h3>
                      <span className="chat-user-time">
                        {chatUser.time ? new Date(chatUser.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="chat-user-last-message">{chatUser.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main-area">
          {selectedChat ? (
            <>
              <div className="chat-main-header">
                <div className="chat-header-user">
                  <div className="chat-header-avatar">{selectedChat.avatar}</div>
                  <div className="chat-header-info">
                    <h2 className="chat-header-name">{selectedChat.name}</h2>
                    {isTyping && <span className="typing-indicator">typing...</span>}
                  </div>
                </div>
                <button 
                  className="btn-new-side-chat"
                  onClick={() => setShowSideChatModal(true)}
                  title="Create new side chat"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </button>
              </div>

              <div className="chat-messages-area">
                {(selectedSideChat ? sideChatMessages : messages).map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div key={message.id} className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
                      {!isOwn && <div className="message-avatar">{message.avatar}</div>}
                      <div className="message-content">
                        {!isOwn && <div className="message-sender">{message.sender}</div>}
                        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
                          {message.content}
                        </div>
                        <div className="message-time">
                          {isOwn ? 'You' : message.sender} • {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {isOwn && <div className="message-avatar own">{message.avatar}</div>}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={selectedSideChat ? handleSendSideChatMessage : handleSendMessage}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <button 
                  type="button"
                  className="btn-attach"
                  onClick={() => fileInputRef.current.click()}
                  title="Attach file"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>
                <input
                  type="text"
                  className="chat-message-input"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button type="submit" className="btn-send-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list to start messaging</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Side Chats */}
        {selectedChat && (
          <div className="side-chats-panel">
            <div className="side-chats-header">
              <div className="side-chats-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Side Chats</span>
              </div>
              {selectedSideChat && (
                <button className="btn-close-side-chat" onClick={handleCloseSideChat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {!selectedSideChat ? (
              <div className="side-chats-list">
                {sideChats.map((sideChat) => (
                  <div 
                    key={sideChat.id} 
                    className="side-chat-item"
                    onClick={() => handleSideChatClick(sideChat)}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 className="side-chat-title">{sideChat.title}</h4>
                      <p className="side-chat-count">{sideChat.messageCount} messages</p>
                    </div>
                    <button
                      className="btn-delete-side-chat"
                      onClick={(e) => handleDeleteSideChat(sideChat.id, e)}
                      title="Delete side chat"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button 
                  className="btn-create-side-chat"
                  onClick={() => setShowSideChatModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  New Side Chat
                </button>
              </div>
            ) : (
              <div className="side-chat-view">
                <h3 className="side-chat-view-title">{selectedSideChat.title}</h3>
                <div className="side-chat-messages">
                  {sideChatMessages.length === 0 ? (
                    <p className="side-chat-empty">No messages yet. Start the conversation!</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Side Chat Modal */}
        {showSideChatModal && (
          <div className="modal-overlay" onClick={() => setShowSideChatModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Create New Side Chat</h3>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter side chat topic..."
                value={sideChatTitle}
                onChange={(e) => setSideChatTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn-modal-cancel" onClick={() => setShowSideChatModal(false)}>
                  Cancel
                </button>
                <button className="btn-modal-create" onClick={handleCreateSideChat}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Chat;

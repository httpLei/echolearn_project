import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import '../css/Chat.css';

function Chat({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState({});
  const [sideChats, setSideChats] = useState([]);
  const [selectedSideChat, setSelectedSideChat] = useState(null);
  const [sideChatTitle, setSideChatTitle] = useState('');
  const [showSideChatModal, setShowSideChatModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sample chat users data
  const chatUsers = [
    { id: 1, name: 'Pranz Rabe', lastMessage: 'On the way, ma late lang ko', avatar: 'P', time: '10:30' },
    { id: 2, name: 'Richemmae Bigno', lastMessage: 'Guys unsa inyo gicostume sa rizal', avatar: 'R', time: '10:35' },
    { id: 3, name: 'Maxine Ocampo', lastMessage: 'Wait, mag meeting ta later?', avatar: 'M', time: '09:15' },
    { id: 4, name: 'Lerah Caones', lastMessage: 'Sige, noted! Thanks!', avatar: 'L', time: '08:45' },
    { id: 5, name: 'Erica Dabalos', lastMessage: 'Ilaag nalang nato na', avatar: 'E', time: 'Yesterday' },
    { id: 6, name: 'Clyde Benolirao', lastMessage: 'Na human mo sa activity ni sir?', avatar: 'C', time: 'Yesterday' },
    { id: 7, name: 'Maxine Ocampo', lastMessage: 'Wait, mag meeting ta later?', avatar: 'M', time: '09:15' },
    { id: 8, name: 'Lerah Caones', lastMessage: 'Sige, noted! Thanks!', avatar: 'L', time: '08:45' },
    { id: 9, name: 'Pranz Rabe', lastMessage: 'On the way, ma late lang ko', avatar: 'P', time: '10:30' },
  ];

  // Sample messages for demonstration
  const sampleMessages = {
    1: [
      { id: 1, sender: 'Pranz Rabe', text: 'On the way, ma late lang ko', time: '10:30', isOwn: false, avatar: 'P' },
      { id: 2, sender: 'You', text: 'Sige, no problem!', time: '10:32', isOwn: true, avatar: user.username.charAt(0).toUpperCase() },
    ],
    2: [
      { id: 1, sender: 'Richemmae Bigno', text: 'Guys unsa inyo gicostume sa rizal', time: '10:35', isOwn: false, avatar: 'R' },
      { id: 2, sender: 'You', text: 'Wala pa ko naka decide haha', time: '10:36', isOwn: true, avatar: user.username.charAt(0).toUpperCase() },
    ],
  };

  useEffect(() => {
    // Initialize sample messages
    setMessages(sampleMessages);
    
    // Initialize sample side chats
    setSideChats([
      { id: 1, title: 'Question: Assignment 5', messageCount: 8, chatId: 1 },
      { id: 2, title: 'Meeting Time Discussion', messageCount: 12, chatId: 1 },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const filteredUsers = chatUsers.filter(chatUser =>
    chatUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (chatUser) => {
    setSelectedChat(chatUser);
    if (!messages[chatUser.id]) {
      setMessages({ ...messages, [chatUser.id]: [] });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: user.username.charAt(0).toUpperCase()
    };

    setMessages({
      ...messages,
      [selectedChat.id]: [...(messages[selectedChat.id] || []), newMessage]
    });
    setMessageText('');
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

  const handleCreateSideChat = () => {
    if (!sideChatTitle.trim()) return;

    const newSideChat = {
      id: Date.now(),
      title: sideChatTitle,
      messageCount: 0,
      chatId: selectedChat.id
    };

    setSideChats([...sideChats, newSideChat]);
    setSideChatTitle('');
    setShowSideChatModal(false);
  };

  const handleSideChatClick = (sideChat) => {
    setSelectedSideChat(sideChat);
  };

  const handleCloseSideChat = () => {
    setSelectedSideChat(null);
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
            {filteredUsers.map((chatUser) => (
              <div 
                key={chatUser.id} 
                className={`chat-user-item ${selectedChat?.id === chatUser.id ? 'active' : ''}`}
                onClick={() => handleUserClick(chatUser)}
              >
                <div className="chat-user-avatar">{chatUser.avatar}</div>
                <div className="chat-user-info">
                  <div className="chat-user-header">
                    <h3 className="chat-user-name">{chatUser.name}</h3>
                    <span className="chat-user-time">{chatUser.time}</span>
                  </div>
                  <p className="chat-user-last-message">{chatUser.lastMessage}</p>
                </div>
              </div>
            ))}
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
                {(messages[selectedChat.id] || []).map((message) => (
                  <div key={message.id} className={`message-wrapper ${message.isOwn ? 'own' : 'other'}`}>
                    {!message.isOwn && <div className="message-avatar">{message.avatar}</div>}
                    <div className="message-content">
                      {!message.isOwn && <div className="message-sender">{message.sender}</div>}
                      <div className={`message-bubble ${message.isOwn ? 'own' : 'other'} ${message.isFile ? 'file' : ''}`}>
                        {message.text}
                      </div>
                      <div className="message-time">{message.isOwn ? 'You' : message.sender} • {message.time}</div>
                    </div>
                    {message.isOwn && <div className="message-avatar own">{message.avatar}</div>}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
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
                {sideChats.filter(sc => sc.chatId === selectedChat.id).map((sideChat) => (
                  <div 
                    key={sideChat.id} 
                    className="side-chat-item"
                    onClick={() => handleSideChatClick(sideChat)}
                  >
                    <h4 className="side-chat-title">{sideChat.title}</h4>
                    <p className="side-chat-count">{sideChat.messageCount} messages</p>
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
                  <p className="side-chat-empty">No messages yet. Start the conversation!</p>
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

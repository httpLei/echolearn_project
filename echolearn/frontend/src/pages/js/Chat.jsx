import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import '../css/Chat.css';

function Chat({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample chat users data
  const chatUsers = [
    { id: 1, name: 'Maxine Ocampo', lastMessage: 'Wait, mag meeting ta later?', avatar: 'M' },
    { id: 2, name: 'Lerah Caones', lastMessage: 'Sige, noted! Thanks!', avatar: 'L' },
    { id: 3, name: 'Erica Dabalos', lastMessage: 'Ilaag nalang nato na', avatar: 'E' },
    { id: 4, name: 'Clyde Benolirao', lastMessage: 'Na human mo sa activity ni sir?', avatar: 'C' },
    { id: 5, name: 'Pranz Rabe', lastMessage: 'On the way, ma late lang ko', avatar: 'P' },
    { id: 6, name: 'Richemmae Bigno', lastMessage: 'Guys unsa inyo gicostume sa rizal', avatar: 'R' },
    { id: 7, name: 'Jake Pogi', lastMessage: 'Im pretty good at math and physics', avatar: 'J' },
  ];

  const filteredUsers = chatUsers.filter(chatUser =>
    chatUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout user={user} onLogout={onLogout} activePage="chat">
      <div className="chat-container">
        <h1 className="page-title">Chats</h1>
        
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {filteredUsers.map((chatUser) => (
            <div key={chatUser.id} className="chat-item">
              <div className="chat-avatar">{chatUser.avatar}</div>
              <div className="chat-info">
                <h3 className="chat-name">{chatUser.name}</h3>
                <p className="chat-last-message">{chatUser.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Chat;

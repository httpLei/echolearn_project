import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { notificationAPI } from '../../services/api';
import '../css/Notifications.css';

function Notifications({ user, onLogout }) {
  const [notifications, setNotifications] = useState([
    {
      notifId: 1,
      title: 'Assignment Due Soon',
      message: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
      createdAt: '2025-11-05T08:59:48',
      isRead: false,
      type: 'ASSIGNMENT'
    },
    {
      notifId: 2,
      title: 'New Message',
      message: 'Prof. Amparo replied to your question about the Django',
      createdAt: '2025-11-05T08:59:48',
      isRead: false,
      type: 'MESSAGE'
    },
    {
      notifId: 3,
      title: 'Class Reminder',
      message: 'CSIT340 class starts in 30 minutes',
      createdAt: '2025-11-20T09:30:00',
      isRead: false,
      type: 'ANNOUNCEMENT'
    },
    {
      notifId: 4,
      title: 'Grade Posted',
      message: 'Your Noli Me Tangere Reflection grade has been posted',
      createdAt: '2025-10-05T14:20:00',
      isRead: false,
      type: 'ANNOUNCEMENT'
    }
  ]);

  const [filter, setFilter] = useState('Unread');
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.notifId === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  return (
    <Layout user={user} onLogout={onLogout} activePage="notifications">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1 className="page-title">Notifications</h1>
          <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </button>
        </div>

        <div className="notification-stats">
          <div className="stat-card">
            <div className="stat-icon unread-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Unread</div>
              <div className="stat-value">{unreadCount}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon total-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Total</div>
              <div className="stat-value">{totalCount}</div>
            </div>
          </div>
        </div>

        <div className="notification-tabs">
          <button 
            className={`tab ${filter === 'Unread' ? 'active' : ''}`}
            onClick={() => setFilter('Unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`tab ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All ({totalCount})
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.notifId} 
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-date">{formatDate(notification.createdAt)}</p>
                </div>
                {!notification.isRead && (
                  <button 
                    className="btn-mark-read"
                    onClick={() => handleMarkAsRead(notification.notifId)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;

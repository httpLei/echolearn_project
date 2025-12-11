import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { notificationAPI } from '../../services/api.js';
import '../css/Notifications.css';

function Notifications({ user, onLogout }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Unread');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const menuRef = useRef(null);

  // Fetch notifications from backend with filter
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Always fetch both counts
        const [allResponse, unreadResponse] = await Promise.all([
          notificationAPI.getByUser(user.id),
          notificationAPI.getUnread(user.id)
        ]);
        
        // Update counts
        setTotalCount(allResponse.data.length || 0);
        setUnreadCount(unreadResponse.data.notifications?.length || 0);
        
        // Set displayed notifications based on filter
        if (filter === 'Unread') {
          setNotifications(unreadResponse.data.notifications || []);
        } else {
          setNotifications(allResponse.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user, filter]); // Re-fetch when filter changes

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

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

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read and get navigation info
      const response = await notificationAPI.handleClick(notification.notifId);
      console.log('Notification click response:', response.data);
      const { type, referenceId } = response.data;
      console.log('Type:', type, 'ReferenceId:', referenceId);
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.notifId === notification.notifId ? { ...n, isRead: true } : n
      ));
      
      // Navigate based on notification type
      if (type === 'MESSAGE' && referenceId) {
        console.log('Navigating to chat with conversationId:', referenceId);
        navigate('/chat', { state: { conversationId: referenceId } });
      } else if (type === 'ASSIGNMENT' && referenceId) {
        console.log('Navigating to assignment:', referenceId);
        navigate(`/assignments/${referenceId}`);
      } else if (type === 'POST' && referenceId) {
        console.log('Navigating to class:', referenceId);
        navigate(`/class/${referenceId}`);
      } else if (type === 'REPLY' && referenceId) {
        console.log('Navigating to class from reply:', referenceId);
        navigate(`/class/${referenceId}`);
      } else {
        console.log('No navigation - type or referenceId missing');
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
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

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationAPI.delete(id);
        setNotifications(notifications.filter(n => n.notifId !== id));
        setOpenMenuId(null);
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
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

  // No filtering needed - backend handles it
  const filteredNotifications = notifications;

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

        <div className="notification-filters">
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
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-date">{formatDate(notification.createdAt)}</p>
                </div>
                <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                  {!notification.isRead && (
                    <button 
                      className="btn-mark-read"
                      onClick={() => handleMarkAsRead(notification.notifId)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <div className="notification-menu" ref={openMenuId === notification.notifId ? menuRef : null}>
                    <button 
                      className="btn-menu"
                      onClick={() => toggleMenu(notification.notifId)}
                      title="More options"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                    {openMenuId === notification.notifId && (
                      <div className="menu-dropdown">
                        <button 
                          className="menu-item delete-item"
                          onClick={() => handleDeleteNotification(notification.notifId)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;

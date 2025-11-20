import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Assignment API
export const assignmentAPI = {
  getByUser: (userId) => api.get(`/assignments/user/${userId}`),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (assignment) => api.post('/assignments', assignment),
  update: (id, assignment) => api.put(`/assignments/${id}`, assignment),
  markComplete: (id) => api.put(`/assignments/${id}/complete`),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Notification API
export const notificationAPI = {
  getByUser: (userId) => api.get(`/notifications/user/${userId}`),
  getUnread: (userId) => api.get(`/notifications/user/${userId}/unread`),
  create: (notification) => api.post('/notifications', notification),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/notifications/user/${userId}/read-all`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Chat API
export const chatAPI = {
  getChannelMessages: (channelName) => api.get(`/chats/channel/${channelName}`),
  getSideChats: (chatId) => api.get(`/chats/${chatId}/sidechats`),
  sendMessage: (message) => api.post('/chats', message),
  editMessage: (chatId, content) => api.put(`/chats/${chatId}`, { content }),
  deleteMessage: (chatId) => api.delete(`/chats/${chatId}`),
};

export default api;

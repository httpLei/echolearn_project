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
  getByUser: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.subjectId) queryParams.append('subjectId', params.subjectId);
    if (params.subjectCode) queryParams.append('subjectCode', params.subjectCode);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    
    const queryString = queryParams.toString();
    return api.get(`/assignments/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/assignments/${id}`),
  getBySubject: (subjectId) => api.get(`/assignments/subject/${subjectId}`),
  getBySubjectAndUser: (subjectId, userId) => api.get(`/assignments/subject/${subjectId}/user/${userId}`),
  create: (assignment) => api.post('/assignments', assignment),
  update: (id, assignment) => api.put(`/assignments/${id}`, assignment),
  markComplete: (id) => api.put(`/assignments/${id}/complete`),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (assignmentId, submissionData) => api.post(`/assignments/${assignmentId}/submit`, submissionData),
  unsubmit: (assignmentId, studentId) => api.delete(`/assignments/${assignmentId}/unsubmit?studentId=${studentId}`),
  getSubmission: (assignmentId, studentId) => api.get(`/assignments/${assignmentId}/submission?studentId=${studentId}`),
  getAllSubmissions: (assignmentId) => api.get(`/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId, gradeData) => api.put(`/assignments/submissions/${submissionId}/grade`, gradeData),
  uploadFiles: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return axios.post(`${API_BASE_URL}/assignments/upload-files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  downloadFile: (fileName) => `${API_BASE_URL}/assignments/download/${fileName}`,
};

// Notification API
export const notificationAPI = {
  getByUser: (userId) => api.get(`/notifications/user/${userId}`),
  getUnread: (userId) => api.get(`/notifications/user/${userId}/unread`),
  create: (notification) => api.post('/notifications', notification),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/notifications/user/${userId}/read-all`),
  delete: (id) => api.delete(`/notifications/${id}`),
  handleClick: (id) => api.post(`/notifications/${id}/click`),
};

// Chat API
export const chatAPI = {
  getChannelMessages: (channelName) => api.get(`/chats/channel/${channelName}`),
  getSideChats: (chatId) => api.get(`/chats/${chatId}/sidechats`),
  sendMessage: (message) => api.post('/chats', message),
  editMessage: (chatId, content) => api.put(`/chats/${chatId}`, { content }),
  deleteMessage: (chatId) => api.delete(`/chats/${chatId}`),
};

// User API
export const userAPI = {
  searchUsers: (query, currentUserId) => api.get(`/users/search?query=${query}&currentUserId=${currentUserId}`),
  getAllUsers: (currentUserId) => api.get(`/users/all?currentUserId=${currentUserId}`),
  getCurrentUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
};

// Conversation API
export const conversationAPI = {
  getUserConversations: (userId) => api.get(`/conversations/user/${userId}`),
  startConversation: (user1Id, user2Id) => api.post('/conversations/start', { user1Id, user2Id }),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, senderId, content) => api.post(`/conversations/${conversationId}/messages`, { senderId, content }),
  sendMessageWithFile: (conversationId, senderId, content, file) => {
    const formData = new FormData();
    formData.append('senderId', senderId);
    formData.append('content', content);
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/conversations/${conversationId}/messages/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  editMessage: (messageId, content) => api.put(`/conversations/messages/${messageId}`, { content }),
  deleteMessage: (messageId) => api.delete(`/conversations/messages/${messageId}`),
  deleteConversation: (conversationId) => api.delete(`/conversations/${conversationId}`),
  getSideChats: (conversationId) => api.get(`/conversations/${conversationId}/sidechats`),
  createSideChat: (conversationId, title, createdBy) => api.post(`/conversations/${conversationId}/sidechats`, { title, createdBy }),
  deleteSideChat: (sideChatId) => api.delete(`/conversations/sidechats/${sideChatId}`),
  getSideChatMessages: (sideChatId) => api.get(`/conversations/sidechats/${sideChatId}/messages`),
  sendSideChatMessage: (sideChatId, senderId, content) => api.post(`/conversations/sidechats/${sideChatId}/messages`, { senderId, content }),
};

// Subject API
export const subjectAPI = {
  getAll: (userId, role) => api.get(`/subjects?userId=${userId}&role=${role}`),
  getByTeacher: (teacherId) => api.get(`/subjects/teacher/${teacherId}`),
  getById: (subjectId, userId, role) => api.get(`/subjects/${subjectId}?userId=${userId}&role=${role}`),
  create: (subjectData, teacherId) => api.post(`/subjects?teacherId=${teacherId}`, subjectData),
  update: (subjectId, subjectData, teacherId) => api.put(`/subjects/${subjectId}?teacherId=${teacherId}`, subjectData),
  delete: (subjectId, teacherId) => api.delete(`/subjects/${subjectId}?teacherId=${teacherId}`),
};

// Enrollment API
export const enrollmentAPI = {
  getAvailable: (studentId) => api.get(`/enrollments/available?studentId=${studentId}`),
  getEnrollments: (studentId) => api.get(`/enrollments/student/${studentId}`),
  enroll: (studentId, subjectId) => api.post(`/enrollments?studentId=${studentId}&subjectId=${subjectId}`),
  unenroll: (studentId, subjectId) => api.delete(`/enrollments?studentId=${studentId}&subjectId=${subjectId}`),
};

// Class Post API
export const classPostAPI = {
    getFeed: (subjectId) => api.get(`/classes/${subjectId}/posts`),
    createPost: (subjectId, content, authorId) => api.post(`/classes/${subjectId}/posts`, { content, authorId }),
    getReplies: (subjectId, postId) => api.get(`/classes/${subjectId}/posts/${postId}/replies`),
    createReply: (subjectId, postId, content, authorId) => api.post(`/classes/${subjectId}/posts/${postId}/replies`, { content, authorId }),
    editPost: (subjectId, postId, content) => api.put(`/classes/${subjectId}/posts/${postId}`, { content }),
    deletePost: (subjectId, postId) => api.delete(`/classes/${subjectId}/posts/${postId}`),
    editReply: (subjectId, postId, replyId, content) => api.put(`/classes/${subjectId}/posts/${postId}/replies/${replyId}`, { content }),
    deleteReply: (subjectId, postId, replyId) => api.delete(`/classes/${subjectId}/posts/${postId}/replies/${replyId}`),
  };

export default api;

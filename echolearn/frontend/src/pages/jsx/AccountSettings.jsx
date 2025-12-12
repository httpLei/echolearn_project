import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { userAPI } from '../../services/api';
import '../css/AccountSettings.css';

function AccountSettings({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    id: user?.id || 0,
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || '',
    createdAt: user?.createdAt || null,
  });
  
  // Initialize form data from user prop if available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Fetch current user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCurrentUser(user.id);
      if (response.data) {
        setUserData({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          createdAt: response.data.createdAt,
        });
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      username: userData.username,
      email: userData.email,
      password: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: userData.username,
      email: userData.email,
      password: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // If password is provided, validate it
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    try {
      setLoading(true);
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await userAPI.updateUser(user.id, updateData);
      
      if (response.data) {
        setUserData({
          ...userData,
          username: response.data.username,
          email: response.data.email,
        });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update localStorage with new user data
        const updatedUser = {
          ...user,
          username: response.data.username,
          email: response.data.email,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <Layout user={user} onLogout={onLogout} activePage="account-settings">
      <div className="account-settings-container">
        <div className="account-settings-content">
          {/* Profile Header Section */}
          <div className="profile-header">
            <div className="profile-picture-container">
              <div className="profile-picture">
                {getInitials(userData.username)}
              </div>
              <span className="profile-picture-label">Profile Picture</span>
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-form">
                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  {formData.password && (
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-name">{userData.username || 'FULL NAME HERE'}</div>
                  <div className="profile-role">{userData.role || 'Role_Name'}</div>
                  <button
                    className="edit-profile-btn"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-divider"></div>

          {/* Additional Information Section */}
          <div className="additional-info-section">
            <h2 className="section-title">Additional Information</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">User Id:</span>
                <span className="info-value">{userData.id || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{userData.email || 'emailhere@gmail.com'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Created:</span>
                <span className="info-value">{formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AccountSettings;

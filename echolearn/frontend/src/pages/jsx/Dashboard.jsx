import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { subjectAPI, enrollmentAPI } from '../../services/api.js';
import '../css/Dashboard.css';

const CLASS_COLORS = [
  '#7a9b7e', '#e8a587', '#8b6bb7', '#5983a8', '#c04d4d',
  '#b98198', '#d4c859', '#4a7ba7', '#84b174', '#a67c52',
  '#6b8e23', '#cd5c5c', '#4682b4', '#da70d6', '#20b2aa'
];

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [isEnrolledSubject, setIsEnrolledSubject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    subjectDesc: '',
    subjectSchedule: '',
    subjectCapacity: ''
  });

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      if (user.role === 'STUDENT') {
        const response = await enrollmentAPI.getEnrollments(user.id);
        if (response.data.success) {
          const subjects = response.data.data.map((enrollment, index) => ({
            id: enrollment.subject.subjectId,
            code: enrollment.subject.subjectCode,
            name: enrollment.subject.subjectName,
            color: CLASS_COLORS[index % CLASS_COLORS.length],
            teacher: enrollment.subject.teacherName || enrollment.subject.teacherUsername,
            enrollmentId: enrollment.enrollmentId
          }));
          setClasses(subjects);
        }
      } else {
        const response = await subjectAPI.getAll(user.id, user.role);
        if (response.data.success) {
          const subjects = response.data.data.map((subject, index) => ({
            id: subject.subjectId,
            code: subject.subjectCode,
            name: subject.subjectName,
            color: CLASS_COLORS[index % CLASS_COLORS.length],
            teacher: subject.teacherName || subject.teacherUsername
          }));
          setClasses(subjects);
        }
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSubjects = async () => {
    if (!user || user.role !== 'STUDENT') return;
    
    try {
      setLoading(true);
      const response = await enrollmentAPI.getAvailable(user.id);
      if (response.data.success) {
        setAvailableSubjects(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching available subjects:', err);
      setAvailableSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.subjectName || !formData.subjectCode || !formData.subjectSchedule || !formData.subjectCapacity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isNaN(formData.subjectCapacity) || parseInt(formData.subjectCapacity) <= 0) {
      setError('Capacity must be a positive number');
      setLoading(false);
      return;
    }

    try {
      const subjectData = {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        subjectDesc: formData.subjectDesc || '',
        subjectSchedule: new Date(formData.subjectSchedule).toISOString(),
        subjectCapacity: parseInt(formData.subjectCapacity)
      };

      if (isEditMode && selectedSubject) {
        // Update existing subject
        const response = await subjectAPI.update(selectedSubject.subjectId, subjectData, user.id);
        if (response.data.success) {
          await fetchClasses(); // Refresh the list
          setIsDetailsModalOpen(false);
          setIsEditMode(false);
          setSelectedSubject(null);
          setFormData({
            subjectName: '',
            subjectCode: '',
            subjectDesc: '',
            subjectSchedule: '',
            subjectCapacity: ''
          });
        } else {
          setError(response.data.message || 'Failed to update class');
        }
      } else {
        // Create new subject
        const response = await subjectAPI.create(subjectData, user.id);
        if (response.data.success) {
          // Add new class to the list
          const newSubject = response.data.data;
          const newClass = {
            id: newSubject.subjectId,
            code: newSubject.subjectCode,
            name: newSubject.subjectName,
            color: CLASS_COLORS[classes.length % CLASS_COLORS.length],
            teacher: newSubject.teacherName || newSubject.teacherUsername
          };
          setClasses([newClass, ...classes]);
          setIsModalOpen(false);
          setFormData({
            subjectName: '',
            subjectCode: '',
            subjectDesc: '',
            subjectSchedule: '',
            subjectCapacity: ''
          });
        } else {
          setError(response.data.message || 'Failed to create class');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the class');
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = async (classId) => {
    // NEW: Immediately navigates to the dedicated class page URL.
    navigate(`/class/${classId}`); 
  };

  const handleEnrollClick = async (subjectId) => {
    if (!user || user.role !== 'STUDENT') return;
    
    try {
      setLoading(true);
      const response = await enrollmentAPI.enroll(user.id, subjectId);
      if (response.data.success) {
        // Refresh classes and available subjects
        await fetchClasses();
        await fetchAvailableSubjects();
        setIsEnrollmentModalOpen(false);
        setIsDetailsModalOpen(false);
        setSelectedSubject(null);
        setIsEnrolledSubject(true);
      } else {
        setError(response.data.message || 'Failed to enroll in subject');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while enrolling');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!user || !selectedSubject || user.role !== 'STUDENT') return;
    
    const confirmUnenroll = window.confirm(
      `Are you sure you want to unenroll from "${selectedSubject.subjectName}"?`
    );
    
    if (!confirmUnenroll) return;

    try {
      setLoading(true);
      const response = await enrollmentAPI.unenroll(user.id, selectedSubject.subjectId);
      if (response.data.success) {
        // Refresh classes
        await fetchClasses();
        setIsDetailsModalOpen(false);
        setSelectedSubject(null);
        setIsEnrolledSubject(false);
      } else {
        setError(response.data.message || 'Failed to unenroll from subject');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while unenrolling');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClassesClick = () => {
    setIsEnrollmentModalOpen(true);
    fetchAvailableSubjects();
  };

  const handleAvailableSubjectClick = async (subjectId) => {
    try {
      setLoading(true);
      const response = await subjectAPI.getById(subjectId, user.id, user.role);
      if (response.data.success) {
        setSelectedSubject(response.data.data);
        setIsEnrollmentModalOpen(false);
        setIsDetailsModalOpen(true);
        setIsEnrolledSubject(false);
      }
    } catch (err) {
      console.error('Error fetching subject details:', err);
      setError(err.response?.data?.message || 'Failed to load subject details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (selectedSubject) {
      // Convert ISO date to datetime-local format
      const scheduleDate = new Date(selectedSubject.subjectSchedule);
      const localDateTime = new Date(scheduleDate.getTime() - scheduleDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setFormData({
        subjectName: selectedSubject.subjectName,
        subjectCode: selectedSubject.subjectCode,
        subjectDesc: selectedSubject.subjectDesc || '',
        subjectSchedule: localDateTime,
        subjectCapacity: selectedSubject.subjectCapacity.toString()
      });
      setIsEditMode(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedSubject.subjectName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await subjectAPI.delete(selectedSubject.subjectId, user.id);
      if (response.data.success) {
        // Remove from list
        setClasses(classes.filter(c => c.id !== selectedSubject.subjectId));
        setIsDetailsModalOpen(false);
        setSelectedSubject(null);
      } else {
        setError(response.data.message || 'Failed to delete class');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the class');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTeacher = user && user.role === 'TEACHER';

  return (
    <Layout user={user} onLogout={onLogout} activePage="dashboard">
      <div className="dashboard-container">
        <div className="page-header">
          <h1 className="page-title">My Classes</h1>
          {isTeacher && (
            <button 
              className="create-class-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create Class
            </button>
          )}
          {!isTeacher && user && (
            <button 
              className="create-class-btn"
              onClick={handleBrowseClassesClick}
            >
              Browse Classes
            </button>
          )}
        </div>
        
        {loading && classes.length === 0 ? (
          <div className="loading-message">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="empty-state">
            {isTeacher ? (
              <>
                <p className="empty-message">You haven't created any classes yet.</p>
                <p className="empty-submessage">Click "Create Class" to get started!</p>
              </>
            ) : (
              <>
                <p className="empty-message">No enrolled classes yet.</p>
                <p className="empty-submessage">Enrollment feature coming soon!</p>
              </>
            )}
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div 
                key={classItem.id} 
                className="class-card"
                onClick={() => handleClassClick(classItem.id)}
              >
                <div 
                  className="class-header" 
                  style={{ backgroundColor: classItem.color }}
                ></div>
                <div className="class-body">
                  <h3 className="class-code">{classItem.code}</h3>
                  <p className="class-name">{classItem.name}</p>
                  <p className="class-teacher">{classItem.teacher}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Class Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Class</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="create-class-form">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="subjectName">Subject Name *</label>
                  <input
                    type="text"
                    id="subjectName"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    placeholder="e.g., Information Management"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subjectCode">Subject Code *</label>
                  <input
                    type="text"
                    id="subjectCode"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    placeholder="e.g., CSIT327"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subjectDesc">Subject Description</label>
                  <textarea
                    id="subjectDesc"
                    name="subjectDesc"
                    value={formData.subjectDesc}
                    onChange={handleInputChange}
                    placeholder="Enter subject description..."
                    rows="4"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subjectSchedule">Schedule *</label>
                  <input
                    type="datetime-local"
                    id="subjectSchedule"
                    name="subjectSchedule"
                    value={formData.subjectSchedule}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subjectCapacity">Capacity *</label>
                  <input
                    type="number"
                    id="subjectCapacity"
                    name="subjectCapacity"
                    value={formData.subjectCapacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 30"
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-create"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Browse Classes Modal (Enrollment) */}
        {isEnrollmentModalOpen && (
          <div className="modal-overlay" onClick={() => !loading && setIsEnrollmentModalOpen(false)}>
            <div className="modal-content enrollment-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Browse Available Classes</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setIsEnrollmentModalOpen(false)}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              
              <div className="enrollment-content">
                {error && <div className="error-message">{error}</div>}
                
                {loading && availableSubjects.length === 0 ? (
                  <div className="loading-message">Loading available classes...</div>
                ) : availableSubjects.length === 0 ? (
                  <div className="empty-state">
                    <p className="empty-message">No available classes at the moment.</p>
                  </div>
                ) : (
                  <div className="available-subjects-list">
                    {availableSubjects.map((subject, index) => (
                      <div 
                        key={subject.subjectId} 
                        className="available-subject-card"
                        onClick={() => handleAvailableSubjectClick(subject.subjectId)}
                      >
                        <div 
                          className="subject-card-header" 
                          style={{ backgroundColor: CLASS_COLORS[index % CLASS_COLORS.length] }}
                        ></div>
                        <div className="subject-card-body">
                          <h3 className="subject-card-code">{subject.subjectCode}</h3>
                          <p className="subject-card-name">{subject.subjectName}</p>
                          <p className="subject-card-teacher">{subject.teacherName || subject.teacherUsername}</p>
                          <p className="subject-card-capacity">
                            {subject.enrolledStudents || 0} / {subject.subjectCapacity} students
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subject Details Modal */}
        {isDetailsModalOpen && selectedSubject && (
          <div className="modal-overlay" onClick={() => !loading && !isEditMode && setIsDetailsModalOpen(false)}>
            <div className="modal-content subject-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{isEditMode ? 'Edit Class' : 'Class Details'}</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsEditMode(false);
                    setSelectedSubject(null);
                    setFormData({
                      subjectName: '',
                      subjectCode: '',
                      subjectDesc: '',
                      subjectSchedule: '',
                      subjectCapacity: ''
                    });
                  }}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              
              {isEditMode ? (
                <form onSubmit={handleSubmit} className="create-class-form">
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="edit-subjectName">Subject Name *</label>
                    <input
                      type="text"
                      id="edit-subjectName"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-subjectCode">Subject Code *</label>
                    <input
                      type="text"
                      id="edit-subjectCode"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-subjectDesc">Subject Description</label>
                    <textarea
                      id="edit-subjectDesc"
                      name="subjectDesc"
                      value={formData.subjectDesc}
                      onChange={handleInputChange}
                      rows="4"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-subjectSchedule">Schedule *</label>
                    <input
                      type="datetime-local"
                      id="edit-subjectSchedule"
                      name="subjectSchedule"
                      value={formData.subjectSchedule}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-subjectCapacity">Capacity *</label>
                    <input
                      type="number"
                      id="edit-subjectCapacity"
                      name="subjectCapacity"
                      value={formData.subjectCapacity}
                      onChange={handleInputChange}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsEditMode(false);
                        setFormData({
                          subjectName: '',
                          subjectCode: '',
                          subjectDesc: '',
                          subjectSchedule: '',
                          subjectCapacity: ''
                        });
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-create"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="subject-details-content">
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="detail-section">
                    <div className="detail-item">
                      <label>Subject Code</label>
                      <p>{selectedSubject.subjectCode}</p>
                    </div>
                    
                    <div className="detail-item">
                      <label>Subject Name</label>
                      <p>{selectedSubject.subjectName}</p>
                    </div>
                    
                    {selectedSubject.subjectDesc && (
                      <div className="detail-item">
                        <label>Description</label>
                        <p>{selectedSubject.subjectDesc}</p>
                      </div>
                    )}
                    
                    <div className="detail-item">
                      <label>Schedule</label>
                      <p>{formatDateTime(selectedSubject.subjectSchedule)}</p>
                    </div>
                    
                    <div className="detail-item">
                      <label>Capacity</label>
                      <p>{selectedSubject.subjectCapacity} students</p>
                    </div>
                    
                    <div className="detail-item">
                      <label>Enrolled Students</label>
                      <p>{selectedSubject.enrolledStudents || 0} students</p>
                    </div>
                    
                    <div className="detail-item">
                      <label>Teacher</label>
                      <p>{selectedSubject.teacherName || selectedSubject.teacherUsername}</p>
                    </div>
                    
                    {selectedSubject.createdAt && (
                      <div className="detail-item">
                        <label>Created</label>
                        <p>{formatDateTime(selectedSubject.createdAt)}</p>
                      </div>
                    )}
                  </div>

                  {isTeacher && selectedSubject.teacherId === user.id && (
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={handleEdit}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                  
                  {!isTeacher && user && (
                    <div className="modal-actions">
                      {isEnrolledSubject ? (
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={handleUnenroll}
                          disabled={loading}
                        >
                          {loading ? 'Unenrolling...' : 'Un-enroll'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-create"
                          onClick={() => handleEnrollClick(selectedSubject.subjectId)}
                          disabled={loading}
                        >
                          {loading ? 'Enrolling...' : 'Enroll'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;

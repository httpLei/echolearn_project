import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI } from '../../services/api.js';
import '../css/AssignmentDetail.css';

function AssignmentDetail({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [originalAssignment, setOriginalAssignment] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editFiles, setEditFiles] = useState([]);
  const [editFileObjects, setEditFileObjects] = useState([]);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedTime: '',
    difficulty: 'MEDIUM',
    allowLateSubmission: true,
    maxPoints: 100
  });

  useEffect(() => {
    if (id && user) {
      fetchAssignment();
    }
  }, [id, user]);

  const fetchAssignment = async () => {
    try {
      const response = await assignmentAPI.getById(id);
      const assignmentData = response.data;
      
      // Store original assignment data (with Subject object intact)
      setOriginalAssignment(assignmentData);
      
      console.log('Assignment fileNames:', assignmentData.fileNames);
      
      // Format the assignment data for display
      const formattedAssignment = {
        ...assignmentData,
        subject: assignmentData.subject?.subjectCode || 'N/A',
        professor: assignmentData.subject?.teacher?.username || assignmentData.subject?.teacher?.name || 'Unknown',
        points: assignmentData.maxPoints || 100, // Use maxPoints from backend, default to 100 if not set
        allowLateSubmission: assignmentData.allowLateSubmission !== null ? assignmentData.allowLateSubmission : true,
        attachments: assignmentData.fileNames ? assignmentData.fileNames.split(',').filter(f => f.trim()) : []
      };
      
      console.log('Formatted attachments:', formattedAssignment.attachments);
      
      setAssignment(formattedAssignment);
      
      // Initialize edit form
      setEditForm({
        title: assignmentData.title || '',
        description: assignmentData.description || '',
        dueDate: assignmentData.dueDate || '',
        estimatedTime: assignmentData.estimatedTime || '',
        difficulty: assignmentData.difficulty || 'MEDIUM',
        allowLateSubmission: assignmentData.allowLateSubmission !== null ? assignmentData.allowLateSubmission : true,
        maxPoints: assignmentData.maxPoints || 100
      });
      
      // Initialize edit files with existing attachments
      if (assignmentData.fileNames) {
        const existingFiles = assignmentData.fileNames.split(',').filter(f => f.trim());
        setEditFiles(existingFiles);
      }
      
      // If teacher, fetch all submissions
      if (user.role === 'TEACHER') {
        try {
          const submissionsResponse = await assignmentAPI.getAllSubmissions(id);
          setSubmissions(submissionsResponse.data);
        } catch (error) {
          console.error('Error fetching submissions:', error);
        }
      }
      
      // Fetch submission if assignment is completed and user is student
      if (assignmentData.completed && user && user.role === 'STUDENT') {
        try {
          const submissionResponse = await assignmentAPI.getSubmission(id, user.id);
          const submissionData = submissionResponse.data;
          setSubmission({
            ...submissionData,
            fileNames: submissionData.fileNames ? submissionData.fileNames.split(',') : [],
            text: submissionData.submissionText || ''
          });
          // Also populate the form fields for editing
          setSubmissionText(submissionData.submissionText || '');
        } catch (error) {
          console.error('Error fetching submission:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      navigate('/assignments');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare file names as comma-separated string
      const fileNames = selectedFiles.map(f => f.name).join(',');
      
      // Submit assignment to backend
      const submissionData = {
        studentId: user.id,
        submissionText: submissionText,
        fileNames: fileNames
      };
      
      await assignmentAPI.submit(id, submissionData);
      
      alert('Assignment submitted successfully!');
      
      // Clear form
      setSelectedFiles([]);
      setSubmissionText('');
      
      // Refresh to show updated state
      await fetchAssignment();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      if (error.response?.status === 409) {
        alert('Assignment already submitted. Please unsubmit first to edit.');
      } else {
        alert('Failed to submit assignment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUnsubmit = async () => {
    if (!window.confirm('Are you sure you want to unsubmit this assignment? You can edit and resubmit it.')) {
      return;
    }
    
    try {
      await assignmentAPI.unsubmit(id, user.id);
      
      // Clear submission state
      setSubmission(null);
      
      alert('Assignment unsubmitted successfully. You can now edit and resubmit.');
      
      // Refresh to show updated state
      await fetchAssignment();
    } catch (error) {
      console.error('Error unsubmitting assignment:', error);
      alert('Failed to unsubmit assignment. Please try again.');
    }
  };
  const handleUpdateAssignment = async () => {
    try {
      let uploadedFileNames = '';
      
      // Upload new files first if any
      if (editFileObjects.length > 0) {
        const uploadResponse = await assignmentAPI.uploadFiles(editFileObjects);
        uploadedFileNames = uploadResponse.data.fileNames;
      }
      
      // Combine existing files and new uploaded files
      const allFileNames = [...editFiles, ...(uploadedFileNames ? uploadedFileNames.split(',') : [])].join(',');
      
      const updatedAssignment = {
        ...originalAssignment,
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.dueDate,
        estimatedTime: parseInt(editForm.estimatedTime),
        difficulty: editForm.difficulty,
        fileNames: allFileNames || null,
        allowLateSubmission: editForm.allowLateSubmission,
        maxPoints: parseInt(editForm.maxPoints)
      };
      
      await assignmentAPI.update(id, updatedAssignment);
      
      alert('Assignment updated successfully!');
      setIsEditMode(false);
      setEditFileObjects([]);
      
      // Refresh assignment data
      await fetchAssignment();
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment. Please try again.');
    }
  };

  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setEditFileObjects([...editFileObjects, ...files]);
  };

  const handleRemoveEditFile = (index) => {
    const isExistingFile = index < editFiles.length;
    if (isExistingFile) {
      setEditFiles(editFiles.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - editFiles.length;
      setEditFileObjects(editFileObjects.filter((_, i) => i !== newFileIndex));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isOverdue = () => {
    if (!assignment) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(assignment.dueDate) < today;
  };

  if (!assignment) {
    return (
      <Layout user={user} onLogout={onLogout} activePage="assignments">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout} activePage="assignments">
      <div className="assignment-detail-container">
        <button className="btn-back" onClick={() => navigate('/assignments')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Assignments
        </button>

        <div className="detail-header">
          <div className="header-left">
            <h1 className="detail-assignment-title">{assignment.title}</h1>
            <div className="assignment-meta">
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {assignment.professor}
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Due: {formatDate(assignment.dueDate)}
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {assignment.estimatedTime} minutes
              </span>
              <span className="subject-tag">{assignment.subject}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="points-badge">
              <div className="points-value">{assignment.points}</div>
              <div className="points-label">Points</div>
            </div>
            <span className={`difficulty-badge difficulty-${assignment.difficulty.toLowerCase()}`}>
              {assignment.difficulty}
            </span>
          </div>
        </div>

        {isOverdue() && !submission && (
          <div className="alert-banner overdue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l7 13H5l7-13z"></path>
              <path d="M11 11h2v5h-2z"></path>
              <circle cx="12" cy="18" r="1"></circle>
            </svg>
            <span>This assignment is overdue</span>
          </div>
        )}

        {submission && (
          <div className="alert-banner success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Submitted on {formatDate(submission.submittedAt)}</span>
          </div>
        )}

        <div className="detail-content">
          <div className="main-column">
            <div className="section-card">
              <h2 className="section-title">Description</h2>
              <p className="description-text">{assignment.description}</p>
            </div>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="section-card">
                <h2 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  Attachments
                </h2>
                <div className="attachments-list">
                  {assignment.attachments.map((fileName, index) => (
                    <a 
                      key={index} 
                      href={assignmentAPI.downloadFile(fileName)} 
                      download
                      className="attachment-item"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <div className="attachment-info">
                        <div className="attachment-name">{fileName}</div>
                        <div className="attachment-action">Click to download</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="section-card submission-section">
              <h2 className="section-title">
                {user.role === 'TEACHER' ? 'Student Submissions' : 'Your Work'}
              </h2>
              
              {user.role === 'TEACHER' ? (
                // Teacher view: Show all submissions
                <div className="teacher-view">
                  <div className="submissions-list">
                    <div className="submissions-count">
                      <div className="info-label">Submissions</div>
                      <div className="info-value">{submissions.length}</div>
                    </div>
                    {submissions.length === 0 ? (
                      <p className="no-submissions">No submissions yet</p>
                    ) : (
                      <div className="submissions-grid">
                        {submissions.map((sub) => (
                          <div key={sub.submissionId} className="submission-card">
                            <div className="submission-header">
                              <div className="student-info">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <strong>{sub.student?.username || 'Student'}</strong>
                              </div>
                              <div className="submission-date">
                                {formatDate(sub.submittedAt)}
                              </div>
                            </div>
                            
                            {sub.fileNames && (
                              <div className="submission-files">
                                <h4>Files:</h4>
                                {sub.fileNames.split(',').map((fileName, idx) => (
                                  <div key={idx} className="file-badge">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                      <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                    {fileName}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {sub.submissionText && (
                              <div className="submission-content">
                                <h4>Comments:</h4>
                                <p>{sub.submissionText}</p>
                              </div>
                            )}
                            
                            <div className="submission-status-badge">
                              {sub.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Student view: Original submission form
                submission ? (
                <div className="submission-complete">
                  <div className="submission-status">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3>Turned in</h3>
                    <p>Submitted on {formatDate(submission.submittedAt)}</p>
                  </div>
                  
                  {(submission.files?.length > 0 || submission.fileNames?.length > 0) && (
                    <div className="submitted-files">
                      <h4>Submitted Files:</h4>
                      {(submission.fileNames || submission.files.map(f => f.name)).map((fileName, index) => (
                        <div key={index} className="submitted-file-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span>{fileName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {submission.text && (
                    <div className="submitted-text">
                      <h4>Comments:</h4>
                      <p>{submission.text}</p>
                    </div>
                  )}
                  
                  <button className="btn-secondary" onClick={handleUnsubmit}>
                    Unsubmit and Edit
                  </button>
                </div>
              ) : (
                <div className="submission-form">
                  <div className="form-group">
                    <label>Add or create work</label>
                    <textarea
                      className="submission-textarea"
                      placeholder="Add a comment or paste links to your work (e.g., GitHub repository URL)..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Attach files</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="file-input"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-input" className="file-upload-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Choose files
                      </label>
                      <span className="file-upload-hint">or drag and drop files here</span>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="selected-files">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="file-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                            <button 
                              className="btn-remove-file"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="submission-actions">
                    <button 
                      className="btn-submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting || (selectedFiles.length === 0 && !submissionText.trim())}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => navigate('/assignments')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
              )}
            </div>
          </div>

          <div className="sidebar-column">
            <div className="info-card">
              <h3>Assignment Details</h3>
              <div className="info-item">
                <div className="info-label">Status</div>
                <div className={`info-value status ${submission ? 'submitted' : isOverdue() ? 'overdue' : 'assigned'}`}>
                  {submission ? 'Turned in' : isOverdue() ? 'Overdue' : 'Assigned'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Due Date</div>
                <div className="info-value">{formatDate(assignment.dueDate)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Points</div>
                <div className="info-value">{assignment.points} points</div>
              </div>
              <div className="info-item">
                <div className="info-label">Estimated Time</div>
                <div className="info-value">{assignment.estimatedTime} minutes</div>
              </div>
              <div className="info-item">
                <div className="info-label">Late Submission</div>
                <div className="info-value">{assignment.allowLateSubmission ? 'Allowed' : 'Not allowed'}</div>
              </div>
              {user.role === 'TEACHER' && (
                <button 
                  className="btn-edit-assignment"
                  onClick={() => setIsEditMode(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Assignment
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Edit Assignment Modal */}
        {isEditMode && user.role === 'TEACHER' && (
          <div className="modal-overlay" onClick={() => setIsEditMode(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Assignment</h2>
                <button className="modal-close" onClick={() => setIsEditMode(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-textarea"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="4"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Maximum Points</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.maxPoints}
                      onChange={(e) => setEditForm({...editForm, maxPoints: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Time (minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.estimatedTime}
                      onChange={(e) => setEditForm({...editForm, estimatedTime: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      className="form-select"
                      value={editForm.difficulty}
                      onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Late Submission</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editForm.allowLateSubmission}
                        onChange={(e) => setEditForm({...editForm, allowLateSubmission: e.target.checked})}
                      />
                      <span>Allow students to submit after due date</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Attach Files (Optional)</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="edit-file-upload"
                      multiple
                      onChange={handleEditFileSelect}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="edit-file-upload" className="file-upload-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Add Files
                    </label>
                    {(editFiles.length > 0 || editFileObjects.length > 0) && (
                      <div className="selected-files-list">
                        {editFiles.map((fileName, index) => (
                          <div key={`existing-${index}`} className="file-item">
                            <span className="file-name">{fileName}</span>
                            <button
                              type="button"
                              className="btn-remove-file"
                              onClick={() => handleRemoveEditFile(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {editFileObjects.map((file, index) => (
                          <div key={`new-${index}`} className="file-item">
                            <span className="file-name">{file.name} (new)</span>
                            <button
                              type="button"
                              className="btn-remove-file"
                              onClick={() => handleRemoveEditFile(editFiles.length + index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleUpdateAssignment}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AssignmentDetail;

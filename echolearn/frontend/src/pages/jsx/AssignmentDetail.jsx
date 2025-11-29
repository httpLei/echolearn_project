import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI } from '../../services/api.js';
import '../css/AssignmentDetail.css';

function AssignmentDetail({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (id && user) {
      fetchAssignment();
    }
  }, [id, user]);

  const fetchAssignment = async () => {
    try {
      const response = await assignmentAPI.getById(id);
      const assignmentData = response.data;
      
      // Format the assignment data
      const formattedAssignment = {
        ...assignmentData,
        subject: assignmentData.subject?.subjectCode || 'N/A',
        professor: assignmentData.subject?.teacherUsername || 'Unknown',
        points: 100, // Default points, you can add this to backend
        allowLateSubmission: true, // Default, you can add this to backend
        attachments: [] // You can add file attachments to backend
      };
      
      setAssignment(formattedAssignment);
      
      // Check if already submitted (completed)
      if (assignmentData.completed) {
        setSubmission({
          submittedAt: assignmentData.createdAt,
          status: 'Submitted'
        });
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
      // Mark assignment as complete in backend
      await assignmentAPI.markComplete(id);
      
      const newSubmission = {
        submittedAt: new Date().toISOString(),
        files: selectedFiles,
        text: submissionText,
        status: 'Submitted'
      };
      
      setSubmission(newSubmission);
      
      // Update local assignment state
      setAssignment(prev => ({ ...prev, completed: true }));
      
      alert('Assignment submitted successfully!');
      
      // Refresh to show updated state
      fetchAssignment();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
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

            <div className="section-card">
              <h2 className="section-title">Instructions</h2>
              <div className="instructions-text">
                {assignment.description}
              </div>
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
                  {assignment.attachments.map((file, index) => (
                    <a key={index} href={file.url} className="attachment-item" download>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <div className="attachment-info">
                        <div className="attachment-name">{file.name}</div>
                        <div className="attachment-size">{file.size}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="section-card submission-section">
              <h2 className="section-title">Your Work</h2>
              
              {submission ? (
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
                  
                  <button className="btn-secondary" onClick={() => {
                    setSubmission(null);
                    setSubmissionText('');
                    setSelectedFiles([]);
                    // Remove from localStorage - completed assignments
                    const completedAssignments = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
                    const updatedCompleted = completedAssignments.filter(aid => aid !== parseInt(id));
                    localStorage.setItem('completedAssignments', JSON.stringify(updatedCompleted));
                    
                    // Remove submission details
                    const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
                    delete submissions[id];
                    localStorage.setItem('submissions', JSON.stringify(submissions));
                  }}>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AssignmentDetail;

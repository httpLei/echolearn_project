import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI } from '../../services/api';
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
    // Mock assignment data - matches the assignments from Assignments.js
    const allAssignments = [
      {
        activityId: 1,
        title: 'Familiarizing GIT and Python Django',
        description: 'To familiarize yourself with Git version control processes and Python Django framework through the creation of two distinct projects, each in its own public repository.',
        instructions: `Complete the following tasks:

1. Create a new Git repository for your Django project
2. Initialize a Django project with proper structure
3. Create at least 3 models with relationships
4. Implement CRUD operations for all models
5. Add proper documentation in your README.md
6. Push all changes to your public repository

Submission Requirements:
- Submit the GitHub repository URL
- Include screenshots of your working application
- Write a brief summary of what you learned (minimum 200 words)`,
        dueDate: '2025-10-06',
        estimatedTime: 180,
        subject: 'CSIT327',
        difficulty: 'Hard',
        points: 100,
        professor: 'Joemarie C. Amparo',
        completed: false,
        allowLateSubmission: true,
        attachments: [
          { name: 'Django_Tutorial.pdf', size: '2.4 MB', url: '#' },
          { name: 'Git_Commands.pdf', size: '1.1 MB', url: '#' }
        ]
      },
      {
        activityId: 2,
        title: 'Data Visualization',
        description: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
        instructions: `Assignment Requirements:

1. Create pivot tables with properly labeled headers
2. Generate charts for each pivot table
3. Organize all charts in a single DASHBOARD sheet
4. Use appropriate chart types for the data
5. Ensure all labels are clear and readable

Submission Requirements:
- Submit your Excel file (.xlsx format)
- Include at least 3 different pivot tables
- Each pivot table must have a corresponding chart
- Dashboard must be well-organized and professional`,
        dueDate: '2025-11-30',
        estimatedTime: 120,
        subject: 'IT365',
        difficulty: 'Medium',
        points: 75,
        professor: 'Joemarie C. Amparo',
        completed: false,
        allowLateSubmission: true,
        attachments: [
          { name: 'Sample_Data.xlsx', size: '856 KB', url: '#' }
        ]
      },
      {
        activityId: 3,
        title: 'Project ERD Design',
        description: 'Design a comprehensive Entity-Relationship Diagram (ERD) for your capstone project database schema.',
        instructions: `ERD Requirements:

1. Identify all entities (minimum 8 entities required)
2. Define attributes for each entity with appropriate data types
3. Establish relationships between entities (one-to-one, one-to-many, many-to-many)
4. Specify primary keys and foreign keys
5. Include cardinality and participation constraints
6. Apply normalization rules (at least 3NF)
7. Document business rules and assumptions

Deliverables:
- ERD diagram using proper notation (Crow's Foot or Chen notation)
- Data dictionary with all entities, attributes, and data types
- Written explanation of relationships and constraints (300-500 words)
- Normalization justification document

Tools:
- Use any ERD tool (Draw.io, Lucidchart, MySQL Workbench, etc.)
- Submit as PDF with clear, readable diagrams
- Include entity names in UPPERCASE and attributes in lowercase`,
        dueDate: '2025-11-23',
        estimatedTime: 90,
        subject: 'CSIT340',
        difficulty: 'Medium',
        points: 80,
        professor: 'Eugene C. Busico',
        completed: false,
        allowLateSubmission: true,
        attachments: [
          { name: 'ERD_Guidelines.pdf', size: '1.8 MB', url: '#' },
          { name: 'Sample_ERD.pdf', size: '945 KB', url: '#' }
        ]
      },
      {
        activityId: 4,
        title: 'Sprint 2 Progress Report',
        description: 'Prepare a short report summarizing your team\'s accomplishments, blockers, and next sprint goals.',
        instructions: `Report Structure:

1. Executive Summary (1 paragraph)
2. Accomplishments (bullet points with details)
3. Current Blockers (describe issues and impact)
4. Solutions Implemented or Proposed
5. Next Sprint Goals (specific and measurable)
6. Team Member Contributions

Format Requirements:
- Maximum 2 pages
- Use professional formatting
- Include relevant screenshots or diagrams
- Submit as PDF`,
        dueDate: '2025-10-04',
        estimatedTime: 30,
        subject: 'IT317',
        difficulty: 'Easy',
        points: 50,
        professor: 'Joemarie C. Amparo',
        completed: false,
        allowLateSubmission: false,
        attachments: [
          { name: 'Report_Template.docx', size: '324 KB', url: '#' }
        ]
      },
      {
        activityId: 5,
        title: 'Noli Me Tangere Reflection Essay',
        description: 'Write a reflection paper discussing the relevance of Noli Me Tangere in today\'s society.',
        instructions: `Essay Requirements:

1. Introduction: Brief overview of Noli Me Tangere
2. Historical Context: Describe the time period and significance
3. Main Themes: Analyze key themes in the novel
4. Modern Relevance: Connect themes to contemporary issues
5. Personal Reflection: Your insights and takeaways
6. Conclusion: Summarize your main points

Format:
- Minimum 500 words, maximum 800 words
- Use MLA or APA format
- Include at least 3 citations
- Submit as PDF or DOCX`,
        dueDate: '2025-11-15',
        estimatedTime: 60,
        subject: 'RIZAL031',
        difficulty: 'Easy',
        points: 60,
        professor: 'Joemarie C. Amparo',
        completed: false,
        allowLateSubmission: true,
        attachments: [
          { name: 'Noli_Me_Tangere_Summary.pdf', size: '2.1 MB', url: '#' },
          { name: 'Essay_Rubric.pdf', size: '445 KB', url: '#' }
        ]
      },
      {
        activityId: 6,
        title: 'Linear Regression Activity',
        description: 'Apply linear regression techniques to analyze and predict data patterns using Python',
        instructions: `Activity Requirements:

1. Load and explore the provided dataset
2. Perform data preprocessing and cleaning
3. Implement linear regression using scikit-learn
4. Calculate R-squared score and other metrics
5. Create visualizations showing:
   - Scatter plot of actual vs predicted values
   - Residual plot
   - Regression line
6. Interpret your results and findings

Submission Requirements:
- Jupyter Notebook (.ipynb) with code and markdown explanations
- Include all visualizations
- Write a summary of your findings (minimum 300 words)
- Submit the dataset used (if not the provided one)

Grading Criteria:
- Code correctness and efficiency (40%)
- Visualizations quality (30%)
- Analysis and interpretation (20%)
- Documentation and clarity (10%)`,
        dueDate: '2025-11-15',
        estimatedTime: 150,
        subject: 'IT365',
        difficulty: 'Medium',
        points: 85,
        professor: 'Joemarie C. Amparo',
        completed: false,
        allowLateSubmission: true,
        attachments: [
          { name: 'Dataset.csv', size: '1.2 MB', url: '#' },
          { name: 'Linear_Regression_Guide.pdf', size: '3.5 MB', url: '#' }
        ]
      }
    ];

    // Find the assignment that matches the ID
    const foundAssignment = allAssignments.find(a => a.activityId === parseInt(id));
    
    if (foundAssignment) {
      setAssignment(foundAssignment);
      
      // Check if assignment is completed and load submission data
      const completedAssignments = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
      if (completedAssignments.includes(parseInt(id))) {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
        const savedSubmission = submissions[id];
        if (savedSubmission) {
          setSubmission(savedSubmission);
          setSubmissionText(savedSubmission.text || '');
        }
      }
    } else {
      // If assignment not found, redirect back to assignments page
      navigate('/assignments');
    }
  }, [id, navigate]);

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
      // Mock submission - replace with actual API call
      const newSubmission = {
        submittedAt: new Date().toISOString(),
        files: selectedFiles,
        text: submissionText,
        status: 'Submitted'
      };
      
      setSubmission(newSubmission);
      
      // Save to localStorage - completed assignments
      const completedAssignments = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
      if (!completedAssignments.includes(parseInt(id))) {
        completedAssignments.push(parseInt(id));
        localStorage.setItem('completedAssignments', JSON.stringify(completedAssignments));
      }
      
      // Save submission details
      const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
      submissions[id] = {
        submittedAt: newSubmission.submittedAt,
        text: submissionText,
        fileNames: selectedFiles.map(f => f.name),
        status: 'Submitted'
      };
      localStorage.setItem('submissions', JSON.stringify(submissions));
      
      alert('Assignment submitted successfully!');
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
                {assignment.instructions.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
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

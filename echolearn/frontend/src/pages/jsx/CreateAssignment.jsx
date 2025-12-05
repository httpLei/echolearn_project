import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI, subjectAPI } from '../../services/api.js';
import '../css/CreateAssignment.css';

function CreateAssignment({ user, onLogout }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedTime: 60,
    difficulty: 'MEDIUM',
    subjectId: '',
    allowLateSubmission: true
  });

  useEffect(() => {
    if (user && user.role === 'TEACHER') {
      fetchTeacherSubjects();
    }
  }, [user]);

  const fetchTeacherSubjects = async () => {
    try {
      const response = await subjectAPI.getByTeacher(user.id);
      const subjectsData = response.data.data || response.data;
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let uploadedFileNames = '';
      
      // Upload files first if any selected
      if (selectedFiles.length > 0) {
        const uploadResponse = await assignmentAPI.uploadFiles(selectedFiles);
        uploadedFileNames = uploadResponse.data.fileNames;
      }
      
      const assignmentData = {
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        estimatedTime: parseInt(newAssignment.estimatedTime),
        difficulty: newAssignment.difficulty,
        subject: { subjectId: parseInt(newAssignment.subjectId) },
        user: null, // Teacher-created assignments are for all students
        completed: false,
        fileNames: uploadedFileNames || null,
        allowLateSubmission: newAssignment.allowLateSubmission
      };
      
      await assignmentAPI.create(assignmentData);
      alert('Assignment created successfully!');
      navigate('/assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate('/assignments');
  };

  return (
    <Layout user={user} onLogout={onLogout} activePage="assignments">
      <div className="create-assignment-container">
        <div className="create-assignment-header">
          <h1>Create New Assignment</h1>
          <button className="btn-back" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Assignments
          </button>
        </div>

        <div className="create-assignment-form-wrapper">
          <form onSubmit={handleCreateAssignment} className="assignment-form">
            <div className="form-group">
              <label>Subject *</label>
              <select
                value={newAssignment.subjectId}
                onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectCode} - {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                required
                placeholder="Assignment title"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                rows="6"
                placeholder="Describe the assignment requirements, instructions, and any additional information..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={newAssignment.estimatedTime}
                  onChange={(e) => setNewAssignment({ ...newAssignment, estimatedTime: e.target.value })}
                  min="1"
                  placeholder="60"
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={newAssignment.difficulty}
                  onChange={(e) => setNewAssignment({ ...newAssignment, difficulty: e.target.value })}
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
                    checked={newAssignment.allowLateSubmission}
                    onChange={(e) => setNewAssignment({ ...newAssignment, allowLateSubmission: e.target.checked })}
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
                  id="file-upload"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choose Files
                </label>
                {selectedFiles.length > 0 && (
                  <div className="selected-files-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="btn-remove-file"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAssignment;

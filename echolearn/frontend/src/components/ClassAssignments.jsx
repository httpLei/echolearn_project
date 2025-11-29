import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentAPI } from '../services/api.js';
import './ClassAssignments.css';

function ClassAssignments({ user, subjectId, subjectCode }) {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        dueDate: '',
        estimatedTime: 60,
        difficulty: 'MEDIUM'
    });

    useEffect(() => {
        if (subjectId) {
            fetchAssignments();
        }
    }, [subjectId, user]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            let response;
            if (user.role === 'TEACHER') {
                response = await assignmentAPI.getBySubject(subjectId);
            } else {
                response = await assignmentAPI.getBySubjectAndUser(subjectId, user.id);
            }
            setAssignments(response.data);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const assignmentData = {
                ...newAssignment,
                subject: { subjectId: parseInt(subjectId) },
                user: null, // Teacher-created assignments are for all students
                completed: false
            };
            
            await assignmentAPI.create(assignmentData);
            
            setShowCreateModal(false);
            setNewAssignment({
                title: '',
                description: '',
                dueDate: '',
                estimatedTime: 60,
                difficulty: 'MEDIUM'
            });
            
            fetchAssignments();
        } catch (err) {
            console.error('Error creating assignment:', err);
            alert('Failed to create assignment');
        }
    };

    const handleMarkComplete = async (assignmentId) => {
        try {
            await assignmentAPI.markComplete(assignmentId);
            fetchAssignments();
        } catch (err) {
            console.error('Error marking assignment complete:', err);
            alert('Failed to update assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;
        
        try {
            await assignmentAPI.delete(assignmentId);
            fetchAssignments();
        } catch (err) {
            console.error('Error deleting assignment:', err);
            alert('Failed to delete assignment');
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return '#4CAF50';
            case 'MEDIUM': return '#FFB266';
            case 'HARD': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `${diffDays} days left`;
    };

    if (loading) {
        return <div className="class-assignments-loading">Loading assignments...</div>;
    }

    if (error) {
        return <div className="class-assignments-error">{error}</div>;
    }

    return (
        <div className="class-assignments-container">
            <div className="class-assignments-header">
                <h2>Assignments for {subjectCode}</h2>
                {user.role === 'TEACHER' && (
                    <button className="btn-create-assignment" onClick={() => setShowCreateModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create Assignment
                    </button>
                )}
            </div>

            {assignments.length === 0 ? (
                <div className="no-assignments">
                    <p>No assignments yet</p>
                    {user.role === 'TEACHER' && <p>Create an assignment to get started!</p>}
                </div>
            ) : (
                <div className="assignments-list">
                    {assignments.map((assignment) => (
                        <div key={assignment.activityId} className={`assignment-card ${assignment.completed ? 'completed' : ''}`}>
                            <div className="assignment-main">
                                <div className="assignment-info">
                                    <h3 className="assignment-title">{assignment.title}</h3>
                                    <p className="assignment-description">{assignment.description}</p>
                                    
                                    <div className="assignment-meta">
                                        <span className="meta-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            {formatDate(assignment.dueDate)}
                                        </span>
                                        
                                        {assignment.estimatedTime && (
                                            <span className="meta-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                {assignment.estimatedTime} min
                                            </span>
                                        )}
                                        
                                        <span className="meta-item difficulty" style={{ color: getDifficultyColor(assignment.difficulty) }}>
                                            {assignment.difficulty}
                                        </span>
                                    </div>
                                    
                                    {assignment.dueDate && !assignment.completed && (
                                        <div className="assignment-due-status">
                                            {getDaysUntilDue(assignment.dueDate)}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="assignment-actions">
                                    <button 
                                        className="btn-view-details" 
                                        onClick={() => navigate(`/assignments/${assignment.activityId}`)}
                                    >
                                        View Details
                                    </button>
                                    
                                    {user.role === 'TEACHER' && (
                                        <button 
                                            className="btn-delete-assignment" 
                                            onClick={() => handleDeleteAssignment(assignment.activityId)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Assignment</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        
                        <form onSubmit={handleCreateAssignment} className="assignment-form">
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
                                    rows="4"
                                    placeholder="Describe the assignment..."
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
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Estimated Time (minutes)</label>
                                    <input
                                        type="number"
                                        value={newAssignment.estimatedTime}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, estimatedTime: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>
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
                            
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Create Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClassAssignments;

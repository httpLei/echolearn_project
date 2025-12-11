import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI, subjectAPI, enrollmentAPI } from '../../services/api.js';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Select.jsx';
import '../css/Assignments.css';

function Assignments({ user, onLogout }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]); // Keep all assignments for counts
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  
  const isTeacher = user?.role === 'TEACHER';

  console.log('Current subjectFilter:', subjectFilter);

  // Fetch assignments from backend with filters
  useEffect(() => {
    if (user && user.id) {
      fetchAssignments();
      if (user.role === 'TEACHER') {
        fetchTeacherSubjects();
      } else if (user.role === 'STUDENT') {
        fetchStudentSubjects();
      }
    }
  }, [user, activeTab, searchTerm, subjectFilter, sortBy]); // Re-fetch when filters change

  const fetchStudentSubjects = async () => {
    try {
      console.log('Fetching enrolled subjects for student:', user.id);
      const response = await enrollmentAPI.getEnrollments(user.id);
      console.log('Student enrollments response:', response.data);
      // Backend wraps data in { success: true, data: [...] }
      const enrollmentsData = response.data.data || response.data;
      console.log('Extracted enrollments:', enrollmentsData);
      // Extract subjects from enrollments
      const enrolledSubjects = enrollmentsData.map(enrollment => enrollment.subject);
      console.log('Enrolled subjects:', enrolledSubjects);
      setSubjects(Array.isArray(enrolledSubjects) ? enrolledSubjects : []);
    } catch (error) {
      console.error('Error fetching student subjects:', error);
    }
  };

  const fetchTeacherSubjects = async () => {
    try {
      console.log('Fetching subjects for teacher:', user.id);
      const response = await subjectAPI.getByTeacher(user.id);
      console.log('Teacher subjects response:', response.data);
      // Backend wraps data in { success: true, data: [...] }
      const subjectsData = response.data.data || response.data;
      console.log('Extracted subjects:', subjectsData);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Build filter params for backend
      const params = {};
      
      // Add search filter
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add subject filter
      if (subjectFilter !== 'all') {
        if (isTeacher) {
          params.subjectId = parseInt(subjectFilter);
        } else {
          params.subjectCode = subjectFilter;
        }
      }
      
      // Add status filter (for students only)
      if (!isTeacher && activeTab !== 'all') {
        params.status = activeTab;
      }
      
      // Add sort parameter
      if (sortBy) {
        params.sortBy = sortBy;
      }
      
      const response = await assignmentAPI.getByUser(user.id, params);
      console.log('Raw assignments response:', response.data);
      const assignmentsData = response.data.map(a => ({
        ...a,
        subject: a.subject ? a.subject.subjectCode : 'N/A',
        subjectId: a.subject ? a.subject.subjectId : null,
        completed: a.completed || false
      }));
      console.log('Processed assignments:', assignmentsData);
      setAssignments(assignmentsData);
      
      // Also fetch all assignments without filters for accurate counts
      if (!isTeacher) {
        const allParams = { sortBy };
        const allResponse = await assignmentAPI.getByUser(user.id, allParams);
        const allAssignmentsData = allResponse.data.map(a => ({
          ...a,
          subject: a.subject ? a.subject.subjectCode : 'N/A',
          subjectId: a.subject ? a.subject.subjectId : null,
          completed: a.completed || false
        }));
        setAllAssignments(allAssignmentsData);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate counts for tabs (use allAssignments for accurate counts)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  // Use allAssignments if available (for students), otherwise use assignments (for teachers)
  const countsSource = !isTeacher && allAssignments.length > 0 ? allAssignments : assignments;

  const overdueCount = countsSource.filter(a => !a.completed && new Date(a.dueDate) < today).length;
  const todayCount = countsSource.filter(a => {
    if (a.completed) return false;
    const d = new Date(a.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;
  const weekCount = countsSource.filter(a => {
    if (a.completed) return false;
    const d = new Date(a.dueDate);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= weekFromNow;
  }).length;
  const upcomingCount = countsSource.filter(a => !a.completed && new Date(a.dueDate) > weekFromNow).length;
  const completedCount = countsSource.filter(a => a.completed).length;

  // No filtering needed - backend handles it
  const filteredAssignments = assignments;

  // No sorting needed - backend handles it
  const sortedAssignments = filteredAssignments;

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const handleCreateAssignment = () => {
    navigate('/assignments/create');
  };

  const handleDeleteAssignment = async (assignmentId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assignment? All student submissions will also be deleted.')) {
      try {
        await assignmentAPI.delete(assignmentId);
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment');
      }
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} activePage="assignments">
      <div className="assignments-container">
        <div className="assignments-header-row">
          <h1 className="page-title">Assignments</h1>
          {isTeacher && (
            <button className="btn-create-assignment" onClick={handleCreateAssignment}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Assignment
            </button>
          )}
        </div>
        
        <div className="assignments-controls">
          <div className="search-box">
            
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <Select value={subjectFilter} onValueChange={(val) => {
              console.log('onValueChange called with:', val);
              setSubjectFilter(val);
            }}>
              <SelectTrigger className="filter-select-custom">
                <SelectValue placeholder="All Subjects">
                  {subjectFilter === 'all' 
                    ? 'All Subjects' 
                    : isTeacher 
                      ? subjects.find(s => s.subjectId === parseInt(subjectFilter))?.subjectCode || subjectFilter
                      : subjectFilter
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {isTeacher ? (
                  Array.isArray(subjects) && subjects.length > 0 ? (
                    subjects.map(subject => (
                      <SelectItem key={subject.subjectId} value={subject.subjectId.toString()}>
                        {subject.subjectCode}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-subjects" disabled>No subjects found</SelectItem>
                  )
                ) : (
                  Array.isArray(subjects) && subjects.length > 0 ? (
                    subjects.map(subject => (
                      <SelectItem key={subject.subjectId} value={subject.subjectCode}>
                        {subject.subjectCode}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-subjects" disabled>Not enrolled in any subjects</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(val) => {
              console.log('Sort onValueChange called with:', val);
              setSortBy(val);
            }}>
              <SelectTrigger className="filter-select-custom">
                <SelectValue placeholder="Due Date">
                  {sortBy === 'dueDate' ? 'Due Date' : 'Difficulty'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="dueDate" value="dueDate">Due Date</SelectItem>
                <SelectItem key="difficulty" value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="assignment-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({countsSource.filter(a => !a.completed).length})
          </button>
          {!isTeacher && (
            <>
              <button 
                className={`tab ${activeTab === 'overdue' ? 'active' : ''}`}
                onClick={() => setActiveTab('overdue')}
              >
                Overdue ({overdueCount})
              </button>
              <button 
                className={`tab ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Due Today ({todayCount})
              </button>
              <button 
                className={`tab ${activeTab === 'week' ? 'active' : ''}`}
                onClick={() => setActiveTab('week')}
              >
                This Week ({weekCount})
              </button>
              <button 
                className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({upcomingCount})
              </button>
              <button 
                className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({completedCount})
              </button>
            </>
          )}
        </div>

        <div className="assignments-list">
          {sortedAssignments.map((assignment) => (
            <div 
              key={assignment.activityId} 
              className={`assignment-card ${isOverdue(assignment.dueDate) && !isTeacher ? 'overdue' : ''}`}
              onClick={() => navigate(`/assignments/${assignment.activityId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="assignment-header">
                <div className="assignment-title-section">
                  {isOverdue(assignment.dueDate) && !isTeacher && (
                    <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 22h20L12 2zm0 4.5l7 13H5l7-13z"></path>
                      <path d="M11 11h2v5h-2z"></path>
                      <circle cx="12" cy="18" r="1"></circle>
                    </svg>
                  )}
                  <div>
                    <h3 className="assignment-title">{assignment.title}</h3>
                    <p className="assignment-description">{assignment.description}</p>
                  </div>
                </div>
                <div className="assignment-actions-section">
                  <span className={`difficulty-badge difficulty-${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                  </span>
                  {isTeacher && (
                    <button 
                      className="btn-delete-assignment"
                      onClick={(e) => handleDeleteAssignment(assignment.activityId, e)}
                      title="Delete Assignment"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="assignment-meta">
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
                  {assignment.estimatedTime} min
                </span>
                <span className="subject-tag">{assignment.subject}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Assignments;

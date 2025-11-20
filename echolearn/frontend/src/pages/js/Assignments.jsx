import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { assignmentAPI } from '../../services/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Select.jsx';
import '../css/Assignments.css';

function Assignments({ user, onLogout }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([  //crud create assignments
    {
      activityId: 1,
      title: 'Familiarizing GIT and Python Django',
      description: 'To familiarize yourself with Git version control processes and Python Django framework through the creation of two distinct projects, each in its own public repository.',
      dueDate: '2025-10-06',
      estimatedTime: 180,
      subject: 'CSIT327',
      difficulty: 'Hard',
      completed: false
    },
    {
      activityId: 2,
      title: 'Data Visualization',
      description: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
      dueDate: '2025-11-30',
      estimatedTime: 120,
      subject: 'IT365',
      difficulty: 'Medium',
      completed: false
    },
    {
      activityId: 3,
      title: 'React Component Development',
      description: 'Build a functional React component that displays dynamic user data using props and state.',
      dueDate: '2025-11-23',
      estimatedTime: 90,
      subject: 'CSIT340',
      difficulty: 'Medium',
      completed: false
    },
    {
      activityId: 4,
      title: 'Sprint 2 Progress Report',
      description: 'Prepare a short report summarizing your team\'s accomplishments, blockers, and next sprint goals.',
      dueDate: '2025-10-04',
      estimatedTime: 30,
      subject: 'IT317',
      difficulty: 'Easy',
      completed: false
    },
    {
      activityId: 5,
      title: 'Noli Me Tangere Reflection Essay',
      description: 'Write a reflection paper discussing the relevance of Noli Me Tangere in today\'s society.',
      dueDate: '2025-11-19',
      estimatedTime: 60,
      subject: 'RIZAL031',
      difficulty: 'Easy',
      completed: false
    },
    {
      activityId: 6,
      title: 'Linear Regression Activity',
      description: 'Apply linear regression techniques to analyze and predict data patterns using Python',
      dueDate: '2025-11-15',
      estimatedTime: 150,
      subject: 'IT365',
      difficulty: 'Medium',
      completed: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Load completed assignments from localStorage
  useEffect(() => {
    const completedAssignments = JSON.parse(localStorage.getItem('completedAssignments') || '[]');
    setAssignments(prevAssignments => 
      prevAssignments.map(a => ({
        ...a,
        completed: completedAssignments.includes(a.activityId)
      }))
    );
  }, []);

  // Calculate counts for tabs
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const overdueCount = assignments.filter(a => new Date(a.dueDate) < today).length;
  const todayCount = assignments.filter(a => {
    const d = new Date(a.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;
  const weekCount = assignments.filter(a => {
    const d = new Date(a.dueDate);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= weekFromNow;
  }).length;
  const upcomingCount = assignments.filter(a => new Date(a.dueDate) > weekFromNow).length;
  const completedCount = assignments.filter(a => a.completed).length;

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    // Search filter
    if (searchTerm && !assignment.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Subject filter
    if (subjectFilter !== 'all' && assignment.subject !== subjectFilter) {
      return false;
    }

    // Tab filter
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (activeTab === 'completed') return assignment.completed;
    
    // Don't show completed assignments in other tabs
    if (assignment.completed && activeTab !== 'completed') return false;
    
    if (activeTab === 'overdue' && dueDate >= today) return false;
    if (activeTab === 'today' && dueDate.getTime() !== today.getTime()) return false;
    if (activeTab === 'week' && (dueDate < today || dueDate > weekFromNow)) return false;
    if (activeTab === 'upcoming' && dueDate <= weekFromNow) return false;

    return true;
  });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
      return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    }
    return 0;
  });

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <Layout user={user} onLogout={onLogout} activePage="assignments">
      <div className="assignments-container">
        <h1 className="page-title">Assignments</h1>
        
        <div className="assignments-controls">
          <div className="search-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="filter-select-custom">
                <SelectValue placeholder="All Subjects">
                  {subjectFilter === 'all' ? 'All Subjects' : subjectFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="RIZAL031">RIZAL031</SelectItem>
                <SelectItem value="IT365">IT365</SelectItem>
                <SelectItem value="ES038">ES038</SelectItem>
                <SelectItem value="CSIT327">CSIT327</SelectItem>
                <SelectItem value="IT317">IT317</SelectItem>
                <SelectItem value="CSIT340">CSIT340</SelectItem>
                <SelectItem value="CSIT321">CSIT321</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="filter-select-custom">
                <SelectValue placeholder="Due Date">
                  {sortBy === 'dueDate' ? 'Due Date' : 'Difficulty'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="assignment-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({assignments.length})
          </button>
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
        </div>

        <div className="assignments-list">
          {sortedAssignments.map((assignment) => (
            <div 
              key={assignment.activityId} 
              className={`assignment-card ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}
              onClick={() => navigate(`/assignments/${assignment.activityId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="assignment-header">
                <div className="assignment-title-section">
                  {isOverdue(assignment.dueDate) && (
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
                <span className={`difficulty-badge difficulty-${assignment.difficulty.toLowerCase()}`}>
                  {assignment.difficulty}
                </span>
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

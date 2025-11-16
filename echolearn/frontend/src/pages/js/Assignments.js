import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { assignmentAPI } from '../../services/api';
import '../css/Assignments.css';

function Assignments({ user, onLogout }) {
  const [assignments, setAssignments] = useState([
    {
      activityId: 1,
      title: 'Data Visualization',
      description: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
      dueDate: '2025-11-05',
      estimatedTime: 120,
      subject: 'IT365',
      difficulty: 'EASY',
      completed: false
    },
    {
      activityId: 2,
      title: 'Data Visualization',
      description: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
      dueDate: '2025-11-05',
      estimatedTime: 120,
      subject: 'IT365',
      difficulty: 'EASY',
      completed: false
    },
    {
      activityId: 3,
      title: 'Data Visualization',
      description: 'Create the pivot tables (label your tables\' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)',
      dueDate: '2025-11-05',
      estimatedTime: 120,
      subject: 'IT365',
      difficulty: 'EASY',
      completed: false
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('Due Date');

  const handleMarkComplete = async (id) => {
    try {
      await assignmentAPI.markComplete(id);
      setAssignments(assignments.map(a => 
        a.activityId === id ? { ...a, completed: true } : a
      ));
    } catch (error) {
      console.error('Error marking assignment as complete:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return '#f5a623';
      case 'MEDIUM': return '#f8b500';
      case 'HARD': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'Overdue') {
      return new Date(assignment.dueDate) < new Date() && !assignment.completed;
    }
    if (filter === 'Due Today') {
      const today = new Date().toISOString().split('T')[0];
      return assignment.dueDate === today && !assignment.completed;
    }
    if (filter === 'This Week') {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return new Date(assignment.dueDate) <= weekFromNow && !assignment.completed;
    }
    if (filter === 'Upcoming') {
      return new Date(assignment.dueDate) > new Date() && !assignment.completed;
    }
    return true;
  });

  return (
    <Layout user={user} onLogout={onLogout} activePage="assignments">
      <div className="assignments-container">
        <h1 className="page-title">Assignments</h1>
        
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
            <select 
              className="filter-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option>All Subjects</option>
              <option>IT365</option>
              <option>CSIT327</option>
            </select>
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Due Date</option>
              <option>Subject</option>
              <option>Difficulty</option>
            </select>
          </div>
        </div>

        <div className="assignment-tabs">
          <button 
            className={`tab ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All (0)
          </button>
          <button 
            className={`tab ${filter === 'Overdue' ? 'active' : ''}`}
            onClick={() => setFilter('Overdue')}
          >
            Overdue (0)
          </button>
          <button 
            className={`tab ${filter === 'Due Today' ? 'active' : ''}`}
            onClick={() => setFilter('Due Today')}
          >
            Due Today (0)
          </button>
          <button 
            className={`tab ${filter === 'This Week' ? 'active' : ''}`}
            onClick={() => setFilter('This Week')}
          >
            This Week (0)
          </button>
          <button 
            className={`tab ${filter === 'Upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('Upcoming')}
          >
            Upcoming(0)
          </button>
        </div>

        <div className="assignments-list">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.activityId} className="assignment-card">
              <div className="assignment-header">
                <h3 className="assignment-title">{assignment.title}</h3>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(assignment.difficulty) }}
                >
                  {assignment.difficulty.charAt(0) + assignment.difficulty.slice(1).toLowerCase()}
                </span>
              </div>
              
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-meta">
                <span className="meta-item">Due: {assignment.dueDate}</span>
                <span className="meta-item">{assignment.estimatedTime} min</span>
                <span className="meta-item subject-tag">{assignment.subject}</span>
              </div>
              
              <button 
                className="btn-complete"
                onClick={() => handleMarkComplete(assignment.activityId)}
                disabled={assignment.completed}
              >
                {assignment.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Assignments;

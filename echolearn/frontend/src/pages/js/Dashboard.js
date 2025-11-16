import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { assignmentAPI } from '../../services/api';
import '../css/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [classes, setClasses] = useState([
    { id: 1, code: 'CSIT327', name: 'Information Management', color: '#7a9b7e', teacher: 'Joemarie C. Ampora' },
    { id: 2, code: 'IT365', name: 'Data Analytics', color: '#e8a587', teacher: 'Joemarie C. Ampora' },
    { id: 3, code: 'ES038', name: 'Technopreneurship', color: '#8b6bb7', teacher: 'Jurydel G. Bamu' },
    { id: 4, code: 'CSIT321', name: 'Application Development', color: '#5983a8', teacher: 'Leah V. Barbosa' },
    { id: 5, code: 'CSIT340', name: 'Industry Elective', color: '#c04d4d', teacher: 'Eugene C. Busico' },
    { id: 6, code: 'IT317', name: 'Project Management', color: '#b98198', teacher: 'Joemarie C. Ampora' },
    { id: 7, code: 'RIZAL031', name: 'Life and Works of Rizal', color: '#d4c859', teacher: 'Joemarie C. Ampora' },
    { id: 8, code: 'CSIT327', name: 'Information Management', color: '#4a7ba7', teacher: 'Joemarie C. Ampora' },
    { id: 9, code: 'CSIT327', name: 'Information Management', color: '#84b174', teacher: 'Joemarie C. Ampora' }
  ]);

  return (
    <Layout user={user} onLogout={onLogout} activePage="dashboard">
      <div className="dashboard-container">
        <h1 className="page-title">My Classes</h1>
        
        <div className="classes-grid">
          {classes.map((classItem) => (
            <div key={classItem.id} className="class-card">
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
      </div>
    </Layout>
  );
}

export default Dashboard;

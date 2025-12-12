import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/jsx/Welcome.jsx';
import SignIn from './pages/jsx/SignIn.jsx';
import SignUp from './pages/jsx/SignUp.jsx';
import Dashboard from './pages/jsx/Dashboard.jsx';
import Assignments from './pages/jsx/Assignments.jsx';
import CreateAssignment from './pages/jsx/CreateAssignment.jsx';
import AssignmentDetail from './pages/jsx/AssignmentDetail.jsx';
import Notifications from './pages/jsx/Notifications.jsx';
import Chat from './pages/jsx/Chat.jsx';
import Calendar from './pages/jsx/Calendar.jsx';
import ClassPage from './pages/jsx/ClassPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/assignments" element={user ? <Assignments user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/assignments/create" element={user ? <CreateAssignment user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/assignments/:id" element={user ? <AssignmentDetail user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/notifications" element={user ? <Notifications user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/calendar" element={user ? <Calendar user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/chat" element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/class/:subjectId" element={user ? <ClassPage user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

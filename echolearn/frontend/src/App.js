import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/jsx/Welcome.jsx';
import SignIn from './pages/jsx/SignIn.jsx';
import SignUp from './pages/jsx/SignUp.jsx';
import Dashboard from './pages/jsx/Dashboard.jsx';
import Assignments from './pages/jsx/Assignments.jsx';
import AssignmentDetail from './pages/jsx/AssignmentDetail.jsx';
import Notifications from './pages/jsx/Notifications.jsx';
import Chat from './pages/jsx/Chat.jsx';
import Calendar from './pages/jsx/Calendar.jsx';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/assignments" element={user ? <Assignments user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/assignments/:id" element={user ? <AssignmentDetail user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/notifications" element={user ? <Notifications user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/calendar" element={user ? <Calendar user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/chat" element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Welcome.css';
import logo from '../../images/EchoLearnLogo.png';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="logo">
          <img src={logo} alt="EchoLearn Logo" className="logo-image" />
        </div>
        <h1 className="welcome-title">Welcome to<br/>EchoLearn</h1>
        <button className="btn btn-signin" onClick={() => navigate('/signin')}>
          Sign In
        </button>
        <button className="btn btn-signup" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Welcome;

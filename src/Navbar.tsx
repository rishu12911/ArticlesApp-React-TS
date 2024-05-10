import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import reactLogo from './assets/react.svg';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={reactLogo} alt="Logo" />
        </Link>
        
        <span className="navbar-center">E/G Article</span>
        
        {location.pathname !== '/' && (
          <Link to="/" className="back-button">
            Go Back
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

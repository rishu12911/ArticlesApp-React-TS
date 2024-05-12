import React from 'react';
import reactLogo from './assets/react.svg'


const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <img src={reactLogo} alt="Logo" className="logo" />
          <span className="navbar-brand">E/G Articles</span>
        </div>
        <div className="navbar-right">
          <button className="nav-button">Find Your Path</button>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';

import reactLogo from './assets/react.svg';

const Navbar: React.FC = () => {
  

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
      <img src={reactLogo} className="logo react" alt="React logo" />
        <span className="navbar-center">E/G Articles</span>
        
       
        
      </div>
    </nav>
  );
};

export default Navbar;

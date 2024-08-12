import React from 'react';
import { Link } from 'react-router-dom';

function Header({ setIsAuthenticated }) {
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user_id');
  };

  return (
    <header className="bg-gray-800 p-6">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold ml-4">
          StepUP
        </Link>
        <div className="flex space-x-6">
          <Link 
            to="/traits-summary" 
            className="text-white text-lg hover:text-yellow-300 transition duration-300"
          >
            Traits Summary
          </Link>
          <Link 
            to="/login" 
            className="text-white text-lg hover:text-yellow-300 transition duration-300"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="text-white text-lg hover:text-yellow-300 transition duration-300"
          >
            Register
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-white text-lg hover:text-yellow-300 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

function Header({ setIsAuthenticated }) {
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user_id');
  };

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 text-white">
      <nav>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register" className="mr-4">Register</Link>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;

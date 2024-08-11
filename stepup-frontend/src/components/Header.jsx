import React from 'react';
import { Link } from 'react-router-dom';

function Header({ setIsAuthenticated }) {
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user_id');
  };

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Home</Link>
        <div>
          <Link to="/traits-summary" className="text-white mr-4">Traits Summary</Link>
          <Link to="/login" className="text-white mr-4">Login</Link>
          <Link to="/register" className="text-white mr-4">Register</Link>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;

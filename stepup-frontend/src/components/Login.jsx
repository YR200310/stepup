import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/login', { username, password })
      .then(response => {
        const { data } = response;
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id);
          setIsAuthenticated(true);
          navigate('/');
        }
      })
      .catch(error => {
        setError('Login failed. Please check your credentials and try again.');
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-grid-pattern">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 text-sm font-medium">Username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 text-sm font-medium">Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

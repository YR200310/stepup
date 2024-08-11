import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        console.error('Error logging in:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <label className="block mb-4">
        <span className="text-gray-700">Username:</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Password:</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </label>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Login
      </button>
    </form>
  );
}

export default Login;

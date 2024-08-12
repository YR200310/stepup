import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/register', { username, password })
      .then(response => {
        navigate('/login');
      })
      .catch(error => {
        setError('Registration failed. Please try again.');
        console.error('Error registering:', error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-grid-pattern">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
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
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Register
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;

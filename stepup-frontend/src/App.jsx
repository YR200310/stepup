import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register'; // 正しくインポートされているか確認
import Home from './components/Home';

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    due_date: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://127.0.0.1:5000/goals', {
        params: { user_id: localStorage.getItem('user_id') }
      })
        .then(response => {
          setGoals(response.data);
        })
        .catch(error => {
          console.error('Error fetching goals:', error);
        });
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prevGoal => ({
      ...prevGoal,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/goals', {
      ...newGoal,
      user_id: localStorage.getItem('user_id')
    })
      .then(response => {
        setNewGoal({ title: '', description: '', due_date: '' });
        return axios.get('http://127.0.0.1:5000/goals', {
          params: { user_id: localStorage.getItem('user_id') }
        });
      })
      .then(response => {
        setGoals(response.data);
      })
      .catch(error => {
        console.error('Error adding goal:', error);
      });
  };

  return (
    <Router>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? (
            <div className="min-h-screen bg-gray-100 p-8">
              <h1 className="text-3xl font-bold mb-6">Goals</h1>
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <label className="block mb-4">
                  <span className="text-gray-700">Title:</span>
                  <input
                    type="text"
                    name="title"
                    value={newGoal.title}
                    onChange={handleChange}
                    required
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Description:</span>
                  <input
                    type="text"
                    name="description"
                    value={newGoal.description}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Due Date:</span>
                  <input
                    type="date"
                    name="due_date"
                    value={newGoal.due_date}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </label>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Add Goal
                </button>
              </form>
              <ul className="mt-6 space-y-4">
                {goals.map(goal => (
                  <li key={goal.id} className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">{goal.title}</h2>
                    <p className="mt-2 text-gray-600">{goal.description}</p>
                    <p className="mt-2 text-gray-500">Due: {goal.due_date}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

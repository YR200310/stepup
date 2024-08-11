import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import GoalForm from './components/GoalForm';
import GoalsList from './components/GoalsList';

function App() {
  const [goals, setGoals] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (isAuthenticated && userId) {
      axios.get('http://127.0.0.1:5000/goals', {
        params: { user_id: userId }
      })
        .then(response => {
          setGoals(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching goals:', error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleGoalAdded = () => {
    const userId = localStorage.getItem('user_id');
    if (isAuthenticated && userId) {
      axios.get('http://127.0.0.1:5000/goals', {
        params: { user_id: userId }
      })
        .then(response => {
          setGoals(response.data);
        })
        .catch(error => {
          console.error('Error fetching goals:', error);
        });
    }
  };

  return (
    <Router>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? (
            loading ? (
              <div>Loading...</div>
            ) : (
              <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold mb-6">Goals</h1>
                <GoalForm onGoalAdded={handleGoalAdded} />
                <GoalsList goals={goals} />
              </div>
            )
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

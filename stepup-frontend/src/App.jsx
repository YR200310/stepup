import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import GoalForm from './components/GoalForm';
import GoalsList from './components/GoalsList';
import TraitsSummary from './components/TraitsSummary';

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
              <div className="flex justify-center items-center h-screen">
                <div className="text-2xl text-gray-600">Loading...</div>
              </div>
            ) : (
              <div className="min-h-screen bg-grid-pattern p-8"> 
                <div className="max-w-4xl mx-auto bg-wood-brown p-8 rounded-lg shadow-lg">
                  <GoalsList goals={goals} />
                  <GoalForm onGoalAdded={handleGoalAdded} />
                </div>
              </div>
            )
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/traits-summary" element={isAuthenticated ? <TraitsSummary /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

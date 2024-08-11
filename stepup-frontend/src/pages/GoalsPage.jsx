import React, { useState, useEffect } from 'react';
import { getGoals, addGoal } from '../services/api';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    const newGoal = { title, description, due_date: dueDate };
    try {
      await addGoal(newGoal);
      setGoals([...goals, newGoal]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <div>
      <h1>Goals</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleAddGoal}>Add Goal</button>
      <ul>
        {goals.map(goal => (
          <li key={goal.id}>
            <h2>{goal.title}</h2>
            <p>{goal.description}</p>
            <p>Due Date: {goal.due_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalsPage;

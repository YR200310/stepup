import React from 'react';

function GoalsList({ goals }) {
  return (
    <ul>
      {goals.map(goal => (
        <li key={goal.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{goal.title}</h2>
          <p className="mt-2">{goal.description}</p>
          <p className="mt-2"><strong>Due Date:</strong> {goal.due_date}</p>
          <p className="mt-2"><strong>Traits:</strong> {goal.traits.join(', ')}</p>
        </li>
      ))}
    </ul>
  );
}

export default GoalsList;

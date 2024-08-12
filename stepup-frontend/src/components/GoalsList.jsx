import React, { useState } from 'react';

function GoalsList({ goals }) {
  const [sortCriteria, setSortCriteria] = useState('date'); // デフォルトは日付順

  const sortedGoals = [...goals].sort((a, b) => {
    if (sortCriteria === 'date') {
      return new Date(a.due_date) - new Date(b.due_date);
    } else if (sortCriteria === 'posted') {
      return a.id - b.id; // 投稿が早い順（idが小さい順）
    }
    return 0;
  });

  const today = new Date();

  return (
    <div className="min-h-screen bg-clear-green p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">目標:</h2>
        <div>
          <label className="mr-2 text-lg font-semibold text-white">並び替え:</label>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="p-2 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">日付順</option>
            <option value="posted">投稿順</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-start">
        {sortedGoals.map((goal) => {
          const isExpired = new Date(goal.due_date) < today;

          return (
            <div
              key={goal.id}
              className={`bg-yellow-100 rounded-lg shadow-lg p-6 relative flex flex-col justify-between ${isExpired ? 'border-red-500' : 'border-yellow-400'}`}
              style={{ width: 'calc(33.333% - 16px)', borderRadius: '15px', border: '2px solid' }}  
            >
              <div
                className="absolute -top-4 left-4 bg-yellow-100 w-6 h-6 transform rotate-45 shadow-md"
                style={{ borderRadius: '2px', border: '2px solid #f59e0b' }} 
              ></div>
              <h2 className={`text-xl font-bold mb-2 text-gray-800 border-b-2 pb-2 text-center ${isExpired ? 'text-red-500' : 'border-gray-600'}`}>
                {goal.title}
              </h2>
              <p className={`text-gray-700 mb-2 ${isExpired ? 'text-red-500' : ''}`}>
                {goal.description}
              </p>
              <p className={`text-gray-600 mb-2 ${isExpired ? 'text-red-500' : ''}`}>
                <strong>期限:</strong> {goal.due_date}
              </p>
              <p className={`text-gray-600 ${isExpired ? 'text-red-500' : ''}`}>
                <strong>特徴:</strong> {goal.traits.join(', ')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalsList;

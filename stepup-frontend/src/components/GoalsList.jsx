import React from 'react';

function GoalsList({ goals, onComplete }) {
  return (
    <div className="min-h-screen bg-clear-green p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Sort Goals</h2>
        <div>
          <label className="mr-2 text-lg font-semibold text-white">Sort by:</label>
          <select
            // 省略...
          >
            <option value="date">日付順</option>
            <option value="posted">投稿順</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-start">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-yellow-100 rounded-lg shadow-lg p-6 relative flex flex-col justify-between"
            style={{ width: 'calc(33.333% - 16px)', borderRadius: '15px', border: '2px solid #f59e0b' }}
          >
            <div
              // 省略...
            ></div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 border-b-2 border-gray-600 pb-2 text-center">{goal.title}</h2>
            <p className="text-gray-700 mb-2">{goal.description}</p>
            <p className="text-gray-600 mb-2"><strong>期限:</strong> {goal.due_date}</p>
            <p className="text-gray-600"><strong>特徴:</strong> {goal.traits.join(', ')}</p>
            {!goal.completed && (
              <button
                onClick={() => onComplete(goal.id)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Mark as Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsList;

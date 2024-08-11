const API_URL = 'http://localhost:5000/api/goals';

export const getGoals = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addGoal = async (goal) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goal),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

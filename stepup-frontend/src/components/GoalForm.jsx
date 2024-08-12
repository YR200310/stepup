import React, { useState } from 'react';
import axios from 'axios';

const traitsOptions = [
  '外向性',
  'ストレス',
  '新規性',
  '協調性',
  '計画性'
];

function GoalForm({ onGoalAdded }) {
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    due_date: '',
    traits: [] // 性格特性を管理するための状態
  });

  // 今日の日付を取得
  const today = new Date();
  today.setDate(today.getDate() - 1); // 今日に1日加算
  const minDate = today.toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prevGoal => ({
      ...prevGoal,
      [name]: value
    }));
  };

  const handleTraitsChange = (e) => {
    const { value, checked } = e.target;
    setNewGoal(prevGoal => {
      const newTraits = checked
        ? [...prevGoal.traits, value]
        : prevGoal.traits.filter(trait => trait !== value);

      return {
        ...prevGoal,
        traits: newTraits
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // `due_date` フィールドの検証
    if (!newGoal.title || !newGoal.description || !newGoal.due_date) {
      alert('すべてのフィールドを入力してください。');
      return;
    }
    if (newGoal.due_date < minDate) {
      alert('日付は今日より1日後以降の日にちを選んでください。');
      return;
    }

    axios.post('http://127.0.0.1:5000/goals', { ...newGoal, user_id: localStorage.getItem('user_id') })
      .then(response => {
        console.log('Goal added successfully:', response.data);
        setNewGoal({ title: '', description: '', due_date: '', traits: [] });
        onGoalAdded(); // 新しいゴールが追加された後にコールバックを呼び出す
      })
      .catch(error => {
        console.error('Error adding goal:', error);
      });
  };

  return (
    <div className="bg-clear-green">
    <form onSubmit={handleSubmit}  
    className="mb-4 p-6 bg-yellow-100 max-w-md mx-auto"
    style={{ borderRadius: '15px', border: '2px solid #f59e0b' }} >
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
          min={minDate} // 今日より1日後の日付のみ選択可能
          required
          className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </label>
      <fieldset className="block mb-4">
        <legend className="text-gray-700">Traits:</legend>
        {traitsOptions.map(trait => (
          <label key={trait} className="block">
            <input
              type="checkbox"
              value={trait}
              checked={newGoal.traits.includes(trait)}
              onChange={handleTraitsChange}
              className="mr-2"
            />
            {trait}
          </label>
        ))}
      </fieldset>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Add Goal
      </button>
    </form>
    <div className="text-clear-green">a</div>
    </div>
  );
}

export default GoalForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TraitsSummary() {
  const [traitsSummary, setTraitsSummary] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      axios.get('http://127.0.0.1:5000/traits_summary', {
        params: { user_id: userId }
      })
        .then(response => {
          setTraitsSummary(response.data.counts);
          setMessage(response.data.message);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching traits summary:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Traits Summary</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-4 border-b">Trait</th>
            <th className="p-4 border-b">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(traitsSummary).map(([trait, count]) => (
            <tr key={trait}>
              <td className="p-4 border-b">{trait}</td>
              <td className="p-4 border-b">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-lg font-semibold">
        {message}
      </div>
    </div>
  );
}

export default TraitsSummary;

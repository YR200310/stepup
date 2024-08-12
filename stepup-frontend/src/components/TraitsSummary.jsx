import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement);

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

  const chartData = {
    labels: ['Extroversion', 'Neuroticism', 'Openness', 'Agreeableness', 'Conscientiousness'],
    datasets: [
      {
        label: 'Traits',
        data: [
          traitsSummary.extroversion || 0,
          traitsSummary.neuroticism || 0,
          traitsSummary.openness || 0,
          traitsSummary.agreeableness || 0,
          traitsSummary.conscientiousness || 0
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern p-8">
      <div className="flex justify-center items-center mb-8">
        <div className="relative" style={{ width: '100%', maxWidth: '800px', height: '600px' }}>
      
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white">
            <Radar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">あなたの性格と適正</h2>
        <p className="text-lg text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}

export default TraitsSummary;

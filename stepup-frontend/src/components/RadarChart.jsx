// src/components/RadarChart.js
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Chart.jsのコンポーネントを登録
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ data }) => {
  const labels = ['Extroversion', 'Neuroticism', 'Openness', 'Agreeableness', 'Conscientiousness'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Traits',
        data: labels.map(label => data[label.toLowerCase()] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        beginAtZero: true,
        suggestedMax: 10, // 最大値を設定（必要に応じて変更）
      },
    },
  };

  return (
    <div className="p-4">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;

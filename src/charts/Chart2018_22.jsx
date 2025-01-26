// Chart2018_22.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Chart2018_22() {
  const navigate = useNavigate();

  const chartData = {
    labels: ["CS", "IT", "ECE", "EEE", "ME", "CVE", "MAE", "BBA", "MBA"],
    datasets: [
      {
        label: "Branch-wise Statistics (2018-22)",
        data: [325, 311, 301, 124, 23, 16, 48, 45, 33],
        backgroundColor: [
          "#166534",
          "#166534",
          "#166534",
          "#166534",
          "#166534",
          "#166534",
          "#166534",
          "#166534",
          "#166534",
        ],
        borderColor: [
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
          "rgb(74, 222, 128, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const groups = ["Tech", "Tech", "Tech", "Tech", "Tech", "Tech", "Tech", "Management", "Management"];
            return `${context.label} (${groups[context.dataIndex]}): ${context.parsed.y}`;
          },
        },
      },
      datalabels: {
        color: '#000',
        anchor: 'center',
        align: 'center',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Batch 2018-22 Statistics</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Back to Home
          </button>
        </div>
        <div className="bg-white rounded-lg p-6" style={{ height: '500px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Chart2018_22;

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

function Chart2019_23() {
  const navigate = useNavigate();

  const chartData = {
    labels: ["CS", "IT", "ECE", "EEE", "ME", "CVE", "MAE", "BBA", "MBA"],
    datasets: [
      {
        label: "Branch-wise Statistics (2019-23)",
        data: [191, 178, 91, 16, 29, 15, 14, 20, 24],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(219, 255, 99, 0.6)",
          "rgba(102, 255, 120, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(104, 99, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(219, 255, 99, 1)",
          "rgba(102, 255, 120, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(104, 99, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
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
          <h2 className="text-3xl font-semibold">Batch 2019-23 Statistics</h2>
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

export default Chart2019_23;

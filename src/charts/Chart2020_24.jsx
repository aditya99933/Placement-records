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

function Chart2020_24() {
  const navigate = useNavigate();

  const chartData = {
    labels: ["CS", "IT", "ECE", "EEE", "ME+MAE", "CVE", "BBA", "MBA"],
    datasets: [
      {
        label: "Branch-wise Statistics (2020-24)",
        data: [173, 169, 75, 43, 25, 26, 72, 21],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(219, 255, 99, 0.6)",
          "rgba(102, 255, 120, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(104, 99, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
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
            const groups = ["Tech", "Tech", "Tech", "Tech", "Tech", "Tech", "Management", "Management"];
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
          <h2 className="text-3xl font-semibold">Batch 2020-24 Statistics</h2>
          
        </div>
        <div className="bg-white rounded-lg p-6" style={{ height: '500px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Chart2020_24;
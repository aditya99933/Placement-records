import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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
          "#22c55e",
          "#16a34a",
          "#4ade80",
          "#22d3ee",
          "#a21caf",
          "#facc15",
          "#f59e42",
          "#f472b6",
        ],
        borderColor: [
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
          "#bbf7d0",
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
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
          color: '#fff',
          font: { size: 14, weight: 'bold' },
          usePointStyle: false, // Remove colored box
          boxWidth: 0, // Hide box
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const groups = ["Tech", "Tech", "Tech", "Tech", "Tech", "Tech", "Management", "Management"];
            return `${context.label} (${groups[context.dataIndex]}): ${context.parsed.y}`;
          },
        },
        backgroundColor: '#222',
        titleColor: '#22c55e',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'top',
        font: {
          size: 18,
          weight: 'bold',
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 6,
        padding: 4,
        clamp: true,
        display: true,
        formatter: function(value) {
          return value;
        },
      },
      scales: {
        y: {
          max: 210, // adjust as needed for your data
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: 'rgba(255,255,255,0.08)' }
      },
      y: {
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: 'rgba(255,255,255,0.08)' }
      }
    }
  };

  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Branch-Wise Trend',
        data: chartData.datasets[0].data,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.2)',
        pointBackgroundColor: chartData.datasets[0].backgroundColor,
        pointBorderColor: '#fff',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff', font: { weight: 'bold' } } },
      tooltip: { backgroundColor: '#222', titleColor: '#22c55e', bodyColor: '#fff' },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'top',
        font: {
          size: 18,
          weight: 'bold',
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 6,
        padding: 4,
        clamp: true,
        display: true,
        formatter: function(value) {
          return value;
        },
      },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.08)' } },
    },
  };

  return (
    <div className="w-full max-w-full px-1 md:px-6 py-4">
      <div className="backdrop-blur-lg bg-black/60 border border-green-700/40 shadow-2xl rounded-2xl p-2 md:p-8 w-full min-h-[300px] h-[60vw] max-h-[500px] flex flex-col justify-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-green-400 text-center drop-shadow-lg">Batch 2020-24 Statistics</h2>
        <div className="relative w-full h-full min-h-[250px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
      <div className="backdrop-blur-lg bg-black/60 border border-green-700/40 shadow-2xl rounded-2xl p-2 md:p-8 w-full min-h-[300px] h-[60vw] max-h-[500px] flex flex-col justify-center">
        <Line data={lineData} options={lineOptions} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}

export default Chart2020_24;
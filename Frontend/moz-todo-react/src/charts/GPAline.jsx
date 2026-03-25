import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { calculateSemesterGpa } from '../components/calculateGPA';
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const GPAline = ({subjects}) => {
  const dataFromHelper = calculateSemesterGpa(subjects);

  const chartData = {
    labels: dataFromHelper.map((item) => item.semester),
    datasets: [
      {
        label: "GPA",
        data: dataFromHelper.map((item) => item.gpa),
        borderColor: "#84cc16",
        backgroundColor: "#84cc16",
        tension: 0.4,
        fill: false,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2937" },
      },
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2937" },
      },
    },
  };

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">
        Overall GPA Trend
      </h3>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default GPAline
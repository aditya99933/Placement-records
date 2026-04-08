import React from 'react'
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { gradeDistribution } from '../components/calculateGPA';

ChartJS.register(ArcElement, Tooltip, Legend);

const GPAPie = ({subjects}) => {
  const dataFromHelper = gradeDistribution(subjects);

  const chartData = {
    labels: dataFromHelper.map((item) => item.grade),
    datasets: [
      {
        label: "Grade Distribution",
        data: dataFromHelper.map((item) => item.value),
        backgroundColor: [
          "#84cc16",
          "#22c55e",
          "#06b6d4",
          "#f97316",
          "#ef4444",
        ],
        borderWidth: 2,
        borderColor: "#0f172a",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          padding: 15,
        },
      },
    },
  };
  
  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 h-[400px] flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-white">
        Grade Distribution
      </h3>
      <div className="flex-grow flex items-center justify-center">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}

export default GPAPie
import React from 'react'
import { calculateSemesterGpa } from './calculateGPA'

const Semestertable = ({subjects}) => {
  const summary = calculateSemesterGpa(subjects);

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-white">Semester Breakdown</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Semester</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">Total Marks</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">Percentile</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">SGPA</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.semester} className="border-b border-gray-800 hover:bg-[#1a2332] transition">
              <td className="py-3 px-4 text-white font-semibold">{row.semester}</td>
              <td className="text-center py-3 px-4 text-gray-300">{row.totalMarks}</td>
              <td className="text-center py-3 px-4 text-gray-300">{row.percentile}%</td>
              <td className="text-center py-3 px-4">
                <span className="bg-green-500 text-black px-4 py-1 rounded-full font-bold">
                  {row.sgpa}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Semestertable
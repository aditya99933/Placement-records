import React from 'react'
import { calculateGrade } from './calculateGPA'

const SubjectTable = ({subjects, selectedSemester}) => {
  const filtered =
    selectedSemester === "ALL"
      ? subjects
      : subjects.filter((s) => s.semester === selectedSemester);

  // map: paperCode -> { failed: bool }
  const backMap = {};
  const tagMap = {};

  // iterate over ALL subjects (not filtered) in order to track history
  subjects.forEach((s) => {
    const key = s.paperCode;
    const passed = s.total >= 40;

    if (!backMap[key]) {
      // first time — track if failed, no tag
      backMap[key] = { failed: !passed };
    } else if (backMap[key].failed) {
      // was failed before, appearing again
      if (passed) {
        tagMap[key + "_" + s.semester] = "REAPPER";
        backMap[key].failed = false;
      } else {
        tagMap[key + "_" + s.semester] = "BACK2";
      }
    }
  });

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-white">Detailed Results</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Paper Code</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Subject</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">Internal</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">External</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">Total</th>
            <th className="text-center py-3 px-4 text-gray-400 font-semibold">Grade</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => {
            const actualMarks = s.internal + s.external;
            const tag = tagMap[s.paperCode + "_" + s.semester];
            return (
              <tr key={i} className="border-b border-gray-800 hover:bg-[#1a2332] transition">
                <td className="py-3 px-4 text-gray-300">{s.paperCode}</td>
                <td className="py-3 px-4 text-white">
                  {s.subject}
                  {tag === "BACK"   && <span className="ml-2 text-red-500 font-bold text-xs">BACK</span>}
                  {tag === "BACK2"  && <span className="ml-2 text-red-500 font-bold text-xs">BACK²</span>}
                  {tag === "REAPPER" && <span className="ml-2 text-blue-400 font-bold text-xs">REAPPER</span>}
                </td>
                <td className="text-center py-3 px-4 text-gray-300">{s.internal}</td>
                <td className="text-center py-3 px-4 text-gray-300">{s.external}</td>
                <td className="text-center py-3 px-4 text-white font-semibold">
                  {s.total}
                  {actualMarks < 40 && s.total >= 40 && <span className="ml-1 text-yellow-400 font-bold text-xs">*</span>}
                </td>
                <td className="text-center py-3 px-4">
                  <span className={`px-3 py-1 rounded-full font-semibold ${
                    calculateGrade(s.total) === "F"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {calculateGrade(s.total)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SubjectTable

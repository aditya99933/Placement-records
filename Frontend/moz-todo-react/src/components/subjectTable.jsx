import React, { useState } from 'react'
import { calculateGrade } from './calculateGPA'
import { Eye, EyeOff } from 'lucide-react'

const SubjectTable = ({subjects, selectedSemester}) => {
  const [showDetailed, setShowDetailed] = useState(false);

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
    <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Detailed Results</h3>
        <button 
          onClick={() => setShowDetailed(!showDetailed)}
          className="lg:hidden flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300 transition"
        >
          {showDetailed ? <EyeOff size={16} /> : <Eye size={16} />}
          {showDetailed ? "Hide Internal" : "Show Internal"}
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base">Code</th>
            <th className="text-left py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base">Subject</th>
            <th className={`text-center py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base ${showDetailed ? 'table-cell' : 'hidden md:table-cell'}`}>Int.</th>
            <th className={`text-center py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base ${showDetailed ? 'table-cell' : 'hidden md:table-cell'}`}>Ext.</th>
            <th className="text-center py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base">Total</th>
            <th className="text-center py-3 px-2 md:px-4 text-gray-400 font-semibold text-sm md:text-base">Grd</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => {
            const actualMarks = s.internal + s.external;
            const tag = tagMap[s.paperCode + "_" + s.semester];
            return (
              <tr key={i} className="border-b border-gray-800 hover:bg-[#1a2332] transition">
                <td className="py-3 px-2 md:px-4 text-gray-300 text-sm md:text-base">{s.paperCode}</td>
                <td className="py-3 px-2 md:px-4 text-white text-sm md:text-base">
                  <div className="flex flex-wrap items-center gap-1">
                    {s.subject}
                    {tag === "BACK"   && <span className="text-red-500 font-bold text-[10px] md:text-xs">BACK</span>}
                    {tag === "BACK2"  && <span className="text-red-500 font-bold text-[10px] md:text-xs">BACK²</span>}
                    {tag === "REAPPER" && <span className="text-blue-400 font-bold text-[10px] md:text-xs">REAPPER</span>}
                  </div>
                </td>
                <td className={`text-center py-3 px-2 md:px-4 text-gray-300 text-sm md:text-base ${showDetailed ? 'table-cell' : 'hidden md:table-cell'}`}>{s.internal}</td>
                <td className={`text-center py-3 px-2 md:px-4 text-gray-300 text-sm md:text-base ${showDetailed ? 'table-cell' : 'hidden md:table-cell'}`}>{s.external}</td>
                <td className="text-center py-3 px-2 md:px-4 text-white font-semibold text-sm md:text-base">
                  {s.total}
                  {actualMarks < 40 && s.total >= 40 && <span className="ml-1 text-yellow-400 font-bold text-xs">*</span>}
                </td>
                <td className="text-center py-3 px-2 md:px-4">
                  <span className={`px-2 md:px-3 py-1 rounded-full font-semibold text-xs md:text-sm ${
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

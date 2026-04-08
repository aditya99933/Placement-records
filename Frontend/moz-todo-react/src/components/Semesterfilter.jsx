import React from 'react'

const Semesterfilter = ({ subjects, selected, setSelected }) => {
  const semesters = [...new Set(subjects.map((s) => s.semester))];

  return (
    <div className="space-y-4">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Select Semester</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm ${
            selected === "ALL"
              ? "bg-[#22C55E] text-black shadow-[0_0_20px_rgba(163,230,53,0.4)]"
              : "bg-[#111827] text-gray-400 hover:text-white border border-gray-800"
          }`}
          onClick={() => setSelected("ALL")}
        >
          Overall
        </button>

        {semesters.sort((a,b) => a-b).map((sem) => (
          <button
            key={sem}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm ${
              selected === sem
                ? "bg-[#22C55E] text-black shadow-[0_0_20px_rgba(163,230,53,0.4)]"
                : "bg-[#111827] text-gray-400 hover:text-white border border-gray-800"
            }`}
            onClick={() => setSelected(sem)}
          >
            Sem {sem}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Semesterfilter
import React from 'react'

const Semesterfilter = ({ subjects, selected, setSelected }) => {
  const semesters = [...new Set(subjects.map((s) => s.semester))];

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={`px-6 py-2 rounded-lg font-semibold transition ${
          selected === "ALL"
            ? "bg-green-500 text-black"
            : "bg-[#0f172a] text-gray-300 hover:bg-[#1a2332]"
        }`}
        onClick={() => setSelected("ALL")}
      >
        Overall
      </button>

      {semesters.map((sem) => (
        <button
          key={sem}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            selected === sem
              ? "bg-green-500 text-black"
              : "bg-[#0f172a] text-gray-300 hover:bg-[#1a2332]"
          }`}
          onClick={() => setSelected(sem)}
        >
          Sem {sem}
        </button>
      ))}
    </div>
  )
}

export default Semesterfilter
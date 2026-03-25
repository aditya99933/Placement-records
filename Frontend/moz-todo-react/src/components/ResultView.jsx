import Studentheader from "./Studentheader";
import Semesterfilter from "./Semesterfilter";
import GPAline from "../charts/GPAline";
import GPAPie from "../charts/GPAPie";
import SubjectTable from "./subjectTable";
import Semestertable from "./Semestertable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { calculateSemesterGpa } from "./calculateGPA";

const ResultView = ({ result}) => {
  const [selectedSemester, setSelectedSemester] = useState("ALL");

  const navigate = useNavigate();


  const semStats = selectedSemester !== "ALL"
    ? calculateSemesterGpa(result.subjects).find((s) => s.semester === `Sem ${selectedSemester}`)
    : null;

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <Studentheader student={result.studentInfo} />
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 px-5 py-2 rounded-xl text-white font-medium shadow-md transition"
        >
          🔍 Lookup Another Result
        </button>

        <Semesterfilter
          subjects={result.subjects}
          selected={selectedSemester}
          setSelected={setSelectedSemester}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GPAline subjects={result.subjects} />
          <GPAPie subjects={result.subjects} />
        </div>

        {semStats ? (
          <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-white">{semStats.semester} Summary</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-[#1a2332] rounded-xl p-5">
                <p className="text-gray-400 text-sm mb-1">Total Marks</p>
                <p className="text-3xl font-bold text-white">{semStats.totalMarks}</p>
              </div>
              <div className="bg-[#1a2332] rounded-xl p-5">
                <p className="text-gray-400 text-sm mb-1">Percentile</p>
                <p className="text-3xl font-bold text-white">{semStats.percentile}%</p>
              </div>
              <div className="bg-[#1a2332] rounded-xl p-5">
                <p className="text-gray-400 text-sm mb-1">SGPA</p>
                <p className="text-3xl font-bold text-green-400">{semStats.sgpa}</p>
              </div>
            </div>
          </div>
        ) : (
          <Semestertable subjects={result.subjects} />
        )}

        <SubjectTable subjects={result.subjects} selectedSemester={selectedSemester} />
      </div>
    </div>
  );
};

export default ResultView;
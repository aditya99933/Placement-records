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

        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GPAline subjects={result.subjects} />
          <GPAPie subjects={result.subjects} />
        </div>

        {semStats ? (
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* MARKS */}
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Marks</label>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-green-500">{semStats.totalMarks}</span>
                  <span className="text-2xl font-bold text-gray-600">/ {semStats.maxMarks}</span>
                </div>
                <p className="text-gray-500 text-sm">Total Marks Obtained</p>
              </div>

              {/* SGPA */}
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">SGPA</label>
                <p className="text-5xl font-black text-white">{semStats.sgpa}</p>
                <p className="text-gray-500 text-sm">Semester Grade Point Average</p>
              </div>

              {/* PERCENTAGE */}
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Percentage</label>
                <p className="text-5xl font-black text-green-500">{semStats.percentile}%</p>
                <p className="text-gray-500 text-sm">Percentage of Marks Obtained</p>
              </div>

              {/* TOTAL CREDITS */}
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Credits</label>
                <p className="text-5xl font-black text-white">{ "-"}</p>
                <p className="text-gray-500 text-sm">Total Credits for the Semester</p>
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
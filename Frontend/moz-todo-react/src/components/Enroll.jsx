import React from 'react'
import { useState } from 'react'

const Enroll = ({ setEnrollment, goNext }) => {
  const [value, setValue] = useState("");

  const handleNext = () => {
    if (!value) return;
    setEnrollment(value);
    goNext();
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-[#0f1115] border border-green-500/30 rounded-2xl p-10 shadow-xl">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center text-white mb-3">
          IPU Result Portal
        </h1>

        <p className="text-gray-400 text-center mb-10">
          Enter your credentials to view your result analysis
        </p>

        {/* INPUT */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm">
            Enrollment Number
          </label>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter Enrollment No."
            className="w-full mt-2 bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={handleNext}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          Next →
        </button>

        {/* FOOTER */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Data is fetched directly from GGSIPU Exam Portal.
        </p>

      </div>
    </div>
  );
}

export default Enroll
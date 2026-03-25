import React from 'react'

const Studentheader = ({student}) => {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#111827] border border-green-500/30 rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">{student.studentName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="text-gray-400 text-sm">Enrollment No.</label>
          <p className="text-white font-semibold mt-1">{student.enrollmentNumber}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Year of Admission</label>
          <p className="text-white font-semibold mt-1">{student.yearOfAdmission}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Institute</label>
          <p className="text-white font-semibold mt-1">{student.institute}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Program</label>
          <p className="text-white font-semibold mt-1">{student.program}</p>
        </div>
      </div>
    </div>
  )
}

export default Studentheader
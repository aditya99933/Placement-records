import React from 'react'

const Studentheader = ({student}) => {
  const getAcronym = (str) => {
    if (!str) return '';
    return str
      .split(/[\s-]+/)
      .filter(word => !['of', 'in', 'and', '&', 'at', 'the', 'for'].includes(word.toLowerCase()))
      .map(word => (word[0] || '').toUpperCase())
      .join('');
  };

  const formatProgram = (prog) => {
    if (!prog) return '';
    // Handle cases like "Bachelor of Technology (Electronics and Communication)"
    const bracketMatch = prog.match(/^(.*?)\s*\((.*?)\)$/);
    if (bracketMatch) {
      let degree = bracketMatch[1].trim();
      let branch = bracketMatch[2].trim();
      
      if (degree.toLowerCase().includes("bachelor of technology")) degree = "B.Tech";
      else if (degree.toLowerCase().includes("master of technology")) degree = "M.Tech";
      else degree = getAcronym(degree);
      
      return `${degree} (${getAcronym(branch)})`;
    }

    if (prog.toLowerCase().includes("bachelor of technology")) return "B.Tech";
    if (prog.toLowerCase().includes("bachelor of computer applications")) return "BCA";
    if (prog.toLowerCase().includes("master of computer applications")) return "MCA";
    return getAcronym(prog);
  };

  // Extract codes from enrollment number (Common format: AAA BBB CCC DD)
  const instCode = student.enrollmentNumber?.substring(3, 6);
  const progCode = student.enrollmentNumber?.substring(6, 9);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight uppercase">
        {student.studentName}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* ENROLLMENT NO. */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-green-500/50 transition duration-300">
          <div>
            <label className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Enrollment No.</label>
            <p className="text-white text-lg md:text-xl font-bold mt-2">{student.enrollmentNumber}</p>
          </div>
        </div>

        {/* YEAR OF ADMISSION */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-green-500/50 transition duration-300">
          <div>
            <label className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Year of Admission</label>
            <p className="text-white text-lg md:text-xl font-bold mt-2">{student.yearOfAdmission}</p>
          </div>
        </div>

        {/* INSTITUTE */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-green-500/50 transition duration-300">
          <div>
            <label className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Institute</label>
            <p className="text-white text-lg md:text-xl font-bold mt-2 leading-tight">
               <span className="hidden md:inline">{student.institute}</span>
               <span className="md:hidden">{getAcronym(student.institute)}</span>
            </p>
          </div>
          {instCode && (
            <div className="mt-4">
              <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-md text-xs font-bold">{instCode}</span>
            </div>
          )}
        </div>

        {/* PROGRAM */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:border-green-500/50 transition duration-300">
          <div>
            <label className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Program</label>
            <p className="text-white text-lg md:text-xl font-bold mt-2 leading-tight">
               <span className="hidden md:inline">{student.program}</span>
               <span className="md:hidden">{formatProgram(student.program)}</span>
            </p>
          </div>
          {progCode && (
            <div className="mt-4">
              <span className="bg-green-950/30 text-green-500 px-3 py-1 rounded-md text-xs font-bold border border-green-500/20">{progCode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Studentheader
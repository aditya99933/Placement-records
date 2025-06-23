import React from 'react'


function CompanyTable({ companies }) {
  const totalStudents = companies.reduce((sum, company) => sum + company.placed, 0);

  return (
    <div className="relative h-[600px] rounded-xl bg-black overflow-hidden">
      <div className="overflow-y-auto h-full scrollbar-hide">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
              <th className="text-left p-5 w-1/4 font-semibold text-gray-100">S.No</th>
              <th className="text-left p-5 w-1/4 font-semibold text-gray-100">Company Name</th>
              <th className="text-left p-5 w-1/4 font-semibold text-gray-100">Package (LPA)</th>
              <th className="text-left p-5 w-1/4 font-semibold text-gray-100">Students Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {companies.map((company, index) => (
              <tr
                key={company.name}
                className="transition-colors duration-200 hover:bg-gray-800"
              >
                <td className="p-5 text-gray-300">{index + 1}</td>
                <td className="p-5 text-gray-300">{company.name}</td>
                <td className="p-5 text-gray-300">{company.package}</td>
                <td className="p-5 text-gray-300">{company.placed}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 z-10">
            <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
              <td className="p-5"></td>
              <td className="p-5 font-semibold text-gray-100">Total</td>
              <td className="p-5"></td>
              <td className="p-5 font-semibold text-gray-100">{totalStudents}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default CompanyTable;


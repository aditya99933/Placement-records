import React from 'react'

function Statistics({stats}) {
  return (
    <div className="flex flex-row items-stretch justify-between gap-2 md:gap-4 mb-10 bg-[rgba(184,195,243,0.1)] backdrop-blur-lg border border-indigo-200 rounded-xl p-2 md:p-4 shadow-md overflow-x-auto min-w-0">
      <div className="flex-1 min-w-0 text-center flex flex-col justify-center px-2 md:px-4">
        <p className="text-gray-400 text-sm whitespace-nowrap">Total Placements</p>
        <p className="text-2xl font-bold text-green-400 whitespace-nowrap">{stats.totalPlaced}</p>
      </div>
      <div className="flex-1 min-w-0 text-center flex flex-col justify-center px-2 md:px-4 border-l border-r border-indigo-200 last:border-r-0 first:border-l-0">
        <p className="text-gray-400 text-sm whitespace-nowrap">Average Package</p>
        <p className="text-2xl font-bold text-green-400 whitespace-nowrap">{stats.avgPackage} LPA</p>
      </div>
      <div className="flex-1 min-w-0 text-center flex flex-col justify-center px-2 md:px-4">
        <p className="text-gray-400 text-sm whitespace-nowrap">Highest Package</p>
        <p className="text-2xl font-bold text-green-400 whitespace-nowrap">{stats.highestPackage} LPA</p>
      </div>
    </div>
  )
}

export default Statistics
import React from 'react'

function Statistics({stats}) {
  return (
    <div className="grid grid-cols-3 gap-4.3 mb-10 bg-[rgba(184,195,243,0.1)] backdrop-blur-lg border border-indigo-200 rounded-xl p-4 shadow-md">
      <div className="text-center">
        <p className="text-gray-400 text-sm">Total Placements</p>
        <p className="text-2xl font-bold text-green-400">{stats.totalPlaced}</p>
      </div>
      <div className="text-center border-x border-indigo-200">
        <p className="text-gray-400 text-sm">Average Package</p>
        <p className="text-2xl font-bold text-green-400">{stats.avgPackage} LPA</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm">Highest Package</p>
        <p className="text-2xl font-bold text-green-400">{stats.highestPackage} LPA</p>
      </div>
    </div>
  )
}

export default Statistics
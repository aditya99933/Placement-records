import React from 'react'

function BatchSelector({ batches, selectedBatch, onBatchSelect }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {batches.map((batch) => (
          <button
            key={batch}
            onClick={() => onBatchSelect(batch)}
            className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
              selectedBatch === batch
                ? "bg-gradient-to-r from-green-400 to-green-800 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Batch {batch}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BatchSelector
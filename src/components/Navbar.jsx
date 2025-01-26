import React from 'react'

function Navbar() {
  return (
    <nav className="fixed w-full top-0 bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-green-500">ADGIPS HUB</div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
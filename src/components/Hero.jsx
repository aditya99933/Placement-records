import React from 'react'

function Hero() {
  return (
    <div className="bg-[url('/images/hero-bg.jpg')] bg-cover bg-center">
      <div className="bg-black py5">
        <div className="text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 p-4 [text-stroke:2px_white] bg-gradient-to-r from-green-400 to-green-700 text-transparent bg-clip-text">
            Placement Records 
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Hero
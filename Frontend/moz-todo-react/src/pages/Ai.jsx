import React from 'react'
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import Chatbot from '../components/Chatbot';
import Chatai from '../components/Chatai';
import { useState, useEffect } from 'react';

const Ai = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div></div>
        {!token ? (
            <Chatbot onAuthSuccess={setToken} />
        ) : (
            <Chatai token={token} />
        )}
        <div className="mb-15 md:mb-0">
          <Footer />
        </div>
    </div>
  )
}

export default Ai;
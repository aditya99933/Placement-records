import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResultForm from '../components/ResultForm';
import { useState } from 'react';
import ResultView from '../components/ResultView';
import Enroll from '../components/Enroll';

const Result = () => {
   const [step, setStep] = useState(1);
   const [enrollment, setEnrollment] = useState("");
   const [result, setResult] = useState(null);
   const [status, setStatus] = useState("");
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black text-white py-10">
        <div className="container mx-auto px-4">
          {step === 1 && (
            <Enroll
              setEnrollment={setEnrollment}
              goNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <ResultForm
              enrollment={enrollment}
              setEnrollment={setEnrollment}
              setResult={setResult}
              status={status}
              setStatus={setStatus}
              goNext={() => setStep(3)}
             />
          )}
          {step === 3 && (
            <ResultView enrollment={enrollment} result={result} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Result
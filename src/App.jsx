import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BatchSelector from "./components/BatchSelector";
import Statistics from "./components/Statistics";
import CompanyTable from "./components/CompanyTable";
import Footer from "./components/Footer";
import { batchData2018_22 } from './data/Batch2018_22';
import { batchData2019_23 } from './data/Batch2019_23';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from '@vercel/analytics/react'

function App() {
  // Define available batches
  const batches = ["2018-22", "2019-23"];
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);

  // Get current batch data
  const currentBatchData = selectedBatch === "2018-22" 
    ? batchData2018_22 
    : batchData2019_23;

    const stats = {
      totalCompanies: currentBatchData.length,
      totalPlaced: currentBatchData.reduce((sum, company) => sum + company.placed, 0),
      avgPackage: (
        currentBatchData.reduce((sum, company) => sum + parseFloat(company.package), 0) /
        currentBatchData.length
      ).toFixed(2),
      highestPackage: Math.max(...currentBatchData.map(company => parseFloat(company.package))),
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white font-poppins flex flex-col">
      <Navbar />
      <main className="pt-16 flex-grow">
        <div>
          <Hero />
          <BatchSelector 
            batches={batches} 
            selectedBatch={selectedBatch} 
            onBatchSelect={setSelectedBatch} 
          />
          <div className="max-w-7xl mx-auto px-4 pb-16">
            <h2 className="text-3xl font-normal mb-2 py-2">
              Dr. Akhilesh Das Gupta Institute of Professional Studies  - Batch {selectedBatch}
            </h2>
            <Statistics stats={stats} />
            <CompanyTable companies={currentBatchData} />
          </div>
        </div>
      </main>
      <Footer />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;





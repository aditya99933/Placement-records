import "./App.css";
import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BatchSelector from "./components/BatchSelector";
import Statistics from "./components/Statistics";
import CompanyTable from "./components/CompanyTable";
import Footer from "./components/Footer";
import Charts from "./components/Charts";
import { batchData2018_22 } from './data/Batch2018_22';
import { batchData2019_23 } from './data/Batch2019_23';
import { batchData2020_24 } from './data/Batch2020_24';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const batches = ["2018-22", "2019-23", "2020-24"];
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);

  const batchDataMap = {
    "2018-22": batchData2018_22,
    "2019-23": batchData2019_23,
    "2020-24": batchData2020_24
  };
  const currentBatchData = batchDataMap[selectedBatch];
  const [showMassHiring, setShowMassHiring] = useState(false);
  const filteredCompanies = showMassHiring 
  ? currentBatchData.filter(company => company.placed > 10)
  : currentBatchData;

  const stats = {
    totalCompanies: currentBatchData.length,
    totalPlaced: currentBatchData.reduce((sum, company) => sum + company.placed, 0),
    avgPackage: (
      currentBatchData.reduce((sum, company) => sum + parseFloat(company.package), 0) /
      currentBatchData.length
    ).toFixed(2),
    highestPackage: Math.max(...currentBatchData.map(company => parseFloat(company.package))),
    massHiring: currentBatchData.filter(company => company.placed > 10).length
  };

  return (
    <div>
      <SpeedInsights />
      <Analytics />
      <Routes>
        <Route
          path="/"
          element={
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
                      Dr. Akhilesh Das Gupta Institute of Professional Studies - Batch {selectedBatch}
                    </h2>
                    <Statistics stats={stats} />
                    
                    {/* Modified for better mobile responsiveness */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                      <h3 className="text-xl font-semibold">Company Details</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        {/* Filter Toggle Switch */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={showMassHiring}
                              onChange={(e) => setShowMassHiring(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                          </label>
                          <span className="text-sm font-medium whitespace-nowrap">
                            Show Mass Hiring Companies 
                          </span>
                        </div>
                        <Link
                          to={`/charts/${selectedBatch}`}
                          className="bg-green-700 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto text-center"
                        >
                          View Charts
                        </Link>
                      </div>
                    </div>
                    
                    {/* Display filtered results count */}
                    {showMassHiring && (
                      <div className="text-sm text-gray-400 mb-2">
                        Showing {filteredCompanies.length} companies with more than 10 offers
                      </div>
                    )}
                    <CompanyTable companies={filteredCompanies} />
                  </div>
                </div>
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/charts/:batch" element={<Charts />} />
      </Routes>
    </div>
  );
}

export default App;

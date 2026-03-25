import Navbar from "../components/Navbar.jsx";
import JobList from "../components/JobList";
import Campus from "./Campus";
import Footer from "../components/Footer.jsx";
import { Link, useLocation } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { useState, useEffect } from "react";

const Jobs = () => {
  const location = useLocation();
  const isCampusPage = location.pathname.includes("campus");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(token && adminStatus === "true");
  }, []);
  
  return (
    <>
      <Navbar />

      <div className="bg-black text-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-green-500">
                Available Jobs
              </h1>
              
              {/* Mobile Filter Button */}
              {!isCampusPage && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileFilter'))}
                  className="md:hidden bg-green-600 p-2 rounded-lg"
                >
                  <Filter size={20} />
                </button>
              )}
            </div>

            {isAdmin && !isCampusPage && (
              <Link
                to="/add-job"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
              >
                <Plus size={18} />
                Add Job
              </Link>
            )}
          </div>

          {/* Toggle */}
          <div className="bg-[#111827] p-1 rounded-xl flex mb-10">
            <Link
              to="/jobs"
              className={`flex-1 text-center py-3 rounded-lg transition ${
                !isCampusPage
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-400"
              }`}
            >
              Off-Campus Jobs
            </Link>

            <Link
              to="/campus"
              className={`flex-1 text-center py-3 rounded-lg transition ${
                isCampusPage
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-400"
              }`}
            >
              Campus Drives
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 Conditional Rendering */}
      {isCampusPage ? <Campus /> : <JobList showFilters />}

      <Footer />
    </>
  );
};

export default Jobs;
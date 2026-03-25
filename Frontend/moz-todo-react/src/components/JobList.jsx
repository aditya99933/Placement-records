import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Trash2, Filter, X,  } from "lucide-react";
import { Link } from "react-router-dom";
import Toast from "./Toast";

const JobList = ({ showFilters = true }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "All Jobs",
    jobType: "All Types",
    experience: "All Experience Levels",
  });

  useEffect(() => {
    const handleToggle = () => setMobileFilterOpen(true);
    window.addEventListener('toggleMobileFilter', handleToggle);
    return () => window.removeEventListener('toggleMobileFilter', handleToggle);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "https://placement-records.onrender.com/api/jobs"
        );
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(token && adminStatus === "true");

    fetchJobs();
  }, []);
  
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?"))
      return;

    try {
      await axios.delete(
        `https://placement-records.onrender.com/api/jobs/${jobId}`
      );

      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);

      setToast({ message: "Job deleted successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to delete job", type: "error" });
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.category !== "All Jobs") {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.jobType !== "All Types") {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    if (filters.experience !== "All Experience Levels") {
      filtered = filtered.filter(
        (job) => job.experience === filters.experience
      );
    }

    setFilteredJobs(filtered);
    setMobileFilterOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] md:hidden">
          <div className="bg-[#0f172a] h-full w-80 p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {[
                "All Jobs",
                "Frontend",
                "Analyst",
                "Backend",
                "Full Stack",
                "AI Engineer",
                "Software Engineer",
                "UI/UX Designer",
                "Devops Engineer",
              ].map((category) => (
                <label key={category} className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-green-500"
                    checked={filters.category === category}
                    onChange={() =>
                      setFilters((prev) => ({ ...prev, category }))
                    }
                  />
                  {category}
                </label>
              ))}
            </div>

            <select
              className="w-full bg-gray-800 p-2 rounded mb-3"
              value={filters.jobType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  jobType: e.target.value,
                }))
              }
            >
              <option>All Types</option>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>

            <select
              className="w-full bg-gray-800 p-2 rounded mb-4"
              value={filters.experience}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experience: e.target.value,
                }))
              }
            >
              <option>All Experience Levels</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>

            <button
              onClick={applyFilters}
              className="w-full bg-green-600 py-2 rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 flex gap-6">

        {/* Desktop Filters */}
        {showFilters && (
          <aside className="w-72 bg-[#0f172a] p-5 hidden md:block rounded-2xl h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Category */}
            <div className="space-y-2 mb-4">
              {[
                "All Jobs",
                "Frontend",
                "Analyst",
                "Backend",
                "Full Stack",
                "AI Engineer",
                "Software Engineer",
                "UI/UX Designer",
                "Devops Engineer",
              ].map((category) => (
                <label key={category} className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-green-500"
                    checked={filters.category === category}
                    onChange={() =>
                      setFilters((prev) => ({ ...prev, category }))
                    }
                  />
                  {category}
                </label>
              ))}
            </div>

            {/* Job Type */}
            <select
              className="w-full bg-gray-800 p-2 rounded mb-3"
              value={filters.jobType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  jobType: e.target.value,
                }))
              }
            >
              <option>All Types</option>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>

            {/* Experience */}
            <select
              className="w-full bg-gray-800 p-2 rounded mb-4"
              value={filters.experience}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experience: e.target.value,
                }))
              }
            >
              <option>All Experience Levels</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>

            <button
              onClick={applyFilters}
              className="w-full bg-green-600 py-2 rounded-lg"
            >
              Apply Filters
            </button>
          </aside>
        )}

        {/* Job Cards */}
        <div className="flex-1 space-y-6 pb-16">

          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="relative bg-gradient-to-br from-[#0f172a] to-[#111827] border border-[#1f2937] p-6 rounded-2xl flex flex-col md:flex-row justify-between"
              >
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {job.title}
                  </h2>
                  <p className="text-gray-400">{job.company}</p>

                  <div className="flex gap-3 my-3 text-sm">
                    <span className="flex items-center gap-1 text-blue-400">
                      <MapPin size={14} />
                      {job.location}
                    </span>

                    <span className="bg-blue-600 px-3 py-1 rounded-full text-xs">
                      {job.jobType}
                    </span>

                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs">
                      {job.experience}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm">
                    {job.description?.slice(0, 120)}...
                  </p>
                </div>

                <div className="flex items-center mt-4 md:mt-0">
                  <Link
                    to={`/job-details/${job._id}`}
                    className="border border-gray-500 px-5 py-2 rounded-xl hover:border-green-500 transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Briefcase,
  Trash2,
} from "lucide-react";

const Campus = () => {
  const [campusJobs, setCampusJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCampusJobs = async () => {
      try {
        const { data } = await axios.get(
          "https://placement-records.onrender.com/api/campus"
        );
        setCampusJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(token && adminStatus === "true");

    fetchCampusJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this campus job?")) return;

    try {
      await axios.delete(
        `https://placement-records.onrender.com/api/campus/${jobId}`
      );
      setCampusJobs(campusJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black text-white pb-6 ">
      <div className="max-w-7xl mx-auto px-4 ">

        {loading ? (
          <div className="text-gray-400">Loading campus jobs...</div>
        ) : campusJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campusJobs.map((job) => (
              <div
                key={job._id}
                className="bg-gradient-to-br from-[#0f172a] to-[#111827] border border-[#1f2937] rounded-2xl p-6 shadow-lg hover:border-green-500 transition-all duration-300 relative"
              >
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <h3 className="text-xl font-semibold mb-1">
                  {job.title}
                </h3>

                <p className="text-green-400 font-medium mb-4">
                  {job.company}
                </p>

                {job.branch && (
                  <div className="flex gap-2 mb-2 text-gray-300">
                    <GraduationCap size={16} className="text-purple-400 mt-1" />
                    Eligible: {job.branch}
                  </div>
                )}

                {job.location && (
                  <div className="flex gap-2 mb-2 text-gray-300">
                    <MapPin size={16} className="text-blue-400 mt-1" />
                    Location: {job.location}
                  </div>
                )}

                {job.jobType && (
                  <div className="flex gap-2 mb-2 text-gray-300">
                    <Briefcase size={16} className="text-orange-400 mt-1" />
                    Type: {job.jobType}
                  </div>
                )}

                <div className="flex gap-2 mb-2 text-gray-300">
                  <DollarSign size={16} className="text-yellow-400 mt-1" />
                  Package: {job.salary || "Not Disclosed"}
                </div>

                <div className="flex gap-2 mb-6 text-gray-300">
                  <Calendar size={16} className="text-red-400 mt-1" />
                  Last Date:{" "}
                  {job.lastDate
                    ? new Date(job.lastDate).toLocaleDateString()
                    : "Not Specified"}
                </div>

                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink size={16} />
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            No campus jobs available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Campus;
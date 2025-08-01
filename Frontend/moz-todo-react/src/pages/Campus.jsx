import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Calendar, DollarSign, MapPin, GraduationCap, Briefcase, Trash2 } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const JobSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl p-6 shadow-lg animate-pulse">
    {/* Job Title */}
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
    
    {/* Company Name */}
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
    
    {/* Job Details */}
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-28"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-36"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-40"></div>
      </div>
    </div>
    
    {/* Apply Button */}
    <div className="h-10 bg-gray-700 rounded-lg w-full"></div>
  </div>
);

const Campus = () => {
  const [campusJobs, setCampusJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchCampusJobs = async () => {
      try {
        const { data } = await axios.get('https://placement-records.onrender.com/api/campus');
        setCampusJobs(data);
      } catch (error) {
        console.error('Error fetching campus jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(token && adminStatus === 'true');

    fetchCampusJobs();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this campus job?')) {
      try {
        await axios.delete(`https://placement-records.onrender.com/api/campus/${jobId}`);
        setCampusJobs(campusJobs.filter(job => job._id !== jobId));
        showToast('Campus job deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting campus job:', error);
        showToast('Failed to delete campus job', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-green-500 mb-6 text-left">Ongoing Campus Drives</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : campusJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusJobs.map((job) => (
              <div key={job._id} className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative">

                {/* Delete Button - Top Right Corner */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition"
                    title="Delete Campus Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Job Title */}
                <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>

                {/* Company Name */}
                <p className="text-green-400 font-medium mb-4">{job.company}</p>

                {/* Eligible Branches */}
                {job.branch && (
                  <div className="flex items-start gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Eligible: {job.branch}</span>
                  </div>
                )}

                {/* Location */}
                {job.location && (
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Location: {job.location}</span>
                  </div>
                )}

                {/* Job Type */}
                {job.jobType && (
                  <div className="flex items-start gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Type: {job.jobType}</span>
                  </div>
                )}

                {/* Package Offered */}
                <div className="flex items-start gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Package: {job.salary || 'Not Disclosed'}</span>
                </div>

                {/* Last Date */}
                <div className="flex items-start gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Last Date: {job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'Not Specified'}</span>
                </div>

                {/* Apply Link */}
                {job.url ? (
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    No application link available
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>No campus jobs available at the moment.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Campus;

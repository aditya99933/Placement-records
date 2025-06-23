import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Plus, Trash2, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from './Toast';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All Jobs',
    jobType: 'All Types',
    experience: 'All Experience Levels'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs');
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // Check admin status
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(token && adminStatus === 'true');
    
    fetchJobs();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const applyFilters = () => {
    let filtered = jobs;
    
    if (filters.category !== 'All Jobs') {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.category.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.jobType !== 'All Types') {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters.experience !== 'All Experience Levels') {
      filtered = filtered.filter(job => job.experience === filters.experience);
    }
    
    setFilteredJobs(filtered);
    setShowFilters(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
        const updatedJobs = jobs.filter(job => job._id !== jobId);
        setJobs(updatedJobs);
        setFilteredJobs(filteredJobs.filter(job => job._id !== jobId));
        showToast('Job deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting job:', error);
        showToast('Failed to delete job', 'error');
      }
    }
  };

  return (
    <div className="flex bg-black min-h-screen text-white relative">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Desktop Filters Sidebar */}
      <aside className="w-72 bg-gray-900 p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Job Categories</h3>
            <ul className="space-y-1">
              {['All Jobs', 'Frontend', 'Analyst', 'Backend', 'Full Stack', 'AI Engineer', 'Software Engineer','UI/UX Designer','Devops Engineer' ].map((category) => (
                <li key={category}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      className="accent-green-500" 
                      checked={filters.category === category}
                      onChange={() => handleFilterChange('category', category)}
                    />
                    <span>{category}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Job Type</h3>
            <select 
              className="w-full bg-gray-800 p-2 rounded text-white"
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
            >
              <option>All Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
          <div>
            <h3 className="font-medium mb-1">Experience Level</h3>
            <select 
              className="w-full bg-gray-800 p-2 rounded text-white"
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option>All Experience Levels</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>
          <button 
            className="w-full bg-green-600 py-2 rounded hover:bg-green-700 transition"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-lg p-4 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Content */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Job Categories</h3>
                <ul className="space-y-2">
                  {['All Jobs', 'Frontend', 'Analyst', 'Backend', 'Full Stack', 'AI Engineer', 'Software Engineer','UI/UX Designer','Devops Engineer'].map((category) => (
                    <li key={category}>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="mobileCategory" 
                          className="accent-green-500" 
                          checked={filters.category === category}
                          onChange={() => handleFilterChange('category', category)}
                        />
                        <span>{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Job Type</h3>
                <select 
                  className="w-full bg-gray-800 p-3 rounded text-white"
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  <option>All Types</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <h3 className="font-medium mb-2">Experience Level</h3>
                <select 
                  className="w-full bg-gray-800 p-3 rounded text-white"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                  <option>All Experience Levels</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <button 
                className="w-full bg-green-600 py-3 rounded hover:bg-green-700 transition"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Cards */}
      <main className="flex-1 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-green-500">Available Jobs</h2>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          
          {isAdmin && (
            <Link
              to="/add-job"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </Link>
          )}
        </div>
        
        {loading ? (
          <p className="text-gray-400">Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-gray-800 rounded p-4 shadow flex flex-col md:flex-row justify-between relative">
              {/* Delete Button - Top Right Corner */}
              {isAdmin && (
                <button
                  onClick={() => handleDelete(job._id)}
                  className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.company}</p>
                <div className="flex gap-2 my-2 text-sm">
                  <span className="flex items-center gap-1 text-blue-400">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="bg-green-800 px-2 py-0.5 rounded text-green-300 text-xs">{job.jobType}</span>
                  <span className="bg-yellow-700 px-2 py-0.5 rounded text-yellow-300 text-xs">{job.experience || 'Not Specified'}</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{job.description ? job.description.slice(0, 150) : ''}...</p>
              </div>
              
              <div className="flex flex-col gap-2 justify-center md:items-end mt-2 md:mt-0">
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-4 h-4" /> {job.postedAgo || '2 days ago'}
                </span>
                <div className="flex gap-2">
                  <Link to={`/job-details/${job._id}`} className="border border-gray-400 px-3 py-1 rounded text-gray-300 text-sm hover:bg-gray-700 transition">View Details</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No jobs match your filters.</p>
        )}
      </main>
    </div>
  );
};

export default JobList;
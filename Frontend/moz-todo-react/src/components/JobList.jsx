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
        const { data } = await axios.get('https://placement-records.onrender.com/api/jobs');
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
        await axios.delete(`https://placement-records.onrender.com/api/jobs/${jobId}`);
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
    <div className="flex bg-black min-h-screen text-white relative w-full">
      <div className="fixed inset-0 bg-black z-[-1]" />
      <div className="flex w-full max-w-7xl mx-auto px-2 md:px-4">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Desktop Filters Sidebar */}
        <aside className="w-72 bg-gray-900 p-4 hidden md:block sticky top-24 self-start h-fit rounded-2xl">
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
                className="w-full bg-gray-800 p-2 rounded pr-10 text-white appearance-none"
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
                className="w-full bg-gray-800 p-2 rounded pr-10 text-white appearance-none"
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
              className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
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
                    className="w-full bg-gray-800 p-3 rounded pr-10 text-white appearance-none"
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
                    className="w-full bg-gray-800 p-3 rounded pr-10 text-white appearance-none"
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
              <div key={job._id} className="bg-gray-900 rounded-xl p-4 shadow flex flex-col md:flex-row justify-between relative">
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
                
                {/* Desktop: View Details Button at bottom right, posted time stays at bottom left */}
                <div className="flex-1 flex flex-col justify-between">
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <p className="text-gray-300 text-sm mb-3 mr-1 flex-1">{job.description ? job.description.slice(0, 120) : ''}...</p>
                      <div className="hidden md:flex w-full md:w-auto justify-end md:ml-4 mb-3 md:mb-0">
                        <Link
                          to={`/job-details/${job._id}`}
                          className="inline-flex items-center gap-2 border border-white px-4 py-2 rounded-lg text-white hover:bg-gray-700 hover:text-white transition text-base font-semibold shadow-md"
                        >
                          View Details
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3' />
                          </svg>
                        </Link>
                      </div>
                    </div>
                    
                  </div>
                  {/* Mobile: 2 Days Ago left, View Details right, same row */}
                  <div className="flex flex-col gap-2 justify-center mt-2 md:hidden">
                    <div className="flex flex-row items-center justify-between w-full">
                      <span className="flex items-center gap-2 text-gray-400 text-xs">
                        {job.postedAgo || '2 Days Ago'}
                      </span>
                      <Link to={`/job-details/${job._id}`} className="inline-flex items-center gap-2 border border-white px-4 py-2 rounded-lg text-white hover:bg-gray-700 hover:text-white transition text-base font-semibold shadow-md ">
                        View Details
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3' />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No jobs match your filters.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobList;

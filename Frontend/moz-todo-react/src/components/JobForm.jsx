import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const JobForm = () => {
  const [mode, setMode] = useState('manual'); // 'scrape', 'manual', 'fallback', 'campus'
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    experience: '',
    description: '',
    url: '',
    applyLink: '',
    branch: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let payload = {};
      let apiEndpoint = 'http://localhost:5000/api/jobs';
      
      // Convert plain text to HTML with line breaks
      const convertToHtml = (text) => {
        if (!text) return '';
        return text
          .replace(/\n/g, '<br>')
          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      };
      
      if (mode === 'campus') {
        // Campus job mode
        payload = {
          title: formData.title,
          company: formData.company,
          url: formData.applyLink,
          branch: formData.branch,
          salary: formData.salary,
          location: formData.location
        };
        apiEndpoint = 'http://localhost:5000/api/campus';
      } else if (mode === 'scrape') {
        payload = {
          url: formData.url,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          jobType: formData.jobType,
          experience: formData.experience
        };
      } else if (mode === 'manual') {
        payload = {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          jobType: formData.jobType,
          experience: formData.experience,
          description: formData.description,
          descriptionHtml: convertToHtml(formData.description),
          applyLink: formData.applyLink
        };
      } else if (mode === 'fallback') {
        payload = {
          url: formData.url,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          jobType: formData.jobType,
          experience: formData.experience,
          description: formData.description,
          descriptionHtml: convertToHtml(formData.description),
          applyLink: formData.applyLink
        };
      }

      await axios.post(apiEndpoint, payload);
      setMessage(`${mode === 'campus' ? 'Campus job' : 'Job'} created successfully!`);
      setFormData({
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        applyLink: '',
        branch: '',
        salary: '',
        lastDate: '',
      });
    } catch (error) {
      setMessage('Error creating job: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black p-4 pb-20 md:pb-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-green-500 mb-6">Add New Job</h2>
          
          {/* Mode Selection */}
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">Job Creation Mode</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="scrape"
                  checked={mode === 'scrape'}
                  onChange={(e) => setMode(e.target.value)}
                  className="accent-green-500"
                />
                <span className="text-white">Scrape Only</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={mode === 'manual'}
                  onChange={(e) => setMode(e.target.value)}
                  className="accent-green-500"
                />
                <span className="text-white">Manual Only</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="fallback"
                  checked={mode === 'fallback'}
                  onChange={(e) => setMode(e.target.value)}
                  className="accent-green-500"
                />
                <span className="text-white">Scrape with Fallback</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="campus"
                  checked={mode === 'campus'}
                  onChange={(e) => setMode(e.target.value)}
                  className="accent-green-500"
                />
                <span className="text-white">Campus Job</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-4">
            {/* URL Field - only for scrape and fallback modes */}
            {(mode === 'scrape' || mode === 'fallback') && (
              <input
                type="url"
                name="url"
                placeholder="Job URL *"
                value={formData.url}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                required
              />
            )}

            {/* Basic Info - always required */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Job Title *"
                value={formData.title}
                onChange={handleChange}
                className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                required
              />
              
              <input
                type="text"
                name="company"
                placeholder="Company *"
                value={formData.company}
                onChange={handleChange}
                className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                required
              />
            </div>

            {/* Campus-specific fields */}
            {mode === 'campus' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location *"
                    value={formData.location}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                    required
                  />
                  
                  <input
                    type="text"
                    name="branch"
                    placeholder="Branch *"
                    value={formData.branch}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="salary"
                    placeholder="Package Offered *"
                    value={formData.salary}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                    required
                  />
                  
                  <input
                    type="url"
                    name="applyLink"
                    placeholder="Apply Link *"
                    value={formData.applyLink}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                    required
                  />
                  <input
                    type="date"
                    name="lastDate"
                    placeholder="Last Date *"
                    value={formData.lastDate}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                    required
                     />
                </div>
              </>
            )}

            {/* Regular job fields - not for campus mode */}
            {mode !== 'campus' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                  />
                  
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                >
                  <option value="">Select Experience Level</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                </select>

                {/* Apply Link - only for manual mode */}
                {mode === 'manual' && (
                  <input
                    type="url"
                    name="applyLink"
                    placeholder="Apply Link (optional)"
                    value={formData.applyLink}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                  />
                )}

                {/* Description Field - only for manual and fallback modes */}
                {(mode === 'manual' || mode === 'fallback') && (
                  <textarea
                    name="description"
                    placeholder={mode === 'fallback' ? "Fallback Job Description (used if scraping fails)" : "Job Description - Type exactly as you want it to appear"}
                    value={formData.description}
                    onChange={handleChange}
                    rows="8"
                    className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                  />
                )}
              </>
            )}
            
            {/* Mode-specific help text */}
            <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded">
              {mode === 'scrape' && "Job description will be scraped from the URL. Provide basic job info for better results."}
              {mode === 'manual' && "Type your job description exactly as you want it to appear. Press Enter for new lines."}
              {mode === 'fallback' && "Job description will be scraped from URL. If scraping fails, the manual description will be used as fallback."}
              {mode === 'campus' && "Add campus placement opportunities with required details for students."}
            </div>
            
            {message && (
              <p className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Create ${mode === 'campus' ? 'Campus Job' : 'Job'}`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobForm;
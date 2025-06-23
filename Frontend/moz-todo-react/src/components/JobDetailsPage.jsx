import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const renderDescription = () => {
    if (!job) return null;
    
    // Try to get the best description text
    let text = '';
    
    if (job.description && typeof job.description === 'string') {
      text = job.description;
    } else if (job.descriptionHtml) {
      // Strip HTML tags and convert <br> to newlines
      text = job.descriptionHtml
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ');
    }
    
    if (!text) return <p className="text-gray-300">No description available</p>;
    
    return text.split('\n').map((line, index) => {
      // Skip empty lines but add spacing
      if (!line.trim()) {
        return <div key={index} className="h-3"></div>;
      }
      
      const trimmedLine = line.trim();
      
      // More flexible bullet point detection
      if (trimmedLine.startsWith('•') || 
          trimmedLine.startsWith('-') || 
          trimmedLine.startsWith('*') ||
          trimmedLine.startsWith('- ') ||
          trimmedLine.startsWith('* ') ||
          trimmedLine.startsWith('• ')) {
        
        // Remove the bullet character and any following spaces
        const bulletText = trimmedLine.replace(/^[•\-\*]\s*/, '');
        
        return (
          <div key={index} className="flex items-start mb-3">
            <span className="text-green-400 font-bold mr-3 mt-1 text-lg">•</span>
            <span className="text-gray-300 leading-relaxed flex-1">{bulletText}</span>
          </div>
        );
      }
      
      // Regular line
      return (
        <p key={index} className="text-gray-300 mb-4 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!job) return <div className="p-4 text-white">Job not found.</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="px-4 py-6 max-w-5xl mx-auto text-gray-100">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-2">
          <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/jobs" className="hover:underline">Jobs</Link> &gt; {job.title}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{job.title}</h1>
        <div className="text-lg text-gray-400 mb-4">{job.company} | {job.location}</div>

        {/* Social Buttons */}
        <div className="flex space-x-3 mb-6">
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded hover:bg-gray-700">🔗</a>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-6">About the Job</h2>

        {/* Job Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="space-y-1">
            {renderDescription()}
          </div>
        </div>

        {/* Apply Button */}
        {job.applyLink && (
          <div className="mt-6">
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
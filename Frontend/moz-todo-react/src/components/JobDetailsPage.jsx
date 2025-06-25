import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import { ExternalLink } from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`https://placement-records.onrender.com/api/jobs/${id}`);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Link copied to clipboard!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to copy link', type: 'error' });
    }
  };

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
    
    return text.split('\n').map((line, index, arr) => {
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
      // Detect subheadings: not a bullet, not empty, surrounded by empty lines or Title Case/ALL CAPS
      const prevEmpty = index === 0 || !arr[index - 1].trim();
      const nextEmpty = index === arr.length - 1 || !arr[index + 1].trim();
      const isLikelyHeading =
        prevEmpty && nextEmpty &&
        trimmedLine.length < 60 &&
        /([A-Z][a-z]+\s)+[A-Z][a-z]+/.test(trimmedLine) ||
        /^[A-Z\s]+$/.test(trimmedLine);
      if (isLikelyHeading) {
        return (
          <p key={index} className="text-gray-100 font-semibold text-lg mb-2 mt-4">{line}</p>
        );
      }
      // Regular line
      return (
        <p key={index} className="text-gray-300 mb-4 leading-relaxed">{line}</p>
      );
    });
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!job) return <div className="p-4 text-white">Job not found.</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="px-4 py-6 max-w-5xl mx-auto text-gray-100 pb-4 md:pb-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-2">
          <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/jobs" className="hover:underline">Jobs</Link> &gt; {job.title}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{job.title}</h1>
        <div className="text-lg text-gray-400 mb-4">{job.company} | {job.location}</div>

        <h2 className="text-3xl font-bold text-white mb-6">About the Job</h2>
        {/* Job Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 w-full">
          <div className="space-y-1">
            {renderDescription()}
          </div>
        </div>

        {/* Apply & Copy Buttons */}
        {(job.applyLink || true) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {job.applyLink && (
              <a 
                href={job.applyLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Apply Now
              </a>
            )}
            <button 
              onClick={copyToClipboard}
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition gap-2"
              title="Copy link to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75M15.75 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h7.5A2.25 2.25 0 0115.75 6z" />
              </svg>
              Copy & Share
            </button>
          </div>
        )}
      </div>
      <div className="mb-15 md:mb-0">
        <Footer />
      </div>
    </div>
  );
}
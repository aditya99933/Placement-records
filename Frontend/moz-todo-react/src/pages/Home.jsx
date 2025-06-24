import { Link } from 'react-router-dom';
import { Briefcase, Users, GraduationCap, TrendingUp, Building, MapPin } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-green-500">ADGIPS Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your complete tech career platform. Find jobs, explore placement records, and advance your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/jobs" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Explore Jobs
            </Link>
            <Link 
              to="/placement" 
              className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-8 py-3 rounded-lg font-medium transition"
            >
              View Placements
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What We <span className="text-green-500">Offer</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Job Portal Card */}
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition">
              <div className="flex items-center mb-4">
                <Briefcase className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold">Job Portal</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Discover latest job opportunities from top companies. Apply directly and track your applications.
              </p>
              <Link to="/jobs" className="text-green-500 hover:text-green-400 font-medium">
                Browse Jobs →
              </Link>
            </div>

            {/* Placement Records Card */}
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold">Placement Stats</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Explore detailed placement statistics, company-wise data, and salary trends across batches.
              </p>
              <Link to="/placement" className="text-blue-500 hover:text-blue-400 font-medium">
                View Statistics →
              </Link>
            </div>

            {/* Campus Placements Card */}
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition">
              <div className="flex items-center mb-4">
                <GraduationCap className="w-8 h-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold">Campus Jobs</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Access exclusive campus placement opportunities and recruitment drives for students.
              </p>
              <Link to="/campus" className="text-purple-500 hover:text-purple-400 font-medium">
                Explore Campus →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-green-500">Impact</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">15+</div>
              <div className="text-gray-300">Daily Job Postings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">3 Years</div>
              <div className="text-gray-300">Placement Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">5+</div>
              <div className="text-gray-300">Ongoing Placements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">10+</div>
              <div className="text-gray-300">Upcoming Drives</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-20 md:mb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Home;


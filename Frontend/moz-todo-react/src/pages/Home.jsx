import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, GraduationCap, TrendingUp, Building, MapPin, ArrowRight } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dynamicWords = ["Applying", "Searching", "Researching"];
const jobChips = [
  "Frontend", "Backend", "Data Science", "Web Development", "Android Development", "iOS Development", "React", "Node.js", "Python", "Machine Learning", "DevOps", "Cloud Computing", "UI/UX Design", "Blockchain", "Cybersecurity", "Game Development", "Full Stack Development", "Flutter"
];

const AutoScrollChips = () => {
  const chipsRow = [...jobChips, ...jobChips];
  return (
    <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 px-2 sm:px-4 mt-10 overflow-x-hidden">
      <style>{`
        @keyframes scrollChips {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollChipsReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="flex flex-col gap-3">
        <div className="w-full overflow-x-hidden">
          <div
            className="flex gap-4 whitespace-nowrap w-max mx-auto"
            style={{
              minWidth: '100vw',
              animation: 'scrollChips 18s linear infinite',
            }}
          >
            {chipsRow.map((chip, idx) => (
              <span
                key={"row1-" + idx}
                className="inline-block bg-gray-800 text-green-400 px-5 py-2 rounded-full text-base font-medium shadow hover:bg-green-700 hover:text-white transition cursor-pointer border border-green-700"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-hidden">
          <div
            className="flex gap-4 whitespace-nowrap w-max mx-auto"
            style={{
              minWidth: '100vw',
              animation: 'scrollChipsReverse 28s linear infinite',
            }}
          >
            {chipsRow.map((chip, idx) => (
              <span
                key={"row2-" + idx}
                className="inline-block bg-gray-800 text-green-400 px-5 py-2 rounded-full text-base font-medium shadow hover:bg-green-700 hover:text-white transition cursor-pointer border border-green-700"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const useTypewriter = (words, delay = 2000, typingSpeed = 80, deletingSpeed = 40) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIdx];
    if (!isDeleting && displayed.length < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      }, typingSpeed);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && displayed.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIdx((idx) => (idx + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIdx, words, delay, typingSpeed, deletingSpeed]);

  return displayed;
};

const Home = () => {
  const typewriterWord = useTypewriter(dynamicWords, 2000, 80, 40);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-black">
      {/* Deep background gradient like the second image, behind all content */}
      <div className="pointer-events-none fixed inset-0 -z-50 h-full w-full bg-[linear-gradient(to_bottom,#000_0%,#166534_100%)]" />
      {/* Subtle grid lines overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f18_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] w-full h-full" />
      <Navbar />


      {/* Hero Section */}
      <section className="relative px-2 sm:px-4 py-16 md:py-28 flex flex-col items-center justify-center min-h-[90vh] w-full z-10">
        {/* Subtle hero section gradient overlay - more subtle whitish grey */}
        <div className="pointer-events-none absolute inset-0 z-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#f3f4f611_0%,transparent_100%)]" />
        <div className="max-w-xs sm:max-w-3xl mx-auto text-center relative z-10 px-2 sm:px-0">
          <div className="inline-block mb-6 px-5 py-2 rounded-full bg-black/60 border border-green-700 text-green-400 font-medium text-base shadow">
           Trusted by 50,000+ learners
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight relative break-words">
            Become Job-Ready by Actually{' '}
            <span className="text-green-400">{typewriterWord}</span>
          </h1>
          <p className="text-xl md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto break-words">
            Discover the latest placement records, job and internship opportunities, ongoing campus drives, and much more — all in one place to boost your career journey
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
            <Link
              to="/placement"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition flex items-center justify-center gap-2 shadow w-full sm:w-auto"
            >
              Let's Research <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/jobs"
              className="bg-gray-900 hover:bg-green-700 text-green-400 hover:text-white px-8 py-3 rounded-lg font-medium text-lg transition flex items-center justify-center gap-2 border border-green-700 shadow w-full sm:w-auto"
            >
              <Briefcase className="w-5 h-5" /> Explore Jobs
            </Link>
          </div>
          <AutoScrollChips />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What We <span className="text-green-500">Offer</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="px-4 py-16 bg-gray-900 z-10 relative rounded-lg max-w-7xl mx-auto mt-16 shadow-lg border border-[#232b36]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our <span className="text-green-500">Impact</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl p-6 shadow border border-[#232b36] hover:scale-105 hover:bg-black/50 transition-transform duration-300 text-center">
            <div className="text-4xl md:text-6xl font-extrabold text-green-400 mb-2 drop-shadow-lg">15+</div>
            <div className="text-gray-200 md:text-xl font-semibold tracking-wide">
              Daily Job<br />Postings
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl p-6 shadow border border-[#232b36] hover:scale-105 hover:bg-black/50 transition-transform duration-300 text-center">
            <div className="text-4xl md:text-6xl font-extrabold text-blue-400 mb-2 drop-shadow-lg">3Yr+</div>
            <div className="text-gray-200 md:text-xl font-semibold tracking-wide">
              Placement<br />Records
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl p-6 shadow border border-[#232b36] hover:scale-105 hover:bg-black/50 transition-transform duration-300 text-center">
            <div className="text-4xl md:text-6xl font-extrabold text-purple-400 mb-2 drop-shadow-lg">5+</div>
            <div className="text-gray-200 md:text-xl font-semibold tracking-wide">
              Ongoing<br />Placements
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl p-6 shadow border border-[#232b36] hover:scale-105 hover:bg-black/50 transition-transform duration-300 text-center">
            <div className="text-4xl md:text-6xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">10+</div>
            <div className="text-gray-200 md:text-xl font-semibold tracking-wide">
              Upcoming<br />Drives
            </div>
          </div>
        </div>
      </section>

      <div className="mb-20 md:mb-0 z-10 relative">
        <Footer />
      </div>
    </div>
  );
};

export default Home;

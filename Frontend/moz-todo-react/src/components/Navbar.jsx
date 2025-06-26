import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Briefcase, Users, GraduationCap, UserCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    
    if (token && adminStatus === 'true') {
      setIsAdmin(true);
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
    setIsAdmin(false);
  };

  return (
    <>
      {/* Desktop Navbar - Top */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-black text-white px-2 md:px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/icon7.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-white-500 text-xl font-bold">ADGIPS Hub</h1>
          </div>
          <div className="flex-1 flex justify-center gap-6">
            <Link to="/" className={`px-3 py-1 rounded transition ${pathname === '/' ? 'bg-green-500 text-white' : 'text-white hover:text-green-500'}`}>Home</Link>
            <Link to="/placement" className={`px-3 py-1 rounded transition ${pathname === '/placement' ? 'bg-green-500 text-white' : 'text-white hover:text-green-500'}`}>Placement</Link>
            <Link to="/campus" className={`px-3 py-1 rounded transition ${pathname === '/campus' ? 'bg-green-500 text-white' : 'text-white hover:text-green-500'}`}>Campus</Link>
            <Link to="/jobs" className={`px-3 py-1 rounded transition ${pathname === '/jobs' ? 'bg-green-500 text-white' : 'text-white hover:text-green-500'}`}>Jobs</Link>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-3 py-1 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link 
                to="/admin-login" 
                className="flex items-center gap-1 px-3 py-1  bg-gray-800 text-green-400 rounded-full text-base font-medium shadow hover:bg-green-700 hover:text-white transition cursor-pointer border border-green-700"
              >
              
                <UserCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center p-2 rounded transition ${
              pathname === '/' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/placement" 
            className={`flex flex-col items-center p-2 rounded transition ${
              pathname === '/placement' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Placement</span>
          </Link>
          
          <Link 
            to="/campus" 
            className={`flex flex-col items-center p-2 rounded transition ${
              pathname === '/campus' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs mt-1">Campus</span>
          </Link>
          
          <Link 
            to="/jobs" 
            className={`flex flex-col items-center p-2 rounded transition ${
              pathname === '/jobs' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs mt-1">Jobs</span>
          </Link>
          
          {isAdmin ? (
            <button 
              onClick={handleLogout} 
              className="flex flex-col items-center p-2 rounded text-red-400 hover:text-red-300 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          ) : (
            <Link 
              to="/admin-login" 
              className="flex flex-col items-center p-2 rounded text-gray-400 hover:text-green-500 transition"
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

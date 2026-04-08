import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useState } from "react";
import axios from "axios";


const Chatbot = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const apiBase = "https://placement-records.onrender.com/api/users"; 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
        const endpoint = isLogin ? "/login" : "/signup";
        const res = await axios.post(apiBase + endpoint, { email, password });
        if (isLogin) {
            onAuthSuccess(res.data.token);
            localStorage.setItem('token', res.data.token); 
        } else {
            setToast({ message: "Signup successful! Ab login karein.", type: "success" });
            setIsLogin(true);
        }
        } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
        }
        setLoading(false);
    };
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-green-500 mb-6 text-center">
              {isLogin ? "Login" : "Signup"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none transition-colors"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none transition-colors"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
              </button>
            </form>
            
            <p className="mt-6 text-center text-gray-300">
              {isLogin ? "New user? " : "Already have an account? "}
              <button
                className="text-green-400 hover:text-green-300 underline font-medium"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create an account" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <div className="mb-20 md:mb-0">
        <Footer />
      </div>
    </div>
  )
}

export default Chatbot


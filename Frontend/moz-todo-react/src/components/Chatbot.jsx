import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";


const Chatbot = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiBase = "http://localhost:5000/api/users"; 
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
            alert("Signup successful! Ab login karein.");
            setIsLogin(true);
        }
        } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
        }
        setLoading(false);
    };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-green-500 mb-6 text-center">
              {isLogin ? "Login" : "Signup"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
              </button>
            </form>
            
            <p className="mt-6 text-center text-gray-300">
              {isLogin ? "New user? " : "Already have an account? "}
              <button
                className="text-green-400 hover:text-green-300 underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create an account" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Chatbot
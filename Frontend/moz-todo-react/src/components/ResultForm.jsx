import { useState, useEffect } from "react";
import { initCaptcha, fetchResult, checkStatus } from "../api/resultApi";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

export default function ResultForm({ setResult, status, setStatus, goNext, enrollment }) {

  const [form, setForm] = useState({
    enrollment: enrollment || "",
    password: "",
    captcha: "",
    sessionId: "",
    consent: false,
  });

  const [captchaImage, setCaptchaImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    setStatus("Loading captcha...");
    const res = await initCaptcha();
    if (!res.success) { setStatus("Failed to load captcha"); return; }
    setCaptchaImage(res.captchaImage);
    setForm((prev) => ({ ...prev, sessionId: res.sessionId }));
    setStatus("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Submitting request...");
    const response = await fetchResult(form);

    if (!response.success) {
      setLoading(false);
      setStatus(response.message);
      return;
    }

    setStatus("Queued. Fetching result...");
    const requestId = response.requestId;
    let pollCount = 0;
    const maxPolls = 30;

    const interval = setInterval(async () => {
      pollCount++;
      const statusRes = await checkStatus(requestId);

      if (statusRes.status === "done") {
        clearInterval(interval);
        setLoading(false);
        if (!statusRes.success) {
          const newAttempts = attempts - 1;
          setAttempts(newAttempts);
          if (newAttempts <= 0) {
            setLocked(true);
            setStatus("");
          } else {
            setStatus(`❌ Invalid credentials. ${newAttempts} attempt(s) remaining.`);
            loadCaptcha();
          }
        } else {
          setStatus("Result fetched ✅");
          setResult(statusRes.data);
          goNext();
        }
      } else if (pollCount >= maxPolls) {
        clearInterval(interval);
        setLoading(false);
        setStatus("Request timeout. Please try again.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#0f1115] border border-green-500/30 rounded-2xl p-8 shadow-xl">

        {locked ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-4">🔒</p>
            <h2 className="text-xl font-bold text-red-400 mb-3">Account Temporarily Locked</h2>
            <p className="text-gray-400 text-sm">Your account has been temporarily locked by GGSIPU. Please connect after sometime.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-white mb-2">IPU Result Portal</h1>
            <p className="text-gray-400 text-center mb-8">Enter your credentials to view your result analysis</p>

            {/* Status Display */}
            <div className="text-center mb-4 text-green-400 text-sm">{status}</div>

            {/* Warning Box */}
            <details className="mb-6 bg-red-950/50 border border-red-500/50 rounded-xl">
              <summary className="px-4 py-3 text-red-400 font-semibold cursor-pointer select-none">
                ⚠ Important Password Information
              </summary>
              <ul className="px-5 pb-4 pt-2 space-y-2 text-red-300 text-sm list-disc list-inside">
                <li>Default password is your father's full name in <strong>CAPITAL LETTERS</strong></li>
                <li>Ensure proper spacing between words as per university registration</li>
                <li><strong>Warning:</strong> 3 incorrect attempts will temporarily lock your account</li>
              </ul>
            </details>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-sm text-gray-300">Enrollment Number</label>
                <input
                  name="enrollment"
                  placeholder="Enter Enrollment No."
                  value={form.enrollment}
                  className="w-full mt-2 bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative mt-2">
                  <input
                    name="password"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Captcha</label>
                <div className="flex gap-3 mt-2 items-center">
                  <input
                    name="captcha"
                    placeholder="ENTER CAPTCHA"
                    className="flex-1 bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
                    onChange={handleChange}
                  />
                  {captchaImage && (
                    <img src={`data:image/png;base64,${captchaImage}`} alt="captcha" className="h-[48px] rounded border border-gray-700" />
                  )}
                  <button type="button" onClick={loadCaptcha} className="bg-[#161a20] border border-gray-700 rounded-lg px-3 h-[48px] flex items-center justify-center">
                    <RefreshCw size={18}/>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="consent" onChange={handleChange} />
                I give consent
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-400 hover:bg-green-500 disabled:opacity-70 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition"
              >
                {loading ? (
                  <span className="text-green-900 animate-pulse">Logging in...</span>
                ) : "Login"}
              </button>

            </form>

            <p className="text-gray-500 text-sm text-center mt-6">Data is fetched directly from GGSIPU Exam Portal.</p>
          </>
        )}
      </div>
    </div>
  );
}

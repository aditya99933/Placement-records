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
  const [loginError, setLoginError] = useState(null);

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
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        setLocked(true);
      } else {
        setLoginError({ message: response.message || "Invalid credentials.", attempts: newAttempts });
        loadCaptcha();
      }
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
          const msg = statusRes.message || "";
          const isCaptchaError = /captcha/i.test(msg);
          if (isCaptchaError) {
            setLoginError({ message: "Captcha validation failed. Please try again.", attempts, isCaptcha: true });
            loadCaptcha();
          } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);
            if (newAttempts <= 0) {
              setLocked(true);
            } else {
              setLoginError({ message: msg || "Invalid credentials.", attempts: newAttempts });
              loadCaptcha();
            }
          }
        } else {
          setLoginError(null);
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f1115] border border-green-500/30 rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden">

        {locked ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-4">🔒</p>
            <h2 className="text-xl font-bold text-red-400 mb-3">Account Temporarily Locked</h2>
            <p className="text-gray-400 text-sm">Your account has been temporarily locked by GGSIPU. Please connect after sometime.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">IPU Result Portal</h1>
            <p className="text-gray-400 text-sm text-center mb-8">Enter your credentials to view your result analysis</p>

            {/* Status Display */}
            <div className="text-center mb-4 text-green-400 text-sm italic h-5">{status}</div>

            {loginError && (
              <div className="mb-4 bg-red-950/30 border border-red-500/50 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="text-red-400 text-lg mt-0.5">{loginError.isCaptcha ? "🔄" : "❌"}</span>
                <div>
                  <p className="text-red-400 font-semibold text-sm">{loginError.isCaptcha ? "Captcha Error" : "Login Error"}</p>
                  <p className="text-red-300/80 text-xs mt-0.5">{loginError.message}</p>
                  {!loginError.isCaptcha && (
                    <p className="text-red-300/80 text-xs mt-1">Attempts remaining: <span className="font-bold text-red-400">{loginError.attempts}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Warning Box */}
            <details className="mb-6 bg-red-950/20 border border-red-500/30 rounded-xl overflow-hidden group">
              <summary className="px-4 py-3 text-red-400 font-semibold cursor-pointer select-none text-sm sm:text-base hover:bg-red-950/40 transition">
                ⚠ Important Password Information
              </summary>
              <ul className="px-5 pb-4 pt-2 space-y-2 text-red-300/80 text-xs sm:text-sm list-disc list-inside bg-red-950/10">
                <li>Default password is your father's full name in <strong>CAPITAL LETTERS</strong></li>
                <li>Ensure proper spacing between words as per university registration</li>
                <li><strong>Warning:</strong> 3 incorrect attempts will temporarily lock your account</li>
              </ul>
            </details>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">Enrollment Number</label>
                <input
                  name="enrollment"
                  placeholder="Enter Enrollment No."
                  value={form.enrollment}
                  className="w-full mt-2 bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition-all font-mono"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">Password</label>
                <div className="relative mt-2">
                  <input
                    name="password"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition-all"
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-green-500 transition">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">Captcha</label>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:items-center">
                  <input
                    name="captcha"
                    placeholder="ENTER CAPTCHA"
                    className="flex-1 bg-[#161a20] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition-all font-mono"
                    onChange={handleChange}
                  />
                  <div className="flex gap-2 items-center">
                    {captchaImage && (
                      <img src={`data:image/png;base64,${captchaImage}`} alt="captcha" className="h-[48px] w-32 rounded border border-gray-700 bg-white/5 object-contain px-1" />
                    )}
                    <button type="button" onClick={loadCaptcha} className="bg-[#161a20] border border-gray-700 rounded-lg px-4 h-[48px] flex items-center justify-center hover:bg-gray-800 transition active:scale-95 text-gray-400 hover:text-green-500" title="Refresh Captcha">
                      <RefreshCw size={18}/>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400 text-xs sm:text-sm select-none">
                <input type="checkbox" name="consent" onChange={handleChange} className="w-4 h-4 rounded border-gray-700 bg-gray-800 accent-green-500" />
                <span>I give consent to fetch my data</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/10 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={18}/> Logging in...
                  </span>
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

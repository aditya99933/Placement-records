import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Placement from "./pages/Placement";
import Charts from "./components/Charts";
import JobDetailsPage from "./components/JobDetailsPage";
import AdminLogin from "./components/AdminLogin";
import JobForm from "./components/JobForm";
import Campus from "./pages/Campus";
import ProtectedRoute from "./components/ProtectedRoute";

function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
}

function App() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/charts/:batch" element={<Charts />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/job-details/:id" element={<JobDetailsPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/add-job" element={
          <ProtectedRoute>
            <JobForm />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
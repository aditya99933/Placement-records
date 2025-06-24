import Navbar from "../components/Navbar.jsx";
import JobList from "../components/JobList";
import Footer from "../components/Footer.jsx";

const Jobs = () => {
  return (
    <>
      <Navbar />
      <JobList />
      <div className="mb-15 md:mb-0">
        <Footer />
      </div>
      
    </>
  );
};

export default Jobs;
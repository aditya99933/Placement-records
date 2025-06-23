import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Chart2018_22 from "../charts/Chart2018_22";
import Chart2019_23 from "../charts/Chart2019_23";
import Chart2020_24 from "../charts/Chart2020_24";

function Charts() {
  const { batch } = useParams();

  const getChart = () => {
    if (batch === "2018-22") return <Chart2018_22 />;
    if (batch === "2019-23") return <Chart2019_23 />;
    if (batch === "2020-24") return <Chart2020_24 />;
    return <Chart2018_22 />; // default case
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Placement Statistics Charts</h1>
          <Link
            to="/"
            className="bg-green-800 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg w-full">
          {getChart()}
        </div>
      </div>
    </div>
  );
}

export default Charts;


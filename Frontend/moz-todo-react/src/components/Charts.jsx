import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Chart2018_22 from '../charts/Chart2018_22';
import Chart2020_24 from '../charts/Chart2020_24';
import Chart2019_23 from '../charts/Chart2019_23';

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Placement Statistics Charts</h1>
        <div className="fixed bottom-4 left-4 right-4 w-auto z-50 rounded-lg sm:static sm:w-auto sm:z-auto bg-red-800 sm:bg-red-800">
          <Link
            to="/placement"
            className="block text-center text-white font-semibold py-2 px-4 rounded-lg w-full sm:inline-block sm:w-auto hover:bg-red-900"
          >
            Close
          </Link>
        </div>
      </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl">
            {getChart()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
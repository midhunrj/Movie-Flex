import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../redux/admin/adminSlice";

import Chart from "chart.js/auto";
import { Pie, Line, Bar,Scatter,Bubble,Radar, Doughnut } from "react-chartjs-2";
import SidebarMenu from "./sidebarMenu";
import { adminAuthenticate } from "@/utils/axios/adminInterceptor";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
  PointElement,
  ArcElement, 
  RadarController, 
  ScatterController, 
  BubbleController,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
import { tmdbApiKey } from "@/utils/axios/config/urlConfig";
import { BookingType } from "@/types/bookingOrderTypes";
// import { Select } from "flowbite-react";


interface OverviewData {
    totalBookings?: number;
    totalRevenue?: number;
    cancelledBookings?: number;
    activeUsers?: number;
    bookedCount?: number;
    reservedCount?: number;
    cancelledCount?: number;
    expiredCount?: number;
  }
  
  interface Movie {
    title: string;
    region: string;
    boxOffice: string;
  }
  export interface BookingTrend {
    _id: string;
    totalBookings: number;
  }
  
 export interface RevenueTrend {
    _id: string;
    totalRevenue: number;
  }
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Monthly Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Sales Data",
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend ,ArcElement,
    RadarController, // For Radar charts
    ScatterController, // For Scatter charts
    BubbleController,LineElement,PointElement,);
const Dashboard = () => {
   
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin");
  };

  const [overview, setOverview] = useState<OverviewData|null>(null);
  const [bookingData, setBookingData] = useState<BookingTrend[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueTrend[]>([]);
   const [timePeriod,setTimePeriod]=useState('Monthly')
  const [selectedRegion, setSelectedRegion] = useState<string>("Worldwide");

  const regions = ["Worldwide", "USA", "India", "California", "Maharashtra","Kerala","TamilNadu","AndhraPradesh", "Los Angeles"];

  const [bookings, setBookings] = useState<BookingType[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
    
  const paginate = (pageNumber:number) => setCurrentPage(pageNumber)
  const itemsPerPage = 10; // Number of rows per page
  function formatToRupees(amount:number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }
  
  
  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page: number) => {
    setLoading(true);
    try {
      const response = await adminAuthenticate.get("/bookings", {
        params: {
          page,
          limit: itemsPerPage,
        },
      });
     console.log(response.data.bookings,"booking history");
     
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const getRegionCode = (region: string): string => {
    const regionMap: Record<string, string> = {
      "India": "IN",
      "USA": "US",
      "California": "US", // For states, you might not get specific results.
      "Maharashtra": "IN",
      "Los Angeles": "US",
    };
  
    return regionMap[region] || "US"; // Default to 'US' if the region is not mapped.
  };

  const getLanguageCodes = (region: string): string => {
    const regionLanguageMap: Record<string, string> = {
      "India": "hi",
      "Kerala": "ml",
      "TamilNadu": "ta",
      "AndhraPradesh": "te",
      "USA": "en",
      "Worldwide": "en",
    };
  
    const languages = regionLanguageMap[region] ;
    console.log(`Languages for ${region}:`, languages); // Add logging to check
    return languages;
  };
  
  
  useEffect(() => {
    fetchOverview();
    fetchBookingTrends();
    fetchRevenueTrends();
    fetchMoviesByRegion(selectedRegion)
  }, [selectedRegion,timePeriod]);

  const fetchOverview = async () => {
    const response = await adminAuthenticate.get("/overview");
    console.log(response.data,"response from backend");
    
    setOverview(response.data.dashboardData);
  };

  const fetchBookingTrends = async () => {
    const response = await adminAuthenticate.get("/booking-trends",{params:{interval:timePeriod}});
    console.log(response.data,"bookingtrens");
    
    setBookingData(response.data.bookingTrend);
  };

  const fetchRevenueTrends = async () => {
    const response = await adminAuthenticate.get("/revenue-trends",{params:{interval:timePeriod}});

    setRevenueData(response.data.revenueTrend);

  };

  const fetchMoviesByRegion = async (region: string) => {
    try {
      let apiEndpoint = "";
      const languageCodes = getLanguageCodes(region)

      console.log('Language Codes:', languageCodes); 
      if (region === "Worldwide") {
        apiEndpoint = `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbApiKey}`;
      } else {
        const regionCode=getRegionCode(region)
        // const languageParam = languageCodes.join(',');
        //console.log(languageParam,"languageParam");
        
        apiEndpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&region=${regionCode}&with_original_language=${languageCodes}`;

      }
     
      console.log("API Endpoint:", apiEndpoint);
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log(data,"data");
      

      const regionMovies = data.results.slice(0, 10).map((movie: any) => ({
        title: movie.title,
        region: region,
        boxOffice: movie.vote_average + " / 10",
      }));

      setMovies(regionMovies);
    } catch (error) {
      console.error("Error fetching movies by region:", error);
    }
  };

  return (
    <div>
      <SidebarMenu>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>

        <div className="mt-4">
            <label htmlFor="region" className="font-semibold mr-4">
              Select Region:
            </label>
            <select
              id="region"
              className="border rounded p-2"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
    
        <div className="grid grid-cols-4 gap-4 mt-8  text-gray-700">
          <div className="bg-white text-center  align-text-top font-medium text-2xl shadow-lg rounded-md p-4">
            <h2 >Total Bookings</h2>
            <p className="text-3xl  align-text-bottom font-semibold text-gray-800">{overview?.totalBookings!}</p>
          </div>
          <div className="bg-white text-center font-medium  text-2xl shadow-lg rounded-md p-4">
            <h2 >Total Revenue</h2>
            <p className="text-2xl font-semibold text-gray-800">{formatToRupees(overview?.totalRevenue!)}</p>
          </div>
          <div className="bg-white  text-center font-medium text-2xl shadow-lg rounded-md p-4">
            <h2 >Cancelled Bookings</h2>
            <p className="text-2xl font-semibold text-gray-800">{overview?.cancelledBookings}</p>
          </div>
          <div className="bg-white  font-medium text-center text-2xl hadow-lg rounded-md p-4">
            <h2 >Active Users</h2>
            <p className="text-2xl font-semibold text-gray-800">{overview?.activeUsers}</p>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="timePeriod" className="font-semibold mr-4">
            Select Time Period:
          </label> 
           <select
            id="timePeriod"
            className="border rounded p-2"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div> 
         <div className="mt-8  grid  gap-12 grid-cols-2">
            <div>
          <h2 className="text-xl font-bold">Booking Trends</h2>

          {/* <Bar data={data} options={options} /> */}
         
          {bookingData.length > 0 && ( 
   <Line
    data={{
       labels: bookingData.map((item) => item._id),
      datasets: [
        {
          label: "Bookings",
           data: bookingData.map((item) => item.totalBookings),
        
          borderColor: "blue",
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        
          tension:0.5,

        },
      ],
    }}
    // data={data}
    // options={options}
  />
)}
        </div>  

        
         <div>
          <h2 className="text-xl font-bold">Revenue Trends</h2>
          {revenueData.length > 0 && (
  <Bar
    data={{
      labels: revenueData.map((item) => item._id),
      datasets: [
        {
          label: "Revenue",
          data: revenueData.map((item) => item.totalRevenue),
          backgroundColor: [ "#36A2EB", "#FFCE56", "#4BC0C0"],

        },
      ],
    }}
  />
)}
        </div> 
        </div>

        {/* Booking Status Distribution */}
     {/* <div className="mt-8">
          <h2 className="text-xl font-bold">Booking Status Distribution</h2>
          <Pie
            data={{
              labels: ["Booked", "Reserved", "Cancelled", "Expired"],
              datasets: [
                {
                  data: [
                    overview?.bookedCount,
                    overview?.reservedCount,
                    overview?.cancelledCount,
                    overview?.expiredCount,
                  ],
                  backgroundColor: ["green", "blue", "red", "gray"],
                },
              ],
            }}
          />
        </div>  */}

<div className="mt-8">
            <h2 className="text-xl font-bold mb-2">{selectedRegion} - Top 10 Movies</h2>
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Region</th>
                  <th className="px-4 py-2 text-left">Box Office</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{movie.title}</td>
                    <td className="px-4 py-2">{movie.region}</td>
                    <td className="px-4 py-2">{movie.boxOffice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-2xl text-center font-bold my-4">Order History</h2>
            <table className="min-w-full bg-white  gap-4 shadow-md rounded-md mt-6">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-lg text-left">Movie </th>
                  <th className="px-4 py-2  text-lg text-left">User</th>
                  <th className="px-4 py-2  text-lg text-left">Booking Date</th>
                  <th className="px-4 py-2  text-lg text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="px-4 py-2">{booking.movieId.title}</td>
                    <td className="px-4 py-2">{booking.userId?booking.userId?.name!:booking.screenData?.screenName}</td>
                    <td className="px-4 py-2">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-2 mt-4">
            <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-1  rounded-lg min-h-8  ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, index)=>index+1).filter((page)=>page==currentPage||page==currentPage-1||page==currentPage+1).map(page => (
    <button
      key={page}
      onClick={() => paginate(page)}
      className={`p-2 rounded-lg  min-h-8 ${currentPage === page  ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-1 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Next
  </button>
            </div>
          </div>
        )}
      </div>
      </SidebarMenu>
    </div>
  );
};

export default Dashboard;

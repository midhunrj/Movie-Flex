import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/theatre/theatreSlice";
import { BiBell, BiSearch, BiMap } from "react-icons/bi"
import { FaUserCircle } from "react-icons/fa"
import Footer from "../User/footer";
import usePreviousPath from "../../utils/hooks/previousPath";
import { Link } from "react-router-dom";
import { theatreAuthenticate } from "@/utils/axios/theatreInterceptor";
import { Bar, Line } from "react-chartjs-2";
import { RootState } from "@/redux/store/store";
import { io } from "socket.io-client";
import { theatreUrl, userUrl } from "@/utils/axios/config/urlConfig";
import { BookingType } from "@/types/bookingOrderTypes";
export interface BookingTrend {
  _id: string;
  totalBookings: number;
}

export interface RevenueTrend {
  _id: string;
  totalRevenue: number;
}
const TheatreHome = () => {
   const navigate=useNavigate()
   const dispatch=useDispatch()
   const{theatre,role}=useSelector((state:RootState)=>state.theatre)
   const [unreadCount,setUnreadCount]=useState<number>(0)
   const[bookings,setBookings]=useState<BookingTrend[]>([])
   const[revenues,setRevenues]=useState<RevenueTrend[]>([])
   const [timePeriod,setTimePeriod]=useState('Monthly')
   const userId=theatre?._id
    const handleLogout=()=>{
        dispatch(logout())
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre')
    } 

    const [bookingData, setBookingData] = useState<BookingType[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
  
    const itemsPerPage = 10; // Number of rows per page
  
    useEffect(() => {
      fetchBookings(currentPage);
    }, [currentPage]);
  
    const fetchBookings = async (page: number) => {
      setLoading(true);
      try {
        const response = await theatreAuthenticate.get("/bookings", {
          params: {
            page,
            limit: itemsPerPage,
            theatreId:theatre?._id
          },
        });
       console.log(response.data.bookings,"booking history");
       
        setBookingData(response.data.bookings);
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
    useEffect(() => {
      const socket = io(userUrl); 
  
      
      socket.emit("subscribe", userId, role);
  
      
      socket.on("Notification-unread-count", (count: number) => {
        setUnreadCount(count);
      });
  
      console.log(unreadCount,"aifhfhafhakfh");
      
      return () => {
        socket.disconnect();
      };
    }, [userId, role]);

    useEffect(()=>{
fetchBookingTrends()
fetchRevenueTrends()
    },[timePeriod])
    
    const fetchBookingTrends = async () => {
      const response = await theatreAuthenticate.get("/booking-trends",{params:{interval:timePeriod},headers:{theatreId:theatre?._id}});
      console.log(response.data,"bookingtrens");
      
      setBookings(response.data.bookingTrend);
    };
  
    const fetchRevenueTrends = async () => {
      const response = await theatreAuthenticate.get("/revenue-trends",{params:{interval:timePeriod},headers:{theatreId:theatre?._id}});
  
      setRevenues(response.data.revenueTrend);
  
    };
    
    const paginate = (pageNumber:number) => setCurrentPage(pageNumber)
    return (
        <>
        <div className=" min-h-screen bg-gray-100" >
        <header className=" from-yellow-200 via-blue-950  bg-gradient-to-tr to-[#091057] text-white">
          <div className="flex justify-between items-center p-4">
         
            <div className="flex items-center">
              <img
                src="/movielogo 2.jpeg" // Update with your movie site logo path
                alt="Movie Site Logo"
                className="h-12 w-12 mr-4"
              />
              <span className="text-2xl font-bold">Movie Flex</span>
            </div>

            
            <div className="flex space-x-6">
            <Link
                to="/theatre/home"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Home
              </Link>
              <Link
                to="/theatre/movies"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Movies
              </Link>
              <Link
                to="/theatre/screens"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Screens
              </Link>
              <Link
                to="/theatre/profile"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                profile
              </Link>
            </div>

           
            <div className="flex items-center space-x-6">
            <div className="relative">
  {/* //<button className="bg-transparent hover:bg-gray-700 p-2 rounded-full transition min-h-8 relative"> */}
    <BiBell size={24} className="text-white cursor-pointer"  onClick={()=>navigate('/theatre/Notification')}/>
{/*     
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      3
    </span> */}
    {unreadCount>0? 
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
    
           {unreadCount} 
        </span>
         :<></> } 
  {/* //</button> */}
</div>

             
              <div className="text-sm text-gray-200"><BiMap size={24} className="text-white" />kochi</div>
              <Link to="/theatre/profile" className="flex items-center">
                        <FaUserCircle size={28} className="text-white" />
                     </Link>
              <button
                className="bg-transparent min-h-8 text-white rounded p-2 hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <h1 className="text-4xl font-bold text-blue-500 text-center mt-8">
          Welcome to Movie Ticket Booking
        </h1>

        <div className="mt-4  mx-8">
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
         <div className="mt-8 mx-8   grid  gap-12 grid-cols-2">
            <div className="bg-white p-2 rounded-md shadow-lg">
          <h2 className="text-xl font-bold">Booking Trends</h2>

          {/* <Bar data={data} options={options} /> */}
         
          {bookings.length > 0 && ( 
   <Line
    data={{
       labels: bookings.map((item) => item._id),
      datasets: [
        {
          label: "Bookings",
           data: bookings.map((item) => item.totalBookings),
        
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

        
         <div className="bg-white p-2 rounded-md shadow-lg">
          <h2 className="text-xl font-bold">Revenue Trends</h2>
          {revenues.length > 0 && (
  <Bar
    data={{
      labels: revenues.map((item) => item._id),
      datasets: [
        {
          label: "Revenue",
          data: revenues.map((item) => item.totalRevenue),
          backgroundColor: [ "#36A2EB", "#FFCE56", "#4BC0C0"],

        },
      ],
    }}
  />
)}
        </div> 
        </div>


        {/* <div className="flex justify-center mt-12 pb-8"> */}
          {/* <div className="grid grid-cols-8 gap-4">
            <div className="col-start-2 col-span-2 w-full text-center text-white  text-opacity-80 bg-gradient-to-r mx-8 h-fit border-b-black rounded-md bg-indigo-950" >
              
              <img
                src="/now showing 3.jpg"
                alt="Now Showing Movie 1"
                className="rounded h-80 w-full"
              />

    <div className="flex justify-between items-center px-4 py-2">
        <span className="text-lg font-semibold">Screen 1</span>
        <span className="text-sm cursor-pointer mt-4 hover:text-opacity-100">Edit</span>
      </div>
            </div>
            <div className="col-start-5  w-full col-span-2 text-center text-white  text-opacity-80 bg-gradient-to-r mx-8 h-fit border-x-black rounded-md bg-indigo-950" >
              
              <img
                src="/now showing 2.jpg"
                alt="Now Showing Movie 2"
                className=" rounded h-80 w-full"
              />
              {/* <span className="block">Screen 2</span> */}
              {/* <div className="flex justify-between items-center px-4 py-2">
        <span className="text-lg font-semibold">Screen 2</span>
        <span className="text-sm cursor-pointer mt-4  hover:text-opacity-100">Edit</span>
      </div>
            </div>
          </div>
        </div> */} 
      {/* </div> */}

      {loading ? (
          <p>Loading...</p>
        ) :bookingData.length>0? (
          <div className="mx-8">
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
                {bookingData.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="px-4 py-2">{booking.movieId.title}</td>
                    <td className="px-4 py-2">{booking.userId?booking.userId?.name!:booking.screenData?.screenName}</td>
                    <td className="px-4 py-2">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-2 my-4">
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
            
        ):(<div className="text-center flex justify-center items-center mx-auto  text-black">No history found</div>)}
</div>
        <Footer/>

        </>
    );
};

export default TheatreHome;
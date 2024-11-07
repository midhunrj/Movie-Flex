import React from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/theatre/theatreSlice";
import { BiBell, BiSearch, BiMap } from "react-icons/bi"
import { FaUserCircle } from "react-icons/fa"
import Footer from "../User/footer";
import usePreviousPath from "../../utils/hooks/previousPath";
import { Link } from "react-router-dom";

const TheatreHome = () => {
   const navigate=useNavigate()
   const dispatch=useDispatch()
   
    const handleLogout=()=>{
        dispatch(logout())
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre')
    } 
    return (
        <>
        <div className=" bg-orange-300 min-h-screen">
        <header className="bg-blue-900 text-white">
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
                to="theatre/movies"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Movies
              </Link>
              <Link
                to="theatre/screens"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Screens
              </Link>
              <Link
                to="/theatre/profile"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Snacks
              </Link>
            </div>

           
            <div className="flex items-center space-x-6">
            <div className="relative">
  {/* //<button className="bg-transparent hover:bg-gray-700 p-2 rounded-full transition min-h-8 relative"> */}
    <BiBell size={24} className="text-white cursor-pointer" />
    
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      3
    </span>
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

        <h1 className="text-4xl font-bold text-blue-400 text-center mt-8">
          Welcome to Movie Ticket Booking
        </h1>
        <div className="flex justify-center mt-12 pb-8">
          <div className="grid grid-cols-8 gap-4">
            <div className="col-start-2 col-span-2 text-center text-white bg-blue-950 bg-gradient-to-r mx-8 h-fit border-b-black rounded-lg">
              <span className="block">Screen 1</span>
              <img
                src="/now showing 3.jpg"
                alt="Now Showing Movie 1"
                className="p-4 rounded"
              />
              <p className="text-sm text-justify cursor-pointer mx-4 text-gray-400">Edit</p>
              <p className="text-lg font-semibold">Stree 2</p>
            </div>
            <div className="col-start-5 col-span-2 text-center text-white bg-blue-950 bg-gradient-to-r mx-8 h-fit border-x-black rounded-lg">
              <span className="block">Screen 2</span>
              <img
                src="/now showing 2.jpg"
                alt="Now Showing Movie 2"
                className="p-4 rounded"
              />
              <p className="text-sm text-justify  cursor-pointer mx-4 text-gray-400">Edit</p>
              <p className="text-lg font-semibold">Demonte Colony 2</p>
            </div>
          </div>
        </div>
      </div>

        <Footer/>

        </>
    );
};

export default TheatreHome;
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BiBell, BiSearch, BiMap  } from "react-icons/bi"
import { logout } from '../../redux/theatre/theatreSlice'
import { FaUserCircle } from "react-icons/fa"
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '@/redux/store/store'
import { io } from 'socket.io-client'
import { theatreUrl, userUrl } from '@/utils/axios/config/urlConfig'

const TheatreHeader = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>()
    const {theatre,isError,isSuccess,role}=useSelector((state:RootState)=>state.theatre)
    const [unreadCount,setUnreadCount]=useState<number>(0)
    const userId=theatre?._id
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
    
    const handleLogout=()=>{
        dispatch(logout())
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre')
    }
  return (
    <header className=" from-yellow-200 via-blue-950  bg-gradient-to-tr to-[#091057]   text-white">
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
              <Link to="/theatre/movies"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Movies
              </Link>
              <Link to="/theatre/screens"
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
    <BiBell size={24} className="text-white cursor-pointer" onClick={()=>navigate('/theatre/Notification')}/>
    
    {unreadCount>0? 
           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
    
           {unreadCount} 
        </span>
        :<></>}
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

  )
}

export default TheatreHeader
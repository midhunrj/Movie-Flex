import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BiBell, BiSearch, BiMap } from "react-icons/bi"
import { logout } from '../../redux/theatre/theatreSlice'

const TheatreHeader = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {theatre,isError,isSuccess}=useSelector((state)=>state.theatre)
    const handleLogout=()=>{
        dispatch(logout())
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre')
    }
  return (
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
              <a
                href="#"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Movies
              </a>
              <a
                href="/screens"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Screens
              </a>
              <a
                href="/profile"
                className="hover:bg-gray-700 p-4 rounded transition"
              >
                Snacks
              </a>
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
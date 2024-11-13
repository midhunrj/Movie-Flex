import React from 'react'
import { BiBell, BiSearch, BiMap } from "react-icons/bi"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/user/userSlice';
import { Link } from 'react-router-dom';
const Header = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleLogout = async () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate("/");
      };
  return (
    <>
    <header className="flex items-center justify-between w-full text-white bg-[#091057] p-4">
          
          <div className="flex items-center">
            <img
              src="movielogo 2.jpeg"               alt="Movie Site Logo"
              className="h-12 w-12 mr-4"
            />
            <h1 className="text-2xl font-bold">Movie Flex</h1>
          </div>

          {/* Center: Navbar Links */}
          <div className="flex space-x-8">
            <Link to="/" className="hover:bg-amber-400 px-4 py-2 rounded">Home</Link>
            <Link to="/profile" className="hover:bg-gray-700 px-4 py-2 rounded">Profile</Link>
            <Link to="#" className="hover:bg-gray-700 px-4 py-2 rounded">Your Orders</Link>
            <Link to="#" className="hover:bg-gray-700 px-4 py-2 rounded">Favourites</Link>
            <Link to="#" className="hover:bg-gray-700 px-4 py-2 rounded">Shows</Link>
          </div>

          {/* Right: Search, Location, Notification, and Logout */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="p-2 rounded bg-gray-700 text-white pl-10"
              />
              <BiSearch className="absolute left-2 top-2 text-gray-300" size={24} />
            </div>

            {/* Location Icon */}
            <div className="flex items-center">
              <BiMap size={24} className="text-white" />
              <span className="ml-1">Location</span>
            </div>

            {/* Notification Icon */}
            <BiBell size={24} className="text-white cursor-pointer" />

            {/* Logout Button */}
            <button
              className="bg-red-600 min-h-8 text-white rounded px-4 py-2 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

    </>  )
}

export default Header
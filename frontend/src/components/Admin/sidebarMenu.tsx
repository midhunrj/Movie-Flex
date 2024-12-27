import React, { ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/admin/adminSlice';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaTheaterMasks, FaFilm, FaBars, FaClosedCaptioning, FaAtlas, FaTimes } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi';

type SidebarMenuProps = {
  children: ReactNode
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`
          ${isCollapsed ? 'w-20' : 'w-1/5'} 
          bg-gradient-to-r from-slate-900 to-indigo-800 
          text-white flex flex-col justify-around
          p-6 transition-all duration-500 ease-in-out
        `}
      >
        {/* Hamburger/Menu Toggle Button */}
        <div className="flex justify-around -mt-20">
          <button 
            onClick={toggleSidebar} 
            className={`${isCollapsed?'hover:bg-yellow-400 min-h-6 p-1':'p-2 rounded-lg transition duration-200'}`}
          >
            {!isCollapsed?<><FaBars className="text-xl" />
            </>:<FaTimes className="text-xl"/>}
          </button>
          {!isCollapsed?<>
            <h1 className="text-2xl font-bold">Movie Flex</h1></>:null}
          
        </div>

        <div>
          <div className="space-y-6">
            <Link
              to="/admin/home"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/home') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaHome className="text-lg" />
              {!isCollapsed && <span className="ml-2">Dashboard</span>}
            </Link>
            <Link
              to="/admin/users"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/users') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaUsers className="text-lg" />
              {!isCollapsed && <span className="ml-2">Users</span>}
            </Link>
            <Link
              to="/admin/theatre"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/theatre') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaTheaterMasks className="text-lg" />
              {!isCollapsed && <span className="ml-2">Theatres</span>}
            </Link>
            <Link
              to="/admin/running-movies"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/running-movies') || isActive('/admin/movies') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaFilm className="text-lg" />
              {!isCollapsed && <span className="ml-2">Movie Management</span>}
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div>
        <button
          onClick={handleLogout}
          className={`
            ${isCollapsed ? 'justify-center px-2 py-2 w-fit ' : 'px-4 py-2 w-full '}
            min-h-8 bg-red-500  rounded-lg hover:bg-red-600 
            transition duration-200 flex items-center 
          `}
        >
          <FiLogOut className="text-lg" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        ${isCollapsed ? 'w-[calc(100%-5rem)]' : 'w-4/5'} 
        bg-gray-100 p-8 overflow-y-auto 
        transition-all duration-300 ease-in-out
      `}>
        {children}
      </div>
    </div>
  );
};

export default SidebarMenu;
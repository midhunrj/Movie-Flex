import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/admin/adminSlice';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaTheaterMasks, FaFilm, FaBars, FaTimes } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
const SidebarMenu = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin');
    };
    const isActive = (path) => location.pathname === path;
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (_jsxs("div", { className: "flex h-screen", children: [_jsxs("div", { className: `
          ${isCollapsed ? 'w-20' : 'w-1/5'} 
          bg-gradient-to-r from-slate-900 to-indigo-800 
          text-white flex flex-col justify-around
          p-6 transition-all duration-500 ease-in-out
        `, children: [_jsxs("div", { className: "flex justify-around -mt-20", children: [_jsx("button", { onClick: toggleSidebar, className: `${isCollapsed ? 'hover:bg-yellow-400 min-h-6 p-1' : 'p-2 rounded-lg transition duration-200'}`, children: !isCollapsed ? _jsx(_Fragment, { children: _jsx(FaBars, { className: "text-xl" }) }) : _jsx(FaTimes, { className: "text-xl" }) }), !isCollapsed ? _jsx(_Fragment, { children: _jsx("h1", { className: "text-2xl font-bold", children: "Movie Flex" }) }) : null] }), _jsx("div", { children: _jsxs("div", { className: "space-y-6", children: [_jsxs(Link, { to: "/admin/home", className: `
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/home') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `, children: [_jsx(FaHome, { className: "text-lg" }), !isCollapsed && _jsx("span", { className: "ml-2", children: "Dashboard" })] }), _jsxs(Link, { to: "/admin/users", className: `
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/users') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `, children: [_jsx(FaUsers, { className: "text-lg" }), !isCollapsed && _jsx("span", { className: "ml-2", children: "Users" })] }), _jsxs(Link, { to: "/admin/theatre", className: `
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/theatre') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `, children: [_jsx(FaTheaterMasks, { className: "text-lg" }), !isCollapsed && _jsx("span", { className: "ml-2", children: "Theatres" })] }), _jsxs(Link, { to: "/admin/running-movies", className: `
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/admin/running-movies') || isActive('/admin/movies') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `, children: [_jsx(FaFilm, { className: "text-lg" }), !isCollapsed && _jsx("span", { className: "ml-2", children: "Movie Management" })] })] }) }), _jsx("div", { children: _jsxs("button", { onClick: handleLogout, className: `
            ${isCollapsed ? 'justify-center px-2 py-2 w-fit ' : 'px-4 py-2 w-full '}
            min-h-8 bg-red-500  rounded-lg hover:bg-red-600 
            transition duration-200 flex items-center 
          `, children: [_jsx(FiLogOut, { className: "text-lg" }), !isCollapsed && _jsx("span", { className: "ml-2", children: "Logout" })] }) })] }), _jsx("div", { className: `
        ${isCollapsed ? 'w-[calc(100%-5rem)]' : 'w-4/5'} 
        bg-gray-100 p-8 overflow-y-auto 
        transition-all duration-300 ease-in-out
      `, children: children })] }));
};
export default SidebarMenu;

// import React from 'react'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router'
// import { logout } from '../../redux/admin/adminSlice'

// const SidebarMenu = ({children}) => {
//   const Navigate=useNavigate()
//   const dispatch=useDispatch()
//   const handleLogout=()=>{
//     dispatch(logout())
//     Navigate('/admin')
//   }
//   return (
//     <>
//     <div></div>
//     <div className="grid grid-cols-12 auto-cols-min mx-0 gap-4">
//         <div className=' grid-cols-subgrid col-start-0 col-span-4'>
//             <div className="bg-neutral-400 grid grid-rows-5 p-8 min-h-fit mx-4 rounded  col-span-1   ">
//                 <Link to='#' className=" hover:bg-slate-200 grid-rows-2 p-4 m-4 rounded">Dashboard</Link>
//                 <Link to='/admin/users' className=" hover:bg-slate-200 grid-rows-2 p-4 m-4 rounded">Users</Link>
//                 <Link to='/admin/theatre' className=" hover:bg-slate-200 grid-rows-2 p-4 m-4 rounded">Theatres</Link>
//                 <Link to='#' className=" hover:bg-slate-200 grid-rows-2 p-4 m-4 rounded">Movie Management</Link>
//                 <button  onClick={handleLogout}className=" min-h-8 px-6 py-2 hover:bg-red-700 grid-rows-2 p-4 m-4 rounded">logout</button>
//             </div>
//             </div>
//             <div className='grid-cols-subgrid col-span-8 w-3/4 p-4'>
//                 {children}
//             </div>
//             </div>
            
// </>
//   )
// }

// export default SidebarMenu


import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/admin/adminSlice';
import { Link } from 'react-router-dom';
type SidebarMenuProps = {
  children: ReactNode
};

const SidebarMenu:React.FC<SidebarMenuProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-r from-slate-500 to-slate-900 text-white flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
          <div className="space-y-6">
            <Link
              to="/admin/home"
              className="block px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-600 focus:bg-blue-800"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-600 focus:bg-blue-800"
            >
              Users
            </Link>
            <Link
              to="/admin/theatre"
              className="block px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-600 focus:bg-blue-800"
            >
              Theatres
            </Link>
            <Link
              to="/admin/running-movies"
              className="block px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-600 focus:bg-blue-800"
            >
              Movie Management
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 min-h-8 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-100 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SidebarMenu;

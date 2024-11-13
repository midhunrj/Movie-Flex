import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../redux/admin/adminSlice";
import SidebarMenu from "./sidebarMenu";
// import LoginForm from "./loginForm";
// import RegisterForm from "./registerForm";

const HomePage = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleLogout=()=>{
        dispatch(logout())
        navigate('/admin')
    }
    return (
        <>
        <div>
      {/* Sidebar Menu */}
      <SidebarMenu>

      {/* Main Content */}
      <div >
        <h1 className=" text-wrap text-blue-500 text-4xl font-bold text-right items-center">Welcome to Movie Ticket Booking</h1>
      
    </div>
    </SidebarMenu>
    </div>
        </>
    );
};

export default HomePage;
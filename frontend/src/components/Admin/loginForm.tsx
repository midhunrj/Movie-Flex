

import React, { useState,useEffect } from "react";
import {useNavigate}from 'react-router-dom'
import { login } from "../../redux/admin/adminThunk";
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store/store";
const AdminLoginForm = () => {
    const [email, setEmail] = useState("");
    const {admin,isError,isSuccess,message}=useSelector((state:RootState)=>state.admin)
    const [password, setPassword] = useState("");
const navigate=useNavigate()
const dispatch=useDispatch<AppDispatch>()
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await dispatch(login({email, password}));
            console.log("Login successful:", response.data);
            if(isSuccess)
                {
                navigate('/admin/home')
                }
            
        } catch (error) {
            console.error("Login failed:", error.response.data.error);
        }
    };
     useEffect(()=>{
    if(admin)
    {
        navigate('/admin/home')
        return
    }
    else if(isError)
    {
        toast.error(message)
    }
     },[isError,admin,message])
    

    return (
        <div className="relative min-h-screen flex items-center justify-center">
        {/* Background image */}
        <img
          src="/backgrnd mvlog.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 bg-transparent  backdrop-blur-md shadow-lg border flex   rounded-2xl  border-gray-500 flex-col mx-8 my-12 p-16 items-center justify-center h-96 ">
            
            <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
             <h2 className="text-xl font-bold  align-text-bottom mt-8 text-yellow-400">Admin Login Form</h2>
        <form id="loginForm" className="mt-8" onSubmit={handleSubmit}>
        {/* <div className="mb-6"> */}
                        {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label> */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                />
            {/* </div> */}
            {/* <div className="mb-6"> */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border mb-8 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
               
            />
            {/* </div> */}
           
            <button
                        type="submit"
                        className="w-fit px-4  min-h-8 mt-8 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
                    >
                    Login</button>
           

            {/* <span>signin using google</span>
            <a href></a> */}
                    </form>
        </div>
        </div>    );
};

export default AdminLoginForm;

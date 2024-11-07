

import React, { useState,useEffect } from "react";
import {useNavigate}from 'react-router-dom'
import { login } from "../../redux/theatre/theatreThunk";
import './css/login.css'
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import usePreviousPath from "../../utils/hooks/previousPath";
const TheatreLoginForm = () => {
    const [email, setEmail] = useState("");
    const{theatre,token,isError,isSuccess,message,isProfileComplete}=useSelector((state)=>state.theatre)
    const [password, setPassword] = useState("");
    const previousPath=usePreviousPath()
const navigate=useNavigate()

   const dispatch=useDispatch()
const validateForm = () => {
    const errors = {};
    if (!email) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid';
    }
    if (!password) {
        errors.password = 'Password is required';
    }
    return errors;
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                for (const error in validationErrors) {
                    toast.error(validationErrors[error]);
                }
            }
            else{
            
            const response = await dispatch(login({email, password}));
            console.log("Login successful:", response);
            
        }} catch (error) {
            console.error("Login failed:", error.response.data.error);
        }
    };



    const getSignup=()=>
    {
        navigate('/theatre/signup')
    }

    const getForgot=()=>
    {
        navigate('/theatre/forgot-pass')
    }
    useEffect(()=>{
        // if(theatre && token)
        // {
        //     navigate('/theatre/home')
        //     return
        // }
        
            
                console.log(theatre,"isProfilecomplete");
                
                if(theatre?.address?.place&&token)
                {
                    
                 navigate('/theatre/home')
                }
                // let user="first"
               
                //     localStorage.setItem('jifes',user)
                else if(token){
                localStorage.setItem('incompleteProfile', true);
                navigate('/theatre/profile')
                }
            
        if(isError)
        {
            toast.error(message)
        }
    },[theatre,isError,message])

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
        <div className="relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96">
            
            <h1 className=" mt-4 text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
             <h2 className="text-xl font-bold  align-text-bottom mt-4 text-yellow-500">Theatre Login Form</h2>
        <form id="loginForm" className="mt-7" onSubmit={handleSubmit}>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
               
            />
            {/* </div> */}
            <span onClick={getForgot} className="mt-2 text-wrap  h-max cursor-pointer text-opacity-80 text-white">forgot password?</span>
            <button
                        type="submit"
                        className="w-fit px-4  min-h-8 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
                    >
                    Login</button>
            <caption onClick={getSignup} className="mt-1 text-wrap h-max cursor-pointer text-opacity-80 text-white">New user?Signup</caption>

            {/* <span>signin using google</span>
            <a href></a> */}
                    </form>
        </div>
        </div>
        

    );
};

export default TheatreLoginForm;

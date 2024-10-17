import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router";
import './css/login.css'
// import { newPassVerify } from "../../services/api";
import { newPassVerify } from "../../redux/theatre/theatreThunk";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
const TheatrePassVerify=()=>{
    const [otp,setOtp]=useState("")
    //const [confirmPass,setConfirmPass]=useState("")
     const navigate=useNavigate()
     const dispatch=useDispatch()
     const {user,isError,isSuccess,message}=useSelector((state)=>state.theatre)
    const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        if(otp=='')
        {
            toast.error('Enter Otp')
        }
        else {
        const response=await dispatch(newPassVerify(otp))
        if(isSuccess)
        {
        navigate('/theatre/reset-password')
        }
    }} catch (error) {
        console.error("otp verify failed:", error.response.data.error);
    }
       
    }
    useEffect(()=>{
        if(isError)
        {
          toast.error(message)  
        }
    },[isError])
    return(
        <div className="relative min-h-screen flex items-center justify-center">
        {/* Background image */}
        <img
          src="/backgrnd mvlog.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200">
  
        <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
        <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Otp Verification</h2>
            <form id="loginForm" onSubmit={handleSubmit}>
                <input type='text' value={otp} placeholder="enter a otp" onChange={(e)=>setOtp(e.target.value)}/>
                
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default TheatrePassVerify
import React,{useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import './css/login.css'
import { toast } from "react-toastify";
// import { newPassVerify } from "../../services/api";
import { newPassVerify } from "../../redux/user/userThunk";
const PassVerify=()=>{
    const [otp,setOtp]=useState("")
    //const [confirmPass,setConfirmPass]=useState("")
    const {user,isLoading,isSuccess,isError,message}=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        const response=await dispatch(newPassVerify(otp)).unwrap()
        if(isSuccess)
        {
        navigate('/reset-password')
        }
    } catch (error) {
        console.error("otp verify failed:", error.response.data.error);
    }
       
    }

    
    useEffect(()=>{
        if(isError)
        {
           toast.error(message)
        }},[isError])
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
                    <form id="loginForm" onSubmit={handleSubmit} className="space-y-4 text-center">
                <input type='text' value={otp} placeholder="enter a new password" onChange={(e)=>setOtp(e.target.value)}/>
                
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default PassVerify
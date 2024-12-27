// import React,{useState,useEffect} from "react";
// import { useDispatch,useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import './css/login.css'
// import { userVerify } from "../../redux/user/userThunk";
// import { Toaster, toast } from "sonner";
// const VerifyUser=()=>{
//     const [otp,setOtp]=useState("")
//     //const [confirmPass,setConfirmPass]=useState("")
//     const {user,isLoading,isSuccess,isError,message}=useSelector((state)=>state.user)
//     const navigate=useNavigate()
//     const dispatch=useDispatch()
//     const handleSubmit=async(e)=>{
//     e.preventDefault()
//     try {
//         if(otp=="")
//         {
//             toast.error("enter otp")
//         }
//         else{
//         await dispatch(userVerify(otp)).unwrap()
//          if(isSuccess)
//          {
//         navigate('/')
//    }
// } } catch (error) {
//         console.log(error);
//         console.error("otp verify failed:", error.response?.data.error);
//     }
      
//        //navigate('/')

    
//     }
    
//     useEffect(()=>{
//         if(isError)
//         {
//            toast.error(message)
//         }},[isError])
//     return(
//         <div className="container">
//          <div className="content">
//             <h1>Enter Otp </h1>
//             <form id="loginForm" onSubmit={handleSubmit}>
//                 <input type='text' value={otp} placeholder="enter a new password" onChange={(e)=>setOtp(e.target.value)}/>
                
//                 <button type="submit">Submit</button>
//             </form>
//             </div>
//         </div>
//     )
// }

// export default VerifyUser


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
//import { userVerify, resendOtp } from "../../redux/user/userThunk"; // Assume resendOtp is defined in userThunk
import { Toaster, toast } from "sonner";
import { userVerify,resendOtp } from "../../redux/user/userThunk";
import { AppDispatch, RootState } from "@/redux/store/store";

const VerifyUser = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled
  const { user, isLoading, isSuccess, isError, message } = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Handle OTP submission
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (otp === "") {
        toast.error("Please enter OTP");
      } else {
        await dispatch(userVerify(otp)).unwrap();
        if (isSuccess) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("OTP verify failed:", error);
      //toast.error("Failed to verify OTPvvvvvvvvvvvv");
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      setIsResendDisabled(false); // Enable resend OTP after timer ends
    }
  }, [timer]);

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(120); // Reset the timer to 2 minutes
      await dispatch(resendOtp()).unwrap(); // Dispatch the resend OTP action
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (isError) {
       toast.error(message);
    }
  }, [isError]);

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
    {/* // <div className="flex flex-col items-center justify-center h-screen bg-gray-100"> */}
      {/* <div className="bg-white p-8 rounded-lg shadow-md w-96"> */}
      <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200">
      <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
             <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Otp Verification</h2>
        {/* <form id="registerForm"  className="mt-12" onSubmit={handleSubmit}> */}
       
        {/* <h1 className="text-2xl font-bold mb-4 text-center">Enter OTP</h1> */}
        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <input
            type="text"
            value={otp}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 bg-blue-500 text-white  hover:bg-blue-700 "
          >
            Submit
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-4 text-center">
          {isResendDisabled ? (
            <p className="text-gray-500">Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} minutes</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className={`max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 ${
                isResendDisabled
                  ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              disabled={isResendDisabled}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;

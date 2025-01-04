import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
//import { userVerify, resendOtp } from "../../redux/user/userThunk"; // Assume resendOtp is defined in userThunk
import { toast } from "sonner";
import { userVerify, resendOtp } from "../../redux/user/userThunk";
const VerifyUser = () => {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Handle OTP submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (otp === "") {
                toast.error("Please enter OTP");
            }
            else {
                await dispatch(userVerify(otp)).unwrap();
                if (isSuccess) {
                    navigate('/');
                }
            }
        }
        catch (error) {
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
        }
        else {
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
        }
        catch (error) {
            console.error("Failed to resend OTP:", error);
            toast.error("Failed to resend OTP");
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Otp Verification" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-center", children: [_jsx("input", { type: "text", value: otp, placeholder: "Enter OTP", onChange: (e) => setOtp(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "submit", className: "max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 bg-blue-500 text-white  hover:bg-blue-700 ", children: "Submit" })] }), _jsx("div", { className: "mt-4 text-center", children: isResendDisabled ? (_jsxs("p", { className: "text-gray-500", children: ["Resend OTP in ", Math.floor(timer / 60), ":", String(timer % 60).padStart(2, '0'), " minutes"] })) : (_jsx("button", { onClick: handleResendOtp, className: `max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 ${isResendDisabled
                                ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"}`, disabled: isResendDisabled, children: "Resend OTP" })) })] })] }));
};
export default VerifyUser;

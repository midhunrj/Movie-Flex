import React,{useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { BrowserRouter,useNavigate } from "react-router-dom";
import './css/login.css'
import { toast } from "react-toastify";
// import { forgotPass } from "../../services/api";
import { forgotPass } from "../../redux/user/userThunk";
const ForgotRoute=()=>{
    const [email,setEmail]=useState('')
    const {user,isLoading,isSuccess,isError,message}=useSelector((state)=>state.user)
     const navigate=useNavigate()
     const dispatch=useDispatch()
    const handleSubmit=async(e)=>{
       e.preventDefault()
       try {
        const response = await dispatch(forgotPass(email)).unwrap();
        console.log(response.data);
        if(isSuccess)
        {
            navigate('/otp-pass')
        }
       } catch (error) {
        console.error("forgot password failed:", error.response.data.error);
       }
       
    }

    
    useEffect(()=>{
        if(isError)
        {
           toast.error(message)
        }},[isError])

    //const [email,setEmail]=useState("")
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
        <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Forgot Password</h2>
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4 text-center">
        <input type='text' value={email} placeholder="enter email" onChange={(e)=>setEmail(e.target.value)}
        />
        <button type='submit'>submit</button>
            </form>
            </div>
            </div>
    )
}

export default ForgotRoute
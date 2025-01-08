import React,{useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { BrowserRouter,useNavigate } from "react-router-dom";
import './css/login.css'
import { Toaster, toast } from "sonner";
// import { forgotPass } from "../../services/api";
import { forgotPass } from "../../redux/user/userThunk";
import { AppDispatch, RootState } from "@/redux/store/store";
const ForgotRoute=()=>{
    const [email,setEmail]=useState('')
    const {user,isLoading,isSuccess,isError,message}=useSelector((state:RootState)=>state.user)
     const navigate=useNavigate()
     const dispatch=useDispatch<AppDispatch>()
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
       e.preventDefault()
       try {
        const response = await dispatch(forgotPass(email)).unwrap();
        console.log(response.data);
        if(isSuccess)
        {
            navigate('/otp-pass')
        }
       } catch (error:any) {
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
        className="w-full mx-8 px-4 justify-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
               
        />
        <button type='submit' className="max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 bg-blue-500 text-white  hover:bg-blue-700 ">Submit</button>
            </form>
            </div>
            </div>
    )
}

export default ForgotRoute
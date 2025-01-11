import React,{useState,useEffect} from "react";
import { Toaster, toast } from "sonner";
import { BrowserRouter,useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { forgotPass } from "../../redux/theatre/theatreThunk";
import './css/login.css'
import { AppDispatch, RootState } from "@/redux/store/store";
const ForgotRoutes=()=>{
    const [email,setEmail]=useState('')
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>()
    const {theatre,isError,isSuccess,message}=useSelector((state:RootState)=>state.theatre)
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
       e.preventDefault()
       if(email==""||!/\S+@\S+\.\S+/.test(email))
       {
        toast.error("enter a valid email")
       }
       else{
        dispatch(forgotPass(email))
        if(isSuccess)
        {
       navigate('/theatre/verify-email')
        }
    }
    }

    //const [email,setEmail]=useState("")
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
  
        <h1 className="text-2xl font-bold text-center align-text-top text-red-500 " >Welcome to Movie Flex</h1>
        <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Forgot Password</h2>
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4 text-center">   
    <input type='text' value={email} placeholder="enter email" onChange={(e)=>setEmail(e.target.value)}
     className="w-full mx-8 px-4 justify-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"/>
    <button type='submit' className="max-w-max py-2 min-h-8 px-4 rounded-md transition duration-300 bg-blue-500 text-white  hover:bg-blue-700 ">Submit</button>
        </form>
        </div>
        </div>
    )
}

export default ForgotRoutes
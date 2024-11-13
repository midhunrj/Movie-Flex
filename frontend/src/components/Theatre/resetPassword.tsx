import React,{useState,useEffect} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import './css/login.css'
import { useDispatch,useSelector } from "react-redux";
import { resetPass } from "../../redux/theatre/theatreThunk";
import { AppDispatch, RootState } from "@/redux/store/store";

const ResetPass=()=>{
    const [newPassword,setNewPassword]=useState("")
    const [confirmPass,setConfirmPass]=useState("")
     const navigate=useNavigate()
     const dispatch=useDispatch<AppDispatch>()
     const {theatre,isError,message,isSuccess}=useSelector((state:RootState)=>state.theatre)
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(newPassword===''||confirmPass==="")
    {
        toast.error('Enter password')
    }
    else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(newPassword))
    {
        toast.error('Password should be strong')
    }
    else if(newPassword!==confirmPass)
    {
        toast.error('passwords do not match')
    }
    else{
    const response = await dispatch(resetPass( newPassword)).unwrap();
        console.log("reset password successful:", response);
        // if(isSuccess)
        // {
        navigate('/theatre')
        // }
    }}
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
        {/* <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200"> */}
        <div className="relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96 ">
       
         <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
         <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Reset New Password</h2>
            <form id="loginForm" onSubmit={handleSubmit} className="space-y-4 text-center">
                    <input type='password' value={newPassword} placeholder="enter a new password" onChange={(e)=>setNewPassword(e.target.value)}/>
                <input type="password" value={confirmPass} placeholder="confirm new password" onChange={(e)=>setConfirmPass(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default ResetPass
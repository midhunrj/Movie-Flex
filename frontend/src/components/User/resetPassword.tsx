import React,{useState,useEffect} from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router";
import './css/login.css'
//import { resetPass } from "../../services/api";
import { toast } from "react-toastify";
import { resetPass } from "../../redux/user/userThunk";
import { AppDispatch, RootState } from "@/redux/store/store";
const ResetPassword=()=>{
    const [newPassword,setNewPassword]=useState("")
    const [confirmPass,setConfirmPass]=useState("")
    const {user,isLoading,isSuccess,isError,message}=useSelector((state:RootState)=>state.user)
     const navigate=useNavigate()
     const dispatch=useDispatch<AppDispatch>()
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
        const response = await dispatch(resetPass( newPassword)).unwrap();
        console.log("reset password successful:", response);
        if(isSuccess)
        {
        navigate('/')
        }
        
    } catch (error:any) {
        console.error("reset password failed:", error.response.data.error);
    }
};
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
        <div className="relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96 ">
       
         <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
         <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Reset New Password</h2>
            <form id="loginForm" onSubmit={handleSubmit} className="space-y-4 text-center">
                <input type='text' value={newPassword} placeholder="enter a new password" onChange={(e)=>setNewPassword(e.target.value)}/>
                <input type="text" value={confirmPass} placeholder="confirm new password" onChange={(e)=>setConfirmPass(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default ResetPassword

import React, { useState,useEffect } from "react";
import {useNavigate}from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
//import { login } from "../../services/api";
import GoogleLogin from "./googleAuthLogin";
import { login } from "../../redux/user/userThunk";
import {toast} from 'sonner'
import { clearState } from "../../redux/user/userSlice";
import { AppDispatch, RootState } from "@/redux/store/store";

interface ValidationErrors {
    email?: string;
    password?: string;
  }
  
const LoginForm:React.FC = () => {
    const [email, setEmail] = useState<string>("");
    
    const [password, setPassword] = useState<string>("");
    const {user,token,isLoading,isSuccess,isError,message}=useSelector((state:RootState)=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>()
    
    const validateForm = (): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
        }
    
        if (!password) {
            errors.password = "Password is required";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
            errors.password = "Password must be at least 7 characters long and include uppercase, lowercase, and a digit";
        }
    
        return errors;
    };
    

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          for (const error in validationErrors) {
            toast.error(validationErrors[error as keyof ValidationErrors]);
          }
          return;
        }
         try {
           
            const response = await dispatch(login({email, password}))
            console.log("Login successful:", response);
            if(isSuccess && token)
            {
            navigate('/home')
            }
            // Store token in localStorage or context for further use
             } catch (error) {
            //console.error("Login failed:", error.response.data.error);
         }
    };

    const getSignup=()=>
    {
        navigate('/signup')
    }

    const getForgot=()=>
    {
        navigate('/forgot-pass')
    }

    

    useEffect(()=>{
        if(user&& token)
        {
         navigate('/home')
         return
        }
        if(isError)
        {
           toast.error(message)
       
       }
       dispatch(clearState())
    },[user,isError,message])
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
{/* </div><div className="bg-transparent backdrop-blur-lg border-slate-600 flex   ring-slate-500 shadow-red-800 rounded-3xl flex-col m-8 p-16 items-center justify-center min-h-screen "> */}
   <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200">
             
            <h1 className=" mt-4 text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>

        <form id="loginForm" className="mt-12" onSubmit={handleSubmit}>
        {/* <div className="mb-6"> */}
                        {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label> */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
                className="w-full mx-8 px-4 justify-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                />
            {/* </div> */}
            {/* <div className="mb-6"> */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                className="w-full mx-8 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
               
            />
            {/* </div> */}
            <span onClick={getForgot} className="text-pretty text-opacity-80 text-white cursor-pointer">forgot password?</span>
            <button
                        type="submit"
                        className="w-fit px-4  min-h-8 mt-4 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
                    >
                    Login</button>
            <span onClick={getSignup} className="text-pretty text-opacity-80 text-white cursor-pointer">New user?Signup</span>

            {/* <span>signin using google</span>
            <Link to></a> */}
            <GoogleLogin/>
        </form>
        </div>
        </div>
        
    );
};

export default LoginForm;

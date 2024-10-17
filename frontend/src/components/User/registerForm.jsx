

import React, { useState,useEffect} from "react";
import {useNavigate}from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
//import { register } from "../../services/api";
//import './css/signup.css'
import { toast } from "react-toastify";
import { register } from "../../redux/user/userThunk";
const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass,setConfirmPass] = useState("");
    const [mobile, setMobile] = useState("");
    //const [email, setEmail] = useState("");
    //const [email, setEmail] = useState("");
    const {user,isLoading,isSuccess,isError,message}=useSelector((state)=>state.user)
     const navigate=useNavigate()
     const dispatch=useDispatch()
    // const handleSubmit = async (e: React.FormEvent) => {

    const validateForm = () => {
        const errors = {};
        if (!name) {
            errors.name = 'Name is required';
        }
        if (!mobile) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(mobile)) {
            errors.mobile = 'Mobile number is invalid';
        }
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid please include @ or .com in valid format';
        }
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if (!confirmPass) {
            errors.confirmPass = 'Confirm Password is required';
        } else if (password !== confirmPass) {
            errors.confirmPass = 'Passwords do not match';
        }
        return errors;
    };
        const handleSubmit = async (e) => {
        e.preventDefault();
        
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                for (const error in validationErrors) {
                    toast.error(validationErrors[error]);
                }
            }
            else
            {
            const response = await dispatch(register({name, email,mobile, password}));
            console.log("Registration successful:", response);
            if(isSuccess)
            {
            navigate('/newuser-verify')
            
            }
        }   
        } 
    
    const getLogin=()=>{
        navigate('/')
    }
    useEffect(()=>{
    if(isError)
    {
       toast.error(message)
    }},[isError])

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
        <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-2xl shadow-lg border flex-col m-8  items-center justify-center border-gray-500">
        <h1 className="text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
             <h2 className="text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8">Register form</h2>
        <form id="registerForm"  className="mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                  className="w-full mx-8 px-8 py-2  min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
            
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-8 py-2  min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
            
            />
            <input
                type="number"
                placeholder="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
             
            />
            
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
            
            />
            <input
                type="password"
                placeholder="Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
            
            />
            <button type="submit" className="mt-8 text-wrap h-max">Register</button>
            <caption onClick={getLogin} className="mt-4 text-wrap h-max text-opacity-80 text-white cursor-pointer">have an account?Login</caption>
        </form>
        </div>
        </div>
    );
};

export default RegisterForm;

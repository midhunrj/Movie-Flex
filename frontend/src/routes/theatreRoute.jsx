import React from "react";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Dashboard from "../components/User/dashboard";
import TheatreLoginForm from "../components/Theatre/loginForm";
import TheatreRegisterForm from "../components/Theatre/registerForm";
import TheatreDashboard from "../components/Theatre/dashboard";
import ForgotRoutes from "../components/Theatre/forgotPassword";
import ResetPass from "../components/Theatre/resetPassword";
import TheatrePassVerify from "../components/Theatre/emailOtpVerify";
import VerifyTheatre from "../components/Theatre/otpVerifyUser";
import TheatreHome from "../components/Theatre/home";
import AdminProtected from "./protected/adminProtected";
import TheatreProtected from "./protected/theatreProtected";
import TheatreProfile from "../components/Theatre/profile";
import RollingMovies from "../components/Theatre/Movies";
import Screens from "../components/Theatre/Screens";
import TierSeats from "../components/Theatre/tierSeats";

export const TheatreRoute=()=>{
    return(
        // <BrowserRouter>
        <Routes>
            <Route path='/' element={<TheatreLoginForm/>}/>
            <Route path='/signup' element={<TheatreRegisterForm/>}/>
            <Route path='/profile' element={<TheatreProtected><TheatreProfile/></TheatreProtected>}/>
            <Route path="/home" element={<TheatreProtected><TheatreHome/></TheatreProtected>}/>
            <Route path='/forgot-pass' element={<ForgotRoutes/>}/>
            <Route path='/reset-password' element={<ResetPass/>}/>
            <Route path="/verify-email" element={<TheatrePassVerify/>}/>
            <Route path="/newuser-verify" element={<VerifyTheatre/>}/>
            <Route path="/movies" element={<TheatreProtected><RollingMovies/></TheatreProtected>}/>
            <Route path='/screens' element={<TheatreProtected><Screens/></TheatreProtected>}/>
            <Route path='/tier-seats' element={<TheatreProtected><TierSeats/></TheatreProtected>}/>
        </Routes>
    )
}
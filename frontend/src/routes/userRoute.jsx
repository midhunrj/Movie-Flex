import React from "react";
import { BrowserRouter,Route,Routes } from "react-router-dom";

import LoginForm from "../components/User/loginForm";
import RegisterForm from "../components/User/registerForm";
import HomePage from "../components/User/home";
import ForgotRoute from "../components/User/forgotPassword";
import ResetPassword from "../components/User/resetPassword";
import Dashboard from "../components/User/dashboard";
import PassVerify from "../components/User/emailOtpVerify";
import VerifyUser from "../components/User/otpVerifyUser";
import UserProtected from "./protected/userProtected";
import UserProfile from "../components/User/Profile";
import FullMoviesList from "../components/User/filterMovies";
import MovieDetails from "../components/User/movieDetails";

export const UserRoute=()=>{
    return(
        // <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginForm/>}/>
            <Route path='/signup' element={<RegisterForm/>}/>
            <Route path="/home" element={<UserProtected><HomePage/></UserProtected>}/>
            <Route path='/forgot-pass' element={<ForgotRoute/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
            <Route path='/newuser-verify' element={<VerifyUser/>}/>
            <Route path='/otp-pass' element={<PassVerify/>}/>
            <Route path="/profile" element={<UserProtected><UserProfile/></UserProtected>}/>
            <Route path="/now-showing" element={<FullMoviesList movieType="now-showing" />} />
            <Route path="/movies/:id" element={<MovieDetails />} />

<Route path="/upcoming-movies" element={<FullMoviesList movieType="upcoming" />} />
</Routes>
    )
}
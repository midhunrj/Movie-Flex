import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
import DateShows from "@/components/User/dateShows";
import TheatreBooking from "@/components/User/theatreBooking";
import TheatreShows from "@/components/User/theatreShows";
import PaymentPage from "@/components/User/paymentPage";
import BookingOrders from "@/components/User/bookinOrders";
import FavouriteMovies from "@/components/User/FavouriteList";
import Wallet from "@/components/User/wallet";
import Notifications from "@/components/User/notifications";
// import PaymentComponent from "@/components/User/confirmation";


export const UserRoute = () => {
  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path='/signup' element={<RegisterForm/>}/>
            <Route path="/home" element={<UserProtected><HomePage/></UserProtected>}/>
            <Route path='/forgot-pass' element={<ForgotRoute/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
            <Route path='/newuser-verify' element={<VerifyUser/>}/>
            <Route path='/otp-pass' element={<PassVerify/>}/>
            <Route path="/profile" element={<UserProtected><UserProfile/></UserProtected>}/>
            <Route path="/now-showing" element={<UserProtected><FullMoviesList movieType="now-showing" /></UserProtected>} />
            <Route path="/movies/:id" element={<UserProtected><MovieDetails /></UserProtected>} />
            <Route path='/date-shows' element={<UserProtected><DateShows/></UserProtected>}/>
            <Route path='/seat-booking' element={<UserProtected><TheatreBooking/></UserProtected>}/>
            <Route path='/theatre-shows' element={<UserProtected><TheatreShows/></UserProtected>}/>
            <Route path='/payment-page' element={<UserProtected><PaymentPage/></UserProtected>}/>
             <Route path='/orders' element={<UserProtected><BookingOrders/></UserProtected>}/> 
             <Route path='/favourites' element={<UserProtected><FavouriteMovies/></UserProtected>}/>  
             <Route path='/wallet' element={<UserProtected><Wallet/></UserProtected>}/> 
             <Route path='/Notification' element={<UserProtected><Notifications/></UserProtected>}/>

      <Route
        path="/upcoming-movies"
        element={<UserProtected><FullMoviesList movieType="upcoming" /></UserProtected>}
      />
    </Routes>
  );
};

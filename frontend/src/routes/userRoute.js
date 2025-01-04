import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import LoginForm from "../components/User/loginForm";
import RegisterForm from "../components/User/registerForm";
import HomePage from "../components/User/home";
import ForgotRoute from "../components/User/forgotPassword";
import ResetPassword from "../components/User/resetPassword";
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
    _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LoginForm, {}) }), _jsx(Route, { path: '/signup', element: _jsx(RegisterForm, {}) }), _jsx(Route, { path: "/home", element: _jsx(UserProtected, { children: _jsx(HomePage, {}) }) }), _jsx(Route, { path: '/forgot-pass', element: _jsx(ForgotRoute, {}) }), _jsx(Route, { path: '/reset-password', element: _jsx(ResetPassword, {}) }), _jsx(Route, { path: '/newuser-verify', element: _jsx(VerifyUser, {}) }), _jsx(Route, { path: '/otp-pass', element: _jsx(PassVerify, {}) }), _jsx(Route, { path: "/profile", element: _jsx(UserProtected, { children: _jsx(UserProfile, {}) }) }), _jsx(Route, { path: "/now-showing", element: _jsx(UserProtected, { children: _jsx(FullMoviesList, { movieType: "now-showing" }) }) }), _jsx(Route, { path: "/movies/:id", element: _jsx(UserProtected, { children: _jsx(MovieDetails, {}) }) }), _jsx(Route, { path: '/date-shows', element: _jsx(UserProtected, { children: _jsx(DateShows, {}) }) }), _jsx(Route, { path: '/seat-booking', element: _jsx(UserProtected, { children: _jsx(TheatreBooking, {}) }) }), _jsx(Route, { path: '/theatre-shows', element: _jsx(UserProtected, { children: _jsx(TheatreShows, {}) }) }), _jsx(Route, { path: '/payment-page', element: _jsx(UserProtected, { children: _jsx(PaymentPage, {}) }) }), _jsx(Route, { path: '/orders', element: _jsx(UserProtected, { children: _jsx(BookingOrders, {}) }) }), _jsx(Route, { path: '/favourites', element: _jsx(UserProtected, { children: _jsx(FavouriteMovies, {}) }) }), _jsx(Route, { path: '/wallet', element: _jsx(UserProtected, { children: _jsx(Wallet, {}) }) }), _jsx(Route, { path: '/Notification', element: _jsx(UserProtected, { children: _jsx(Notifications, {}) }) }), _jsx(Route, { path: "/upcoming-movies", element: _jsx(UserProtected, { children: _jsx(FullMoviesList, { movieType: "upcoming" }) }) })] }));
};

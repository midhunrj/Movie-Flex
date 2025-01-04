import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import TheatreLoginForm from "../components/Theatre/loginForm";
import TheatreRegisterForm from "../components/Theatre/registerForm";
import ForgotRoutes from "../components/Theatre/forgotPassword";
import ResetPass from "../components/Theatre/resetPassword";
import TheatrePassVerify from "../components/Theatre/emailOtpVerify";
import VerifyTheatre from "../components/Theatre/otpVerifyUser";
import TheatreHome from "../components/Theatre/home";
import TheatreProtected from "./protected/theatreProtected";
import TheatreProfile from "../components/Theatre/profile";
import RollingMovies from "../components/Theatre/Movies";
import TierSeats from "../components/Theatre/tierSeats";
import ScreensList from "../components/Theatre/ScreensList";
import ScreensForm from "../components/Theatre/Screens";
import { IdentifierProvider } from "../utils/context/identifierContext";
import EditScreen from "../components/Theatre/EditScreen";
import Notifications from "@/components/Theatre/notification";
export const TheatreRoute = () => {
    return (
    // <BrowserRouter>
    _jsx(IdentifierProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(TheatreLoginForm, {}) }), _jsx(Route, { path: "/signup", element: _jsx(TheatreRegisterForm, {}) }), _jsx(Route, { path: "/profile", element: _jsx(TheatreProtected, { children: _jsx(TheatreProfile, {}) }) }), _jsx(Route, { path: "/home", element: _jsx(TheatreProtected, { children: _jsx(TheatreHome, {}) }) }), _jsx(Route, { path: "/forgot-pass", element: _jsx(ForgotRoutes, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(ResetPass, {}) }), _jsx(Route, { path: "/verify-email", element: _jsx(TheatrePassVerify, {}) }), _jsx(Route, { path: "/newuser-verify", element: _jsx(VerifyTheatre, {}) }), _jsx(Route, { path: "/movies", element: _jsx(TheatreProtected, { children: _jsx(RollingMovies, {}) }) }), _jsx(Route, { path: "/screens", element: _jsx(TheatreProtected, { children: _jsx(ScreensList, {}) }) }), _jsx(Route, { path: "/new-screen", element: _jsx(TheatreProtected, { children: _jsx(ScreensForm, {}) }) }), _jsx(Route, { path: "/tier-seats", element: _jsx(TheatreProtected, { children: _jsx(TierSeats, {}) }) }), _jsx(Route, { path: "/edit-screen/:id", element: _jsx(TheatreProtected, { children: _jsx(EditScreen, {}) }) }), _jsx(Route, { path: "/Notification", element: _jsx(TheatreProtected, { children: _jsx(Notifications, {}) }) })] }) }));
};

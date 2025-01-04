import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import AdminLoginForm from "../components/Admin/loginForm";
import UserList from "../components/Admin/userManagement";
import TheatreList from "../components/Admin/theatreManagement";
import AdminProtected from "./protected/adminProtected";
import MovieList from "../components/Admin/movieManagement";
import RunningMovies from "../components/Admin/runningMovies";
import Dashboard from "../components/Admin/home";
export const AdminRoute = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AdminLoginForm, {}) }), _jsx(Route, { path: "/home", element: _jsx(AdminProtected, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(AdminProtected, { children: _jsx(UserList, {}) }) }), _jsx(Route, { path: "/theatre", element: _jsx(AdminProtected, { children: _jsx(TheatreList, {}) }) }), _jsx(Route, { path: "/movies", element: _jsx(AdminProtected, { children: _jsx(MovieList, {}) }) }), _jsx(Route, { path: "/running-movies", element: _jsx(AdminProtected, { children: _jsx(RunningMovies, {}) }) })] }));
};

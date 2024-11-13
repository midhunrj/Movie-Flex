import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLoginForm from "../components/Admin/loginForm";
import AdminDashboard from "../components/Admin/dashboard";
import HomePage from "../components/Admin/home";
import UserList from "../components/Admin/userManagement";
import TheatreList from "../components/Admin/theatreManagement";
import AdminProtected from "./protected/adminProtected";
import MovieList from "../components/Admin/movieManagement";
import RunningMovies from "../components/Admin/runningMovies";

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginForm />} />
      {/* <Route path="/home" element={<AdminProtected><HomePage/></AdminProtected>}/>
            <Route path="/users" element={<AdminProtected><UserList/></AdminProtected>}/>
            <Route path="/theatre" element={<AdminProtected><TheatreList/></AdminProtected>}/>
            <Route path="/movies" element={<AdminProtected><MovieList/></AdminProtected>}/>
            <Route path="/running-movies" element={<AdminProtected><RunningMovies/></AdminProtected>}/>
             */}
    </Routes>
  );
};

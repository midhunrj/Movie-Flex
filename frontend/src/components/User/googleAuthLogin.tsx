

import React,{useEffect} from "react";
import { useNavigate } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { useDispatch,useSelector } from "react-redux";
import { auth, googleProvider } from "../../services/firebase/firebase";
// import { googleLogin } from "../../services/api";
import { googleLogin } from "../../redux/admin/adminThunk";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store/store";

const GoogleLogin = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch<AppDispatch>()
   const {user,isSuccess,isError,message}=useSelector((state:RootState)=>state.user)
    const googleSignIn = async () => {
        try {
            // Sign in with Google using Firebase
            const result = await signInWithPopup(auth, googleProvider);
            console.log(result, "result");

            // Get the Firebase ID token from the result
            const token = await result.user.getIdToken();
            console.log("token", token);

            // Send the token to your backend for verification and further processing
            const response = await dispatch(googleLogin(token));

            // If sign-in is successful, navigate to the home page
            if (isSuccess) {
                console.log(response);
                navigate("/home");
            }
        } catch (error) {
            console.error("Google Sign-In failed:", error);
        }
    };

    
    useEffect(()=>{
        if(isError)
        {
           toast.error(message)
        }},[isError])

    return (
        <button
        onClick={googleSignIn}
        className="flex items-center justify-center w-48 px-4 py-2 mt-4  min-h-11 space-x-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {/* Google Logo */}
        <img
          src="/g_icon.png"
          alt="Google Logo"
          className="mx-0 h-10 "
        />
        <span className="text-gray-700 font-medium  h-13">Sign in with Google</span>
      </button>
    );
};

export default GoogleLogin;


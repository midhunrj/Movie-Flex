import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, googleProvider } from "../../services/firebase/firebase";
// import { googleLogin } from "../../services/api";
import { toast } from "sonner";
import { googleLogin } from "@/redux/user/userThunk";
const GoogleLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, isError, message } = useSelector((state) => state.user);
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
        }
        catch (error) {
            console.error("Google Sign-In failed:", error);
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("button", { onClick: googleSignIn, className: "flex items-center justify-center w-48 px-4 py-2 mt-4  min-h-11 space-x-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx("img", { src: "/g_icon.png", alt: "Google Logo", className: "mx-0 h-10 " }), _jsx("span", { className: "text-gray-700 font-medium  h-13", children: "Sign in with Google" })] }));
};
export default GoogleLogin;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import './css/login.css';
//import { resetPass } from "../../services/api";
import { toast } from "sonner";
import { resetPass } from "../../redux/user/userThunk";
const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(resetPass(newPassword)).unwrap();
            console.log("reset password successful:", response);
            if (isSuccess) {
                navigate('/');
            }
        }
        catch (error) {
            console.error("reset password failed:", error.response.data.error);
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96 ", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Reset New Password" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, className: "space-y-4 text-center", children: [_jsx("input", { type: 'text', value: newPassword, placeholder: "enter a new password", onChange: (e) => setNewPassword(e.target.value) }), _jsx("input", { type: "text", value: confirmPass, placeholder: "confirm new password", onChange: (e) => setConfirmPass(e.target.value) }), _jsx("button", { type: "submit", children: "Submit" })] })] })] }));
};
export default ResetPassword;

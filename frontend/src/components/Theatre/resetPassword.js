import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import './css/login.css';
import { useDispatch, useSelector } from "react-redux";
import { resetPass } from "../../redux/theatre/theatreThunk";
const ResetPass = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, isError, message, isSuccess } = useSelector((state) => state.theatre);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword === '' || confirmPass === "") {
            toast.error('Enter password');
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(newPassword)) {
            toast.error('Password should be strong');
        }
        else if (newPassword !== confirmPass) {
            toast.error('passwords do not match');
        }
        else {
            const response = await dispatch(resetPass(newPassword)).unwrap();
            console.log("reset password successful:", response);
            // if(isSuccess)
            // {
            navigate('/theatre');
            // }
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96 ", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Reset New Password" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, className: "space-y-4 text-center", children: [_jsx("input", { type: 'password', value: newPassword, placeholder: "enter a new password", onChange: (e) => setNewPassword(e.target.value) }), _jsx("input", { type: "password", value: confirmPass, placeholder: "confirm new password", onChange: (e) => setConfirmPass(e.target.value) }), _jsx("button", { type: "submit", children: "Submit" })] })] })] }));
};
export default ResetPass;

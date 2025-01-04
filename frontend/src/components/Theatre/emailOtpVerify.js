import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import './css/login.css';
// import { newPassVerify } from "../../services/api";
import { newPassVerify } from "../../redux/theatre/theatreThunk";
//import { Toaster, toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
const TheatrePassVerify = () => {
    const [otp, setOtp] = useState("");
    //const [confirmPass,setConfirmPass]=useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, isError, isSuccess, message } = useSelector((state) => state.theatre);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (otp == '') {
                toast.error('Enter Otp');
            }
            else {
                const response = await dispatch(newPassVerify(otp));
                if (isSuccess) {
                    navigate('/theatre/reset-password');
                }
            }
        }
        catch (error) {
            console.error("otp verify failed:", error.response.data.error);
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Otp Verification" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, children: [_jsx("input", { type: 'text', value: otp, placeholder: "enter a otp", onChange: (e) => setOtp(e.target.value) }), _jsx("button", { type: "submit", children: "Submit" })] })] })] }));
};
export default TheatrePassVerify;

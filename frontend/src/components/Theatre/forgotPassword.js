import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPass } from "../../redux/theatre/theatreThunk";
import './css/login.css';
const ForgotRoutes = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, isError, isSuccess, message } = useSelector((state) => state.theatre);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email == "" || !/\S+@\S+\.\S+/.test(email)) {
            toast.error("enter a valid email");
        }
        else {
            dispatch(forgotPass(email));
            if (isSuccess) {
                navigate('/theatre/verify-email');
            }
        }
    };
    //const [email,setEmail]=useState("")
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Forgot Password" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, className: "space-y-4 text-center", children: [_jsx("input", { type: 'text', value: email, placeholder: "enter email", onChange: (e) => setEmail(e.target.value) }), _jsx("button", { type: 'submit', children: "submit" })] })] })] }));
};
export default ForgotRoutes;

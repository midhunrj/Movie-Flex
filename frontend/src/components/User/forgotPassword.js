import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './css/login.css';
import { toast } from "sonner";
// import { forgotPass } from "../../services/api";
import { forgotPass } from "../../redux/user/userThunk";
const ForgotRoute = () => {
    const [email, setEmail] = useState('');
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(forgotPass(email)).unwrap();
            console.log(response.data);
            if (isSuccess) {
                navigate('/otp-pass');
            }
        }
        catch (error) {
            console.error("forgot password failed:", error.response.data.error);
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError]);
    //const [email,setEmail]=useState("")
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-3xl shadow-lg border flex-col m-8  items-center justify-center border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  text-center text-amber-400 align-text-bottom mt-8", children: "Forgot Password" }), _jsxs("form", { id: "loginForm", onSubmit: handleSubmit, className: "space-y-4 text-center", children: [_jsx("input", { type: 'text', value: email, placeholder: "enter email", onChange: (e) => setEmail(e.target.value) }), _jsx("button", { type: 'submit', children: "submit" })] })] })] }));
};
export default ForgotRoute;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../../redux/admin/adminThunk";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
const AdminLoginForm = () => {
    const [email, setEmail] = useState("");
    const { admin, isError, isSuccess, message } = useSelector((state) => state.admin);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(login({ email, password }));
            if (isSuccess) {
                navigate('/admin/home');
            }
        }
        catch (error) {
            console.error("Login failed:", error.response.data.error);
        }
    };
    useEffect(() => {
        if (admin) {
            navigate('/admin/home');
            return;
        }
        else if (isError) {
            toast.error(message);
        }
    }, [isError, admin, message]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 bg-transparent  backdrop-blur-md shadow-lg border flex   rounded-2xl  border-gray-500 flex-col mx-8 my-12 p-16 items-center justify-center h-96 ", children: [_jsx("h1", { className: "text-2xl font-bold  align-text-top text-red-500 ", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold  align-text-bottom mt-8 text-yellow-400", children: "Admin Login Form" }), _jsxs("form", { id: "loginForm", className: "mt-8", onSubmit: handleSubmit, children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4" }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full px-4 py-2 border mb-8 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4" }), _jsx("button", { type: "submit", className: "w-fit px-4  min-h-8 mt-8 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300", children: "Login" })] })] })] }));
};
export default AdminLoginForm;

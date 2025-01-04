import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/theatre/theatreThunk";
import { toast } from "sonner";
import { clearState } from "../../redux/theatre/theatreSlice";
import './css/signup.css';
const TheatreRegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [mobile, setMobile] = useState("");
    const [file, setFile] = useState(null);
    const { theatre, isError, isSuccess, message } = useSelector((state) => state.theatre);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // File Upload Handler
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            const fileSizeInMB = uploadedFile.size / (1024 * 1024);
            const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
            if (validFileTypes.includes(uploadedFile.type) && fileSizeInMB <= 2) {
                setFile(uploadedFile);
            }
            else {
                setFile(null);
                toast.error("Invalid file type or size. Only .jpg, .png, and .pdf files under 2MB are allowed.");
            }
        }
    };
    // Form Validation
    const validateForm = () => {
        const errors = {};
        if (!name)
            errors.name = 'Name is required';
        if (!mobile) {
            errors.mobile = 'Mobile number is required';
        }
        else if (!/^\d{10}$/.test(mobile)) {
            errors.mobile = 'Mobile number is invalid';
        }
        if (!email) {
            errors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        else if (password.length < 7) {
            errors.password = 'Password must be at least 7 characters';
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
            errors.password = 'Password should be strong';
        }
        if (!confirmPass) {
            errors.confirmPass = 'Confirm Password is required';
        }
        else if (password !== confirmPass) {
            errors.confirmPass = 'Passwords do not match';
        }
        if (!file) {
            errors.file = 'Theatre license is required';
        }
        return errors;
    };
    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                Object.values(validationErrors).forEach((error) => {
                    toast.error(error);
                });
                return;
            }
            if (file) {
                dispatch(register({ name, email, mobile, password, file }));
            }
            else {
                toast.error("Theatre license is required");
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    };
    // Error and Success Handling
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);
    useEffect(() => {
        if (theatre) {
            navigate('/theatre/newuser-verify');
            dispatch(clearState());
        }
    }, [theatre, dispatch, navigate]);
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center", children: [_jsx("img", { src: "/backgrnd mvlog.jpg", className: "absolute inset-0 w-full h-full object-cover", alt: "Background" }), _jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("div", { className: "relative z-10 max-w-fit w-full bg-transparent backdrop-blur-md flex rounded-2xl shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-fit", children: [_jsx("h1", { className: "-mt-8 text-2xl font-bold text-red-500", children: "Welcome to Movie Ticket Booking" }), _jsx("h2", { className: "text-xl font-bold mt-4 text-yellow-400", children: "Register your theatre details" }), _jsxs("form", { id: "registerForm", className: "mt-8", onSubmit: handleSubmit, encType: "multipart/form-data", children: [_jsx("input", { type: "text", placeholder: "Name", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-8 py-2 border border-gray-300 rounded-lg mt-4" }), _jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-8 py-2 border border-gray-300 rounded-lg mt-4" }), _jsx("input", { type: "number", placeholder: "Mobile", value: mobile, onChange: (e) => setMobile(e.target.value), className: "w-full px-8 py-2 border border-gray-300 rounded-lg mt-4" }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-8 py-2 border border-gray-300 rounded-lg mt-4" }), _jsx("input", { type: "password", placeholder: "Confirm Password", value: confirmPass, onChange: (e) => setConfirmPass(e.target.value), className: "w-full px-8 py-2 border border-gray-300 rounded-lg mt-4" }), _jsxs("div", { className: "flex flex-col mb-6", children: [_jsxs("label", { className: "mt-2 text-gray-200", children: ["Upload Theatre License ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "file", accept: ".pdf, .jpg, .jpeg, .png", onChange: handleFileUpload, className: "text-gray-400 file:py-2 file:px-4 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" })] }), _jsx("button", { type: "submit", className: "w-fit px-4 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 transition duration-300", children: "Register" })] })] })] }));
};
export default TheatreRegisterForm;

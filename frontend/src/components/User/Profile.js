import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import axios from "axios";
import { userAuthenticate } from "../../utils/axios/userInterceptor";
import { useSelector } from "react-redux";
import { toast } from "sonner";
const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailChanged, setEmailChanged] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState(null);
    const [verifyButtonLabel, setVerifyButtonLabel] = useState("Verify Email");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
            });
        }
    }, [user]);
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleOtpVerify = async () => {
        try {
            const response = await axios.post("/api/verify-otp", { otp });
            if (response.data.success) {
                setOtpVerified(true);
                setShowOtpInput(false);
                setEmailChanged(false);
                setVerifyButtonLabel("Verified");
            }
            else {
                setError("OTP verification failed");
            }
        }
        catch (error) {
            setError("OTP verification failed");
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (user && name === "email" && value !== user.email) {
            setEmailChanged(true);
            setOtpVerified(false);
            setShowOtpInput(false);
            setVerifyButtonLabel("Verify Email");
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleEmailVerifyClick = async () => {
        if (!showOtpInput) {
            setShowOtpInput(true);
            setVerifyButtonLabel("Verify OTP");
        }
        else {
            await handleOtpVerify();
        }
    };
    const handleSave = async () => {
        if (emailChanged && !otpVerified) {
            toast.error("Please verify OTP for the updated email.");
            return;
        }
        const updatedData = { ...formData };
        if (showPasswordFields) {
            if (!oldPassword || !newPassword) {
                toast.error("Please fill out all password fields.");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("New password and confirm password do not match.");
                return;
            }
            updatedData.oldPassword = oldPassword;
            updatedData.newPassword = newPassword;
        }
        try {
            const response = await userAuthenticate.put("/userprofile", updatedData);
            if (response.data.success) {
                setIsEditing(false);
                setShowPasswordFields(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError("");
                toast.success("Profile updated successfully!");
            }
            else {
                toast.error(response.data.message || "Error saving user data");
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
        }
        finally {
            //setShowPasswordFields(false)
        }
    };
    const handleChangePasswordClick = () => {
        if (showPasswordFields) {
            // If already showing, hide it and clear the fields
            setShowPasswordFields(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        else {
            // If not showing, show the fields
            setShowPasswordFields(true);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("div", { className: "bg-gray-100 min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg  shadow-lg w-full min-h-max max-w-md ", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4 text-center", children: isEditing ? "Edit Profile" : "User Profile" }), _jsxs("div", { className: "space-y-4", children: [!showPasswordFields &&
                                    _jsxs(_Fragment, { children: ["            ", _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "Name:" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, disabled: !isEditing, className: `w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded border ${!isEditing ? 'bg-gray-200' : 'bg-white'}` })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "Email:" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, disabled: true, 
                                                        // disabled={!isEditing || (isEditing && showOtpInput)}
                                                        className: `w-full p-2 border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent border ${!isEditing ? 'bg-gray-200' : 'bg-slate-200'}` })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "Mobile:" }), _jsx("input", { type: "text", name: "mobile", value: formData.mobile, onChange: handleChange, disabled: !isEditing, className: `w-full p-2 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border ${!isEditing ? 'bg-gray-200' : 'bg-white'}` })] })] }), showPasswordFields && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "Old Password:" }), _jsx("input", { type: "password", name: "oldPassword", value: oldPassword, onChange: (e) => setOldPassword(e.target.value), className: "w-full p-2 rounded border bg-white" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "New Password:" }), _jsx("input", { type: "password", name: "newPassword", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full p-2 rounded border bg-white" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "w-28 font-medium", children: "Confirm Password:" }), _jsx("input", { type: "password", name: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full p-2 rounded border bg-white" })] }), passwordError && (_jsx("p", { className: "text-red-500 text-sm", children: passwordError }))] })), _jsx("div", { className: "flex justify-between items-center mt-6", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleChangePasswordClick, className: "px-4 py-1 min-h-8 w-fit bg-yellow-500 text-white rounded hover:bg-yellow-600", children: showPasswordFields ? "Close " : "Change Password" }), _jsx("button", { onClick: handleSave, className: "px-4 py-1 min-h-8 bg-green-500 text-white rounded w-fit hover:bg-green-600", children: "Save Profile" })] })) : (_jsx("button", { onClick: handleEdit, className: "px-4 py-1 min-h-8 bg-blue-500 text-white rounded w-fit hover:bg-blue-600", children: "Edit Profile" })) }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] })] }) }), _jsx(Footer, {})] }));
};
export default UserProfile;

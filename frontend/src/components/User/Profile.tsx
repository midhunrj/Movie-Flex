import React, { useState, useEffect, ChangeEvent } from "react";
import Header from "./header";
import Footer from "./footer";
import axios from "axios";
import { userAuthenticate } from "../../utils/axios/userInterceptor";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/redux/store/store";

interface User {
  name: string;
  email: string;
  mobile: string;
}

interface FormData extends User {
  oldPassword?: string;
  newPassword?: string;
}

interface OtpResponse {
  success: boolean;
  message?: string;
}
const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      } else {
        setError("OTP verification failed");
      }
    } catch (error) {
      setError("OTP verification failed");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    } else {
      await handleOtpVerify();
    }
  };

  const handleSave = async () => {
    if (emailChanged && !otpVerified) {
      toast.error("Please verify OTP for the updated email.");
      return;
    }

    const updatedData: FormData = { ...formData };

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
      } else {
        toast.error(response.data.message || "Error saving user data");
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
    finally{
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
    } else {
      // If not showing, show the fields
      setShowPasswordFields(true);
    }
  };

  return (
    <>
      <Header searchQuery="" setSearchQuery={()=>{}} />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg  shadow-lg w-full min-h-max max-w-md ">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {isEditing ? "Edit Profile" : "User Profile"}
          </h2>

          <div className="space-y-4">
            {!showPasswordFields &&
            <>            <div className="flex items-center space-x-4">
            <label className="w-28 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded border ${!isEditing ? 'bg-gray-200' : 'bg-white'}`}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-28 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              // disabled={!isEditing || (isEditing && showOtpInput)}
              className={`w-full p-2 border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent border ${!isEditing ? 'bg-gray-200' : 'bg-slate-200'}`}
            />
            {/* {isEditing && (
              <button
                onClick={handleEmailVerifyClick}
                className={`px-4 py-2 bg-blue-500 min-h-8 text-white rounded hover:bg-blue-600 ${!emailChanged ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!emailChanged}
              >
                {verifyButtonLabel}
              </button>
            )} */}
          </div>

          {/* {showOtpInput && (
            <div className="flex items-center space-x-4">
              <label className="w-20 font-medium">Enter OTP:</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-fit p-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent inset-0 border-collapse border-spacing-2 border-hidden bg-white"
              />
            </div>
          )} */}

          <div className="flex items-center space-x-4">
            <label className="w-28 font-medium">Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border ${!isEditing ? 'bg-gray-200' : 'bg-white'}`}
            />
          </div>
</>}
            {/* Password Fields */}
            {showPasswordFields && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="w-28 font-medium">Old Password:</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 rounded border bg-white"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-28 font-medium">New Password:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 rounded border bg-white"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-28 font-medium">Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 rounded border bg-white"
                  />
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
              </>
            )}

            <div className="flex justify-between items-center mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleChangePasswordClick}
                    className="px-4 py-1 min-h-8 w-fit bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    {showPasswordFields ? "Close " : "Change Password"}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1 min-h-8 bg-green-500 text-white rounded w-fit hover:bg-green-600"
                  >
                    Save Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-1 min-h-8 bg-blue-500 text-white rounded w-fit hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

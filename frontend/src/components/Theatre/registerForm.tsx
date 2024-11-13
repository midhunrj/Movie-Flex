import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/theatre/theatreThunk";
import { toast } from "react-toastify";
import { clearState } from "../../redux/theatre/theatreSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import './css/signup.css';

interface ValidationErrors {
  [key: string]: string;
}

const TheatreRegisterForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const { theatre, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.theatre
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const fileSizeInMB = uploadedFile.size / (1024 * 1024);
      const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (validFileTypes.includes(uploadedFile.type) && fileSizeInMB <= 2) {
        setFile(uploadedFile);
      } else {
        setFile(null);
        toast.error("Invalid file type or size. Only .jpg, .png, and .pdf files under 2MB are allowed.");
      }
    }
  };

  // Form Validation
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!name) errors.name = 'Name is required';
    if (!mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = 'Mobile number is invalid';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 7) {
      errors.password = 'Password must be at least 7 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
      errors.password = 'Password should be strong';
    }
    if (!confirmPass) {
      errors.confirmPass = 'Confirm Password is required';
    } else if (password !== confirmPass) {
      errors.confirmPass = 'Passwords do not match';
    }
    if (!file) {
      errors.file = 'Theatre license is required';
    }
    return errors;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      } else {
        toast.error("Theatre license is required");
      }
    } catch (error) {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src="/backgrnd mvlog.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 max-w-fit w-full bg-transparent backdrop-blur-md flex rounded-2xl shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-fit">
        <h1 className="-mt-8 text-2xl font-bold text-red-500">
          Welcome to Movie Ticket Booking
        </h1>
        <h2 className="text-xl font-bold mt-4 text-yellow-400">
          Register your theatre details
        </h2>
        <form id="registerForm" className="mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-2 border border-gray-300 rounded-lg mt-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-2 border border-gray-300 rounded-lg mt-4"
          />
          <input
            type="number"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-8 py-2 border border-gray-300 rounded-lg mt-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-2 border border-gray-300 rounded-lg mt-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full px-8 py-2 border border-gray-300 rounded-lg mt-4"
          />
          <div className="flex flex-col mb-6">
            <label className="mt-2 text-gray-200">
              Upload Theatre License <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileUpload}
              className="text-gray-400 file:py-2 file:px-4 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="w-fit px-4 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default TheatreRegisterForm;

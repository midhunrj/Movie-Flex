import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/theatre/theatreThunk";
import "./css/login.css";
import { Toaster, toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import usePreviousPath from "../../utils/hooks/previousPath";
import { AppDispatch, RootState } from "@/redux/store/store";

type ValidationErrors = {
  email?: string;
  password?: string;
};

const TheatreLoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const previousPath = usePreviousPath();
  const dispatch = useDispatch<AppDispatch>();

  const { theatre, token, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.theatre
  );

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      for (const error in validationErrors) {
        toast.error(validationErrors[error as keyof ValidationErrors]);
      }
      return;
    }

    try {
      const response = await dispatch(login({ email, password }));
      console.log("Login successful:", response);
    } catch (error: any) {
      console.error("Login failed:", error?.response?.data?.error);
      toast.error("Login failed. Please try again.");
    }
  };

  const getSignup = () => {
    navigate("/theatre/signup");
  };

  const getForgot = () => {
    navigate("/theatre/forgot-pass");
  };

  useEffect(() => {
    if (theatre?.address?.place && token) {
      navigate("/theatre/home");
    } else if (token) {
      localStorage.setItem("incompleteProfile", "true");
      navigate("/theatre/profile");
    }

    if (isError) {
      toast.error(message);
    }
  }, [theatre, token, isError, message, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image */}
      <img
        src="/backgrnd mvlog.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-fit w-full bg-transparent backdrop-blur-md flex rounded-2xl shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-96">
        <h1 className="mt-4 text-2xl text-center font-bold text-red-500">
          Welcome to Movie Flex
        </h1>
        <h2 className="text-xl font-bold mt-4 text-yellow-500">
          Theatre Login Form
        </h2>

        <form id="loginForm" className="mt-7" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
          />

          <span
            onClick={getForgot}
            className="mt-2 cursor-pointer text-opacity-80 text-white"
          >
            Forgot password?
          </span>

          <button
            type="submit"
            className="w-fit px-4 min-h-8 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
          >
            Login
          </button>

          <caption
            onClick={getSignup}
            className="mt-1 cursor-pointer text-opacity-80 text-white"
          >
            New user? Sign up
          </caption>
        </form>
      </div>
    </div>
  );
};

export default TheatreLoginForm;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Toaster, toast } from "sonner";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup"
// import { register } from "../../redux/user/userThunk";
// import { AppDispatch, RootState } from "@/redux/store/store";

// interface ValidationErrors {
//   name?: string;
//   email?: string;
//   mobile?: string;
//   password?: string;
//   confirmPass?: string;
// }

// const RegisterForm: React.FC = () => {
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPass, setConfirmPass] = useState<string>("");
//   const [mobile, setMobile] = useState<string>("");

//     const[showError,setShowError]=useState(false)
//   const { user, isLoading, isSuccess, isError, message } = useSelector(
//     (state: RootState) => state.user
//   );
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

  
//   const validateForm = (): ValidationErrors => {
//     const errors: ValidationErrors = {};
//     if (!name) errors.name = "Name is required";
//     if (!mobile) errors.mobile = "Mobile number is required";
//     else if (!/^\d{10}$/.test(mobile))
//       errors.mobile = "Mobile number is invalid";
//     if (!email) errors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email))
//       errors.email = "Email is invalid. Please include '@' and '.com'.";
//     if (!password) errors.password = "Password is required";
//     else if (password.length < 6)
//       errors.password = "Password must be at least 6 characters";
//     if (!confirmPass) errors.confirmPass = "Confirm Password is required";
//     else if (password !== confirmPass)
//       errors.confirmPass = "Passwords do not match";
//     return errors;
//   };

//   // Form submission handler
//   // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();
//   //   const validationErrors = validateForm();
//   //   if (Object.keys(validationErrors).length > 0) {
//   //     for (const error in validationErrors) {
//   //       toast.error((validationErrors as any)[error]);
//   //     }
//   //     return;
//   //   }
    
//   //   // Dispatch the register action
//   //   const response = await dispatch(
//   //     register({ name, email, mobile, password })
//   //   );

//   //   console.log("Registration successful:", response);
//   //   if (isSuccess) {
//   //     navigate("/newuser-verify");
//   //   }
//   // };

//   const handleSubmit = async (values: {
//     name: string;
//     email: string;
//     mobile: string;
//     password: string;
//     confirmPass: string;
//   }) => {
//     console.log("bn ");
    
//     const response = await dispatch(register(values));

//     if (response) {
//       navigate("/newuser-verify");
//     }
//   };
//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string()
//       .email("Email is invalid. Please include '@' and '.com'.")
//       .required("Email is required"),
//     mobile: Yup.string()
//       .matches(/^\d{10}$/, "Mobile number is invalid")
//       .required("Mobile number is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     confirmPass: Yup.string()
//       .oneOf([Yup.ref("password"), undefined], "Passwords do not match")
//       .required("Confirm Password is required"),
//   });

// console.log(validationSchema,"validate schema");

//   // Navigate to login page
//   const getLogin = () => {
//     navigate("/");
//   };
  
//   // Error handling using useEffect
//   useEffect(() => {
//     // if (isError) {
//     //   toast.error(message);
//     // }if
//       console.log("hhbb");
      
//     setShowError(true)
//     const registerError=setTimeout(()=>{
//        setShowError(false)
//     },3000)

//     return ()=>clearTimeout(registerError)
  
//     }, [isError, message,dispatch]);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       {/* Background image */}
//       <img
//         src="/backgrnd mvlog.jpg"
//         className="absolute inset-0 w-full h-full object-cover"
//         alt="Background"
//       />
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black opacity-50"></div>
//       <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-2xl shadow-lg border flex-col m-8 items-center justify-center border-gray-500">
//         <h1 className="text-2xl font-bold text-red-500">
//           Welcome to Movie Ticket Booking
//         </h1>
//         <h2 className="text-xl font-bold text-center text-amber-400 mt-8">
//           Register Form
//         </h2>
//         <Formik
//           initialValues={{
//             name: "",
//             email: "",
//             mobile: "",
//             password: "",
//             confirmPass: "",
//           }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//         <Form id="registerForm" className="mt-12" >
//           <Field
//             type="text"
//             placeholder="Name"
//             name="name"
//             //value={name}
//             //.onChange={(e) => setName(e.target.value)}
//             className="w-full mx-8 px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {showError?<ErrorMessage
//                   name="name"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />:<></>}
//           <Field
//             type="email"
//             placeholder="Email"
//             name="email"
//             //value={email}
//             //onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {showError?<ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />:<></>}
//           <Field
//             type="number"
//             placeholder="Mobile"
//             name="mobile"
//             //value={mobile}
//             //onChange={(e) => setMobile(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {showError?<ErrorMessage
//                   name="mobile"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />:<></>}
//           <Field
//             type="password"
//             placeholder="Password"
//             name="password"
//             //value={password}
//             //onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {showError?<ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />:<></>}
//           <Field
//             type="password"
//             placeholder="Confirm Password"
//             name="confirmPass"
//             //value={confirmPass}
//             //onChange={(e) => setConfirmPass(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {showError?<ErrorMessage
//                   name="confirmPass"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />:<></>}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="mt-8 bg-blue-600 w-fit h-fit text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             {isSubmitting ? "Registering..." : "Register"}
//           </button>
//           <caption
//             onClick={getLogin}
//             className="mt-4 text-white cursor-pointer hover:underline"
//           >
//             Have an account? Login
//           </caption>
//         </Form>
//           )}
//           </Formik>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;


// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const RegisterForm: React.FC = () => {
//   const [errorVisibility, setErrorVisibility] = useState<{ [key: string]: boolean }>({});

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     mobile: Yup.string()
//       .matches(/^\d{10}$/, "Mobile number is invalid")
//       .required("Mobile number is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     confirmPass: Yup.string()
//       .oneOf([Yup.ref("password"), undefined], "Passwords do not match")
//       .required("Confirm Password is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       mobile: "",
//       password: "",
//       confirmPass: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       console.log("Form values submitted:", values);
//     },
//   });

//   useEffect(() => {
//     // Set a timer for each field's error visibility
//     const timeoutIds: NodeJS.Timeout[] = [];
//     Object.keys(formik.errors).forEach((field) => {
//       const typedField = field as keyof typeof formik.errors;
//       if (formik.touched[typedField] && formik.errors[typedField]) {
//         setErrorVisibility((prev) => ({ ...prev, [field]: true }));
//         const timeoutId = setTimeout(() => {
//           setErrorVisibility((prev) => ({ ...prev, [field]: false }));
//         }, 3000);
//         timeoutIds.push(timeoutId);
//       }
//     });

//     // Cleanup timeouts
//     return () => {
//       timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
//     };
//   }, [formik.errors, formik.touched]);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       {/* Background and Overlay */}
//       <img
//         src="/backgrnd mvlog.jpg"
//         className="absolute inset-0 w-full h-full object-cover"
//         alt="Background"
//       />
//       <div className="absolute inset-0 bg-black opacity-50"></div>
//       <div className="relative z-10 w-full max-w-md p-8 border border-white bg-transparent rounded-2xl shadow-lg">
//         <h1 className="text-2xl font-bold text-red-500 text-center">
//           Register Form
//         </h1>
//         <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
//           {/* Name Field */}
//           <div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.name}
//             />
//             {errorVisibility.name && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.name}
//               </div>
//             )}
//           </div>
//           {/* Email Field */}
//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//             />
//             {errorVisibility.email && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.email}
//               </div>
//             )}
//           </div>
//           {/* Mobile Field */}
//           <div>
//             <input
//               type="text"
//               name="mobile"
//               placeholder="Mobile"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.mobile}
//             />
//             {errorVisibility.mobile && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.mobile}
//               </div>
//             )}
//           </div>
//           {/* Password Field */}
//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//             />
//             {errorVisibility.password && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.password}
//               </div>
//             )}
//           </div>
//           {/* Confirm Password Field */}
//           <div>
//             <input
//               type="password"
//               name="confirmPass"
//               placeholder="Confirm Password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.confirmPass}
//             />
//             {errorVisibility.confirmPass && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.confirmPass}
//               </div>
//             )}
//           </div>
//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Toaster, toast } from "sonner";

// import { register } from "../../redux/user/userThunk";
// import { AppDispatch, RootState } from "@/redux/store/store";
// import { clearState } from "@/redux/user/userSlice";

// interface ValidationErrors {
//   name?: string;
//   email?: string;
//   mobile?: string;
//   password?: string;
//   confirmPass?: string;
// }

// const RegisterForm: React.FC = () => {
//   // State variables
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPass, setConfirmPass] = useState<string>("");
//   const [mobile, setMobile] = useState<string>("");
//   const [errorMessages, setErrorMessages] = useState<ValidationErrors>({});
//   // Redux hooks
//   const { user, isLoading, isSuccess, isError, message } = useSelector(
//     (state: RootState) => state.user
//   );
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   // Form validation function
//   const validateForm = (): ValidationErrors => {
//     const errors: ValidationErrors = {};
//     if (!name) errors.name = "Name is required";
//     if (!mobile) errors.mobile = "Mobile number is required";
//     else if (!/^\d{10}$/.test(mobile))
//       errors.mobile = "Mobile number is invalid";
//     if (!email) errors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email))
//       errors.email = "Email is invalid. Please include '@' and '.com'.";
//     if (!password) errors.password = "Password is required";
//     else if (password.length < 6)
//       errors.password = "Password must be at least 6 characters";
//     if (!confirmPass) errors.confirmPass = "Confirm Password is required";
//     else if (password !== confirmPass)
//       errors.confirmPass = "Passwords do not match";
//     return errors;
//   };

//   // Form submission handler
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrorMessages(validationErrors);

//       // Clear individual errors after 3 seconds
//       Object.keys(validationErrors).forEach((field) => {
//         setTimeout(() => {
//           setErrorMessages((prevErrors) => {
//             const newErrors = { ...prevErrors };
//             delete newErrors[field as keyof ValidationErrors]
//             return newErrors;
//           });
//         }, 3000);
//       });

//       return;
//     }


//     // Dispatch the register action
//     const response = await dispatch(
//       register({ name, email, mobile, password })
//     );

//     console.log("Registration successful:", response);
//     if (isSuccess) {
//       navigate("/newuser-verify");
//     }
//   };

//   // Navigate to login page
//   const getLogin = () => {
//     navigate("/");
//   };
//   useEffect(() => {
//          if (user) {
//           navigate("/newuser-verify");
//            dispatch(clearState());
//          }
//        }, [user, dispatch, navigate]);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       {/* Background image */}
//       <img
//         src="/backgrnd mvlog.jpg"
//         className="absolute inset-0 w-full h-full object-cover"
//         alt="Background"
//       />
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black opacity-50"></div>
//       <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-2xl shadow-lg border flex-col m-8 items-center justify-center border-gray-500">
//         <h1 className="text-2xl font-bold text-red-500">
//           Welcome to Movie Ticket Booking
//         </h1>
//         <h2 className="text-xl font-bold text-center text-amber-400 mt-8">
//           Register Form
//         </h2>
//         <form id="registerForm" className="mt-12" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full mx-8 px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {errorMessages.name && <span className="text-red-500">{errorMessages.name}</span>}
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {errorMessages.name && <span className="text-red-500">{errorMessages.name}</span>}
//           <input
//             type="number"
//             placeholder="Mobile"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {errorMessages.mobile && <span className="text-red-500">{errorMessages.mobile}</span>}
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {errorMessages.password && <span className="text-red-500">{errorMessages.password}</span>}
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPass}
//             onChange={(e) => setConfirmPass(e.target.value)}
//             className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
//           />
//           {errorMessages.confirmPass && <span className="text-red-500">{errorMessages.confirmPass}</span>}
//           <button
//             type="submit"
//             className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Register
//           </button>
//           <caption
//             onClick={getLogin}
//             className="mt-4 text-white cursor-pointer hover:underline"
//           >
//             Have an account? Login
//           </caption>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

import { register } from "../../redux/user/userThunk";
import { AppDispatch, RootState } from "@/redux/store/store";

interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPass?: string;
}

const RegisterForm: React.FC = () => {
  // State variables
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");

  // Redux hooks
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Form validation function
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!name) errors.name = "Name is required";
    if (!mobile) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile))
      errors.mobile = "Mobile number is invalid";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Email is invalid. Please include '@' and '.com'.";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!confirmPass) errors.confirmPass = "Confirm Password is required";
    else if (password !== confirmPass)
      errors.confirmPass = "Passwords do not match";
    return errors;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      for (const error in validationErrors) {
        toast.error((validationErrors as any)[error]);
      }
      return;
    }

    // Dispatch the register action
    const response = await dispatch(
      register({ name, email, mobile, password })
    );

    console.log("Registration successful:", response);
    if (isSuccess) {
      navigate("/newuser-verify");
    }
  };

  // Navigate to login page
  const getLogin = () => {
    navigate("/");
  };

  // Error handling using useEffect
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

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
      <div className="relative z-10 w-full max-w-fit p-8 bg-transparent backdrop-blur-md rounded-2xl shadow-lg border flex-col m-8 items-center justify-center border-gray-500">
        <h1 className="text-2xl font-bold text-red-500">
          Welcome to Movie Ticket Booking
        </h1>
        <h2 className="text-xl font-bold text-center text-amber-400 mt-8">
          Register Form
        </h2>
        <form id="registerForm" className="mt-12" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mx-8 px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <input
            type="number"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white w-fit h-fit px-4 py-1 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
          <caption
            onClick={getLogin}
            className="mt-4 text-white cursor-pointer hover:underline"
          >
            Have an account? Login
          </caption>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
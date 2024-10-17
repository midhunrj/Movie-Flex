// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom'
// import { register } from "../../redux/theatre/theatreThunk";
// import './css/signup.css'
// import { toast } from "react-toastify";
// const TheatreRegisterForm = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPass, setConfirmPass] = useState("");
//     const [mobile, setMobile] = useState("");
//     const [file, setFile] = useState(null)
//     const { theatre, isError,isSuccess, message } = useSelector((state) => state.theatre)
//     //const [email, setEmail] = useState("");
//     //const [email, setEmail] = useState("");
//     const navigate = useNavigate()
//     const dispatch = useDispatch()


//     const getLogin = () => {
//         navigate('/theatre/')
//     }
//     const handleFileUpload = (e) => {
//         const uploadedFile = e.target.files[0];
//         if (uploadedFile) {
//             const fileSizeInMB = uploadedFile.size / (1024 * 1024);
//             const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];

//             if (validFileTypes.includes(uploadedFile.type) && fileSizeInMB <= 2) {
//                 setFile(uploadedFile);
//             } else {
//                 setFile(null);
//                 toast.error("Invalid file type or size. Only .jpg, .png, and .pdf files under 2MB are allowed.");
//             }
//         }
//     };
//     // const handleSubmit = async (e: React.FormEvent) => {

//     const validateForm = (event) => {
//         event.preventDefault();
//         const errors = {};
//         if (!name) {
//             errors.name = 'Name is required';
//         }
//         if (!mobile) {
//             errors.mobile = 'Mobile number is required';
//         } else if (!/^\d{10}$/.test(mobile)) {
//             errors.mobile = 'Mobile number is invalid';
//         }
//         if (!email) {
//             errors.email = 'Email is required';
//         }
//          else if (!/\S+@\S+\.\S+/.test(email)) {
//             errors.email = 'Email is invalid';
//         }
//         if (!password) {
//             errors.password = 'Password is required';
//         } else if (password.length < 7) {
//             errors.password = 'Password must be at least 7 characters';
//         }
//         else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
//             errors.password = 'password should be strong'
//         }
//         if (!confirmPass) {
//             errors.confirmPass = 'Confirm Password is required';
//         } else if (password !== confirmPass) {
//             errors.confirmPass = 'Passwords do not match';
//         }
//         if (!file) {
//             errors.file = 'Theatre license is required';
//         }
//         return errors;
//     };


//     const handleSubmit = async (e) => {
//         console.log("hggh");

//         e.preventDefault();
//         console.log("after ee");

//         try {
//             const validationErrors = validateForm(e);
//             if (Object.keys(validationErrors).length > 0) {
//                 for (const error in validationErrors) {
//                     toast.error(validationErrors[error]);
//                 }
//             } else {
//                 const response =  dispatch(register({ name, email, mobile, password, file }));
//                 console.log("Registration successful:", response);
//                 if(isSuccess)
//                     {
//                          navigate('/theatre/newuser-verify')
//                     }
//             }
//         } catch (error) {
//             console.error("Registration failed:", error.response.data.error);
//         }
//     };

//     useEffect(() => {
//         if (isError) {
//             toast.error(message)
//         }
//     }, [isError])

//     return (
//         <div className="relative min-h-screen flex items-center justify-center">
//             {/* Background image */}
//             <img
//                 src="/backgrnd mvlog.jpg"
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt="Background"
//             />
//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black opacity-50"></div>
//             <div className="relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-fit ">

//                 <h1 className="-mt-8 text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
//                 <h2 className="text-xl font-bold  align-text-bottom mt-4 text-yellow-400">Register your theatre details</h2>
//                 <form id="registerForm" className="mt-8" onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data" >
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"

//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"

//                     />
//                     <input
//                         type="number"
//                         placeholder="mobile"
//                         value={mobile}
//                         onChange={(e) => setMobile(e.target.value)}
//                         className="w-full px-8 py-2  min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"

//                     />

//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"

//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={confirmPass}
//                         onChange={(e) => setConfirmPass(e.target.value)}
//                         className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"

//                     />
//                     <div className="flex flex-col mb-6">
//                         <label className="mt-2 text-gray-200">Upload Theatre License <span className="text-red-500 text-xl h-8">*</span></label>
//                         <input
//                             type="file"
//                             accept=".pdf, .jpg, .jpeg, .png"
//                             onChange={handleFileUpload}
//                             className=" min-h-12 flex w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-fit px-4  min-h-8 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
//                     >
//                         Register
//                     </button>
//                 </form>
//                 <caption onClick={getLogin} className="mt-2 -mb-12 text-wrap  cursor-pointer text-opacity-80 text-white">have an account?Login</caption>
//             </div>
//         </div>
//     );
// };

// export default TheatreRegisterForm;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { register } from "../../redux/theatre/theatreThunk";
import './css/signup.css'
import { toast } from "react-toastify";
import { clearState } from "../../redux/theatre/theatreSlice";

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

    // const getLogin = () => {
    //     navigate('/theatre/');
    // };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
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

    const validateForm = () => {
        const errors = {};
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

    const handleSubmit = async (e) => {
        console.log(e);
        e.preventDefault();
        try{
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            for (const error in validationErrors) {
                toast.error(validationErrors[error]);
            }
        } else {
            dispatch(register({ name, email, mobile, password, file }));
              //navigate('/theatre/newuser-verify')
        }
    }
    catch(error)
    {
        console.log(error,"error");
        
    }
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        // if (isSuccess) {
        //     navigate('/theatre/newuser-verify');
        // }
    }, [isError, isSuccess, message, navigate]);

    useEffect(()=>{
        if(theatre){
            navigate('/theatre/newuser-verify');
         dispatch(clearState())
        }

    },[theatre])

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            
            <img
                src="/backgrnd mvlog.jpg"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Background"
            />
            
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10  max-w-fit  w-full bg-transparent backdrop-blur-md flex   rounded-2xl  shadow-lg border border-gray-500 flex-col m-8 p-16 items-center justify-center h-fit ">

                <h1 className="-mt-8 text-2xl font-bold  align-text-top text-red-500 " >Welcome to Movie Ticket Booking</h1>
                <h2 className="text-xl font-bold  align-text-bottom mt-4 text-yellow-400">Register your theatre details</h2>
                <form id="registerForm" className="mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                    />
                    <input
                        type="number"
                        placeholder="Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                    />
                    <div className="flex flex-col mb-6">
                        <label className="mt-2 text-gray-200">Upload Theatre License <span className="text-red-500 text-xl h-8">*</span></label>
                        <input
                            type="file"
                            accept=".pdf, .jpg, .jpeg, .png"
                            onChange={handleFileUpload}
                            className=" min-h-12 flex w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-fit px-4  min-h-8 mt-2 bg-blue-700 text-gray-300 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition duration-300"
                    >
                        Register
                    </button>
                </form>
                {/* <caption onClick={getLogin} className="mt-2 -mb-12 text-wrap  cursor-pointer text-opacity-80 text-white">have an account? Login</caption> */}
            </div>
        </div>
    );
};

export default TheatreRegisterForm;


import axios from "axios";
const API_BASE_URL = "https://api.movie-flex.site";
export const register = async (name, email, mobile, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, mobile, password });
        console.log(response);
        let token = response.data;
        localStorage.setItem("otpToken", token);
        return response.data;
    }
    catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password }); // No need for full URL
        return response.data;
    }
    catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
// export const googleLogin=async(req,res)=>{
// try{
//     const response=await axios.post(`${API_BASE_URL}/auth/google`)
//     return response.data
// }
// catch(error)
// {
//     console.error("Google sign-in failed")
// }
// }
export const googleLogin = async (token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/google`, { token });
        return response.data;
    }
    catch (error) {
        console.error("Google sign-in failed:", error);
        throw error;
    }
};
export const forgotPass = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        console.log(response);
        return response;
    }
    catch (error) {
        console.error("forgot password get error:", error);
        throw error;
    }
};
export const resetPass = async (newPassword) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, { newPassword });
        console.log(response);
        return response;
    }
    catch (error) {
        console.error("reset password get error:", error);
        throw error;
    }
};
export const userVerify = async (otp) => {
    try {
        let token = localStorage.getItem("otpToken");
        const response = await axios.post(`${API_BASE_URL}/verify-user`, { token, otp });
        console.log(response);
        return response.data;
    }
    catch (error) {
        console.error("userverify error", error);
        throw error;
    }
};
export const newPassVerify = async (otp) => {
    try {
        let token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/verify-otp`, { token, otp });
        console.log(response);
        return response.data;
    }
    catch (error) {
        console.error("otp passwordverify error", error);
        throw error;
    }
};
// export const register = async (name,email,password) => {
//     try {
//         const response = await axios.post(`/ticki/register`, { name, email, password }); // No need for full URL
//         return response.data;
//     } catch (error) {
//         console.error("Registration error:", error);
//         throw error;
//     }
// };

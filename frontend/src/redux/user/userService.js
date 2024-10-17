import axios, { Axios } from 'axios';
import  axiosUrl  from '../../utils/axios/baseUrl';
import { userAuthenticate } from '../../utils/axios/userInterceptor';

const API_BASE_URL = "http://localhost:7486";


export const registerUser = async (name, email, mobile, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, mobile, password });

        localStorage.setItem("otpToken", response.data);
        return response.data;
    } catch (error) {
        console.log(error,"error in service");
        
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data.error || "Something went wrong");
        }
    }
    
};

export const loginUser = async (email, password) => {
    try {
        console.log(email,password,"login enter")
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password },{withCredentials:true});
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        console.log(response,"response from backend");
        return response.data;
    } catch (error) {
        console.log(error, "axios error"); 

    
    if (error.response && error.response.data && error.response.data.error) {
        console.log(error);
        
      throw new Error(error.response.data.error); 
    } else {
      throw new Error(error.response.data.message); 
    }
    }
};

// export const Logout=async()=>{
//     try {
//         localStorage.removeItem('user') 

//     } catch (error) {
//         throw error;
//     }
// }

export const googleLoginUser = async (token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/google`, { token },{ withCredentials:true});
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        console.log(response,"response from backend");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        console.log(response,"response in frontend");
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (newPassword) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, { newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyUser = async (otp) => {
    try {
        const token = localStorage.getItem("otpToken");
        const response = await axios.post(`${API_BASE_URL}/verify-user`, { token, otp });
        
        return response.data;
    } catch (error) {
        console.log(error,"error")
        
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message); 
        } else {
            throw new Error(error.response.data.error); 
        }
    }
    
}

export const verifyNewPassword = async (otp) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/verify-otp`, { token, otp });
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const homePage=async ()=>{
    try{
        const userToken=localStorage.getItem('accessToken')
        const response=await userAuthenticate.get(`${API_BASE_URL}/home`,{})
            // headers={
            //     'Authorization':`Bearer${userToken}`
            // }
            return response.data
       // })
    }
    catch(error)
    {

    }
}

export const resendOtpAgain = async () => {
    try {
        let token=localStorage.getItem('otpToken')
        const response = await axios.post(`${API_BASE_URL}/resend-otp`, { token });
        console.log(response,"response in frontend");
        localStorage.setItem('otpToken',response.data.user)
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUpcomingMovies=async()=>{
    try{
        const response=await userAuthenticate.get('/fetchUpcomingMovies')
        return response.data
    }
    catch(error)
    {
        console.log(error,"error in service");
        
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || error.response.data.error || "Failed to fetch upcoming movies");
          } else {
            throw new Error("Something went wrong while fetching upcoming movies");
          }
   }
}


export const getNowShowingMovies=async()=>{
    try{
        const response=await userAuthenticate.get('/fetchNowShowingMovies')
        return response.data
    }
    catch(error)
    {
        console.log(error,"error in service");
        
       
    if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.error || "Failed to fetch now showing movies");
      } else {
        throw new Error("Something went wrong while fetching now showing movies");
      }
    }
}
const handleAxiosError = (error) => {
    if (error.response && error.response.data) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        } else if (error.response.data.message) {
            throw new Error(error.response.data.message);
        }
    }
    throw new Error('Something went wrong. Please try again later.');
};

import axios from 'axios';
import  axiosUrl  from '../../utils/axios/baseUrl';
import { theatreAuthenticate } from '../../utils/axios/theatreInterceptor';

const API_BASE_URL = "http://localhost:7486";


export const registerUser = async (name, email, mobile, password,file) => {
    try {
        console.log(name,email,"in service");
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('password', password);
        formData.append('file', file);
        
            const response = await axios.post(`${API_BASE_URL}/theatre/register`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
      
        });
        localStorage.setItem("otpThetToken", response.data);
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
        const response = await axios.post(`${API_BASE_URL}/theatre/login`, { email, password },{withCredentials:true});
        console.log(response,"response in theatre");
        
        localStorage.setItem('theatre', JSON.stringify(response.data.theatre));
        localStorage.setItem('theatreAccessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        console.log(response,"response from backend");
        return response.data;
    } catch (error) {
        console.error("Error during login", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||error.response?.data?.error|| "Login failed!";
        return Promise.reject(new Error(errorMessage));
    }
};

// export const Logout=async()=>{
//     try {
//         localStorage.removeItem('user') 

//     } catch (error) {
//         throw error;
//     }
// }

// export const googleLoginUser = async (token) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}theatre/auth/google`, { token });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/theatre/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (newPassword) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/theatre/reset-password`, { newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyUser = async (otp) => {
    try {
        const token = localStorage.getItem("otpThetToken");
        const response = await axios.post(`${API_BASE_URL}/theatre/verify-theatre`, { token, otp });
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyNewPassword = async (otp) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}theatre/verify-otp`, { token, otp });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const homePage=async ()=>{
    try{
        const userToken=localStorage.getItem('accessToken')
        const response=await axios.get(`${API_BASE_URL}theatre/home`,{})
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
        let token=localStorage.getItem('otpThetToken')
        const response = await axios.post(`${API_BASE_URL}/theatre/resend-otp`, { token });
        console.log(response,"response in frontend");
        localStorage.setItem('otpThetToken',response.data.theatre)
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addMoviesViaTheatre=async(movieId)=>{
    try {
       const response=await theatreAuthenticate.post("/add-movies",{movieId}) 
       console.log(response.data,"response from backend");
       return response.data
    } catch (error) {
        console.log(error,"error in service");
        
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data.error || "Something went wrong");
        }   
    }
}

export const completeTheatreProfileData=async(addressData)=>{
    try {
        //const location = await getCoordinatesFromAddress(addressData);
       const response=await theatreAuthenticate.post("/completeProfile",{addressData}) 
       console.log(response.data,"response from backend");
       return response.data
    } catch (error) {
        console.log(error,"error in service");
        
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data.error || "Something went wrong");
        }   
    }
}

export const getCoordinatesFromAddress = async (addressData) => {
    try {
        const { housename, place, city, state, pincode } = addressData;
        const address = `${housename}, ${place}, ${city}, ${state}, ${pincode}`;
        const GEOCODING_API_KEY = 'AIzaSyDOvUG534DGgjKFodSMB4GRl_UqJh_9yf8';

        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: GEOCODING_API_KEY
            }
        });

        console.log(response.data, "response from geocode api");

        const { results } = response.data;
        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error("Unable to fetch coordinates from the address");
        }
    } catch (error) {
        console.error("Geocoding API error:", error);
        throw new Error("Unable to fetch coordinates from the address");
    }
};





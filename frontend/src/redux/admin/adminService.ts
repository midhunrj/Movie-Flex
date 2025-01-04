import axios, { Axios } from 'axios';
import  axiosUrl  from '../../utils/axios/baseUrl';
import { adminAuthenticate } from '../../utils/axios/adminInterceptor';
import { MovieType } from '@/types/movieTypes';
const API_BASE_URL = 'https://api.movie-flex.site';


// export const registerUser = async (name, email, mobile, password) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/register`, { name, email, mobile, password });

//         localStorage.setItem("otpToken", response.data);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const loginUser = async (email:string, password:string) => {
    try {
        console.log(email,password,"login enter")
        const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password },{withCredentials:true});
        localStorage.setItem('admin', JSON.stringify(response.data.adminLog));
        localStorage.setItem('adminAccessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        console.log(response,"response from backend");
        return response.data;
    } catch (error:any) {
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
//         const response = await axios.post(`${API_BASE_URL}/auth/google`, { token });
//         console.log(response);
        
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const forgotPassword = async (email:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// export const resetPassword = async (newPassword) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/reset-password`, { newPassword });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

// export const verifyUser = async (otp) => {
//     try {
//         const token = localStorage.getItem("otpToken");
//         const response = await axios.post(`${API_BASE_URL}/verify-user`, { token, otp });
        
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

// export const verifyNewPassword = async (otp) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.post(`${API_BASE_URL}/verify-otp`, { token, otp });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const homePage=async ()=>{
    try{
        const userToken=localStorage.getItem('accessToken')
        const response=await axios.get(`${API_BASE_URL}/home`,{})
            // headers={
            //     'Authorization':`Bearer${userToken}`
            // }
            return response.data
       // })
    }
    catch(error)
    {
        throw error;

    }
}

export const fetchUserData=async ()=>{
    try{
        console.log("before load users data");
        
        const response = await adminAuthenticate.get(`/users`,{});
        console.log(response.data,"response in userdata");
        localStorage.setItem('userdata', JSON.stringify(response.data.userData));

        return response.data; 
    }
    catch(error)
    {
        throw error;

    }
}


export const fetchTheatresData=async ()=>{
    try{
        console.log("beforesend api");
        const response = await adminAuthenticate.get(`/theatre`,{});
        console.log(response.data,"response in theatredata");
        localStorage.setItem('theatredata', JSON.stringify(response.data.theatreData));

        return response.data; 
    }
    catch(error)
    {
        throw error;

    }
}

export const blockUserActive = async (userId:string) => {
    try {
      console.log("block user in service");
      const response = await adminAuthenticate.patch(`/block-user/${userId}`, {});
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const unblockUserActive = async (userId:string) => {
    try {
      console.log("unblock user in service");
      const response = await adminAuthenticate.patch(`/unblock-user/${userId}`, {});
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
export const blockTheatreActive = async (theatreId:string) => {
    try {
      console.log("block theatre in service");
      const response = await adminAuthenticate.patch(`/block-theatre/${theatreId}`, {});
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const unblockTheatreActive = async (theatreId:string) => {
    try {
      console.log("unblock theatre in service");
      const response = await adminAuthenticate.patch(`/unblock-theatre/${theatreId}`, {});
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const approveTheatreAction = async (theatreId:string) => {
    try {
      const response = await adminAuthenticate.patch(`/approve-theatre/${theatreId}`);
      console.log(response.data);
      return response.data;
    } catch (error:any) {
      console.error("Error approving theatre:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || "Failed to approve theatre. Please try again later.";
      
      return Promise.reject(new Error(errorMessage));
    }
  };
  
  export const declineTheatreAction = async (theatreId:string) => {
    try {
      const response = await adminAuthenticate.patch(`/decline-theatre/${theatreId}`);
      console.log(response.data);
      return response.data;
    } catch (error:any) {
      console.error("Error declining theatre:", error.response?.data || error.message);
  
      const errorMessage = error.response?.data?.message || "Failed to decline theatre. Please try again later.";
      
      return Promise.reject(new Error(errorMessage));
    }
  };

  export const AddMovies=async(movieData:MovieType)=>{
    try {
      console.log(movieData,"movie details before storing");
      
       const response=await adminAuthenticate.post('/Add-movies',{movieData})
       return response.data
    } catch (error:any) {
      console.error("Error during addmovies", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||error.response?.data?.error|| "Login failed!";
        return Promise.reject(new Error(errorMessage));
    }
  }

  export const fetchMovieData=async()=>{
    try{
      console.log("in before fetch data");
      
     const response=await adminAuthenticate.get('/fetch-movies')
     console.log(response.data.movieData,"response data");
     
     localStorage.setItem('movieData',response.data.movieData)
     return response.data
    }
    catch(error:any)
    {
      console.error("Error during fetching movies", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||error.response?.data?.error|| "Login failed!";
        return Promise.reject(new Error(errorMessage));
    }
  }

  export const blockMovieData=async({movieId,isBlocked}:{movieId:string,isBlocked:boolean})=>{
    try{
      console.log({movieId,isBlocked},"log for block");
      
     const response=await adminAuthenticate.patch(`/block-movie`,{movieId,isBlocked})
     return response.data
    }
    catch(error:any)
    {
      console.error("Error during fetching movies", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||error.response?.data?.error|| "Login failed!";
        return Promise.reject(new Error(errorMessage));
    }
  }

  export const deleteMovieData=async(movieid:string)=>{
    try{
     const response=await adminAuthenticate.patch(`/delete-movie/${movieid}`)
     return response.data
    }
    catch(error:any)
    {
      console.error("Error during fetching movies", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||error.response?.data?.error|| "Login failed!";
        return Promise.reject(new Error(errorMessage));
    }
  }


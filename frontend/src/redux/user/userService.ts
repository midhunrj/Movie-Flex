import axios, { Axios } from 'axios';
import  axiosUrl  from '../../utils/axios/baseUrl';
import { userAuthenticate } from '../../utils/axios/userInterceptor';
import { FavouritePayload, ratingPayload } from './userThunk';

const API_BASE_URL = "http://localhost:";


export const registerUser = async (name:string, email:string, mobile:string, password:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, mobile, password });

        localStorage.setItem("otpToken", response.data);
        return response.data;
    } catch (error) {
        console.log(error,"error in service");
        throw error
        // if (error.response && error.response.data && error.response.data.message) {
        //     throw new Error(error.response.data.message);
        // } else {
        //     throw new Error(error.response.data.error || "Something went wrong");
        // }
    }
    
};

export const loginUser = async (email:string, password:string) => {
    try {
        console.log(email,password,"login enter")
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password },{withCredentials:true});
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('wallet',response.data.wallet.balance)
        console.log(response,"response from backend");
        return response.data;
    } catch (error:any) {
        console.log(error, "axios error"); 
         //return error.response.data
      throw error
    // if (error.response && error.response.data && error.response.data.error) {
    //     console.log(error);
        
    //   throw new Error(error.response.data.error); 
    // } else {
    //   throw new Error(error.response.data.message); 
    // }
    }
};

// export const Logout=async()=>{
//     try {
//         localStorage.removeItem('user') 

//     } catch (error) {
//         throw error;
//     }
// }

export const googleLoginUser = async (token:string) => {
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

export const forgotPassword = async (email:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        console.log(response,"response in frontend");
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (newPassword:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, { newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyUser = async (otp:string) => {
    try {
        const token = localStorage.getItem("otpToken");
        const response = await axios.post(`${API_BASE_URL}/verify-user`, { token, otp });
        
        return response.data;
    } catch (error) {
        console.log(error,"error")
        
        throw error
        // if (error.response && error.response.data && error.response.data.message) {
        //     throw new Error(error.response.data.message); 
        // } else {
        //     throw new Error(error.response.data.error); 
        // }
    }
    
}

export const verifyNewPassword = async (otp:string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/verify-otp`, { token, otp });
        return response.data;
    } catch (error) {
        //handleAxiosError(error)
        throw error
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

export const getUpcomingMovies=async(params:{page?:number,language?:string,genre?:string,searchQuery?:string,sortBy?:string})=>{
    try{
        const response=await userAuthenticate.get('/fetchUpcomingMovies',{params})
        localStorage.setItem("upcomingMovies", response.data);
        return response.data
    }
    catch(error)
    {
        console.log(error,"error in service");
        throw error
        
   }
}


export const getNowShowingMovies=async(params:{page?:number,language?:string,genre?:string,searchQuery?:string,sortBy?:string})=>{
    try{
        const response=await userAuthenticate.get('/fetchNowShowingMovies',{params})
        localStorage.setItem("nowShowingMovies", JSON.stringify(response.data.runningMovies));
        console.log(response.data,"console in now showing movies in return from backend");
        console.log(response.data.runningMovies,"runningMovies these are the ");
        
        return response.data
    }
    catch(error)
    {
        console.log(error,"error in service");
        
       throw error
    
    }
}

export const fetchTheatreData = async (latitude: number | null, longitude: number | null) => {
    try{
        const response = await userAuthenticate.get("/theatres", {
      params: { latitude, longitude },
    });
    return response.data;
}
catch(error)
    {
        console.log(error,"error in service");
        
       throw error
  };
}
export const movieInWishList = async ({userId,movieId}:FavouritePayload) => {
    try{
        const response = await userAuthenticate.put("/add-favourite", {userId,movieId});
    return response.data;
}
catch(error)
    {
        console.log(error,"error in service");
        
       throw error
  };
}

export const removeMovieFromWishlist = async ({userId,movieId}:FavouritePayload) => {
    try{
        const response = await userAuthenticate.put('/remove-favourite', {
            userId,movieId
    });
    return response.data;
}
catch(error)
    {
        console.log(error,"error in service");
        
       throw error
  };
}

export const favouritesUserMovies = async (userId: string) => {
    try{
        const response = await userAuthenticate.get("/favourites", {
      params: { userId },
    });
    return response.data;
}
catch(error)
    {
        console.log(error,"error in service");
        
       throw error
  };
}

export const newMovieRating = async ({userId,movieId,rating}:ratingPayload) => {
    try{
       const response = await userAuthenticate.put('/add-rating', {movieId,rating},{params:{userId:userId}}
    );
    return response.data;
}
catch(error)
    {
        console.log(error,"error in service");
        
       throw error
  };
}
// const handleAxiosError = (error) => {
//     if (error.response && error.response.data) {
//         if (error.response.data.error) {
//             throw new Error(error.response.data.error);
//         } else if (error.response.data.message) {
//             throw new Error(error.response.data.message);
//         }
//     }
//     throw new Error('Something went wrong. Please try again later.');
// };

import axios from 'axios';
import axiosUrl from '../../utils/axios/baseUrl';
import { theatreAuthenticate } from '../../utils/axios/theatreInterceptor';
import { ScreenDatas, Tier } from '@/types/theatreTypes';
import { MovieType } from '@/types/movieTypes';

const API_BASE_URL = "http://localhost:7486";

interface RegisterUserParams {
  name: string;
  email: string;
  mobile: string;
  password: string;
  file: File;
}

interface LoginUserParams {
  email: string;
  password: string;
}

interface OTPParams {
  otp: string;
}

interface ResetPasswordParams {
  newPassword: string;
}

interface ResendOtpParams {
  token: string;
}

interface MovieParams {
  movie: MovieType;
  screenId: string;
}

// interface ScreenData {
//   screenData: any; // Adjust type based on your screen data
// }

interface TierDataParams {
  tierData: Tier; // Adjust type based on your tier data
  screenId: string;
}

interface ShowData {
  showtimeData: any; // Adjust type based on your show data
}

export const registerUser = async ({ name, email, mobile, password, file }: RegisterUserParams) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('password', password);
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/theatre/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    localStorage.setItem("otpThetToken", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
  
};

export const loginUser = async ({ email, password }: LoginUserParams) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/theatre/login`, { email, password }, { withCredentials: true });
    localStorage.setItem('theatre', JSON.stringify(response.data.theatre));
    localStorage.setItem('theatreAccessToken', response.data.accessToken);
    localStorage.setItem('role', response.data.role);
    return response.data;
  } catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/theatre/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (newPassword :string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/theatre/reset-password`, { newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async ( otp : string) => {
  try {
    const token = localStorage.getItem("otpThetToken");
    const response = await axios.post(`${API_BASE_URL}/theatre/verify-theatre`, { token, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyNewPassword = async (otp : string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/theatre/verify-otp`, { token, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const homePage = async () => {
  try {
    const userToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/theatre/home`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtpAgain = async () => {
  try {
    const token = localStorage.getItem('otpThetToken');
    const response = await axios.post(`${API_BASE_URL}/theatre/resend-otp`, { token });
    localStorage.setItem('otpThetToken', response.data.theatre);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMoviesViaTheatre = async ({ movie, screenId }: MovieParams) => {
  try {
    const response = await theatreAuthenticate.post("/add-movies-screen", { movie, screenId });
    return response.data;
  } catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const completeTheatreProfileData = async (addressData: any) => {
  try {
    const response = await theatreAuthenticate.post("/completeProfile", { addressData });
    return response.data;
  } catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const addScreenData = async (screenData: any) => {
  try {
    const response = await theatreAuthenticate.post("/AddScreen", { screenData });
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const ScreensListData = async (theatreId: string) => {
  try {
    const response = await theatreAuthenticate.get('/showscreens', {
      params: { theatreId }
    });
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const StoreTierData = async ({ tierData, screenId }: TierDataParams) => {
  try {
    const response = await theatreAuthenticate.post('/update-tier', { tierData, screenId });
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const RollingMoviesData = async () => {
  try {
    const response = await theatreAuthenticate.get('/RollingMovies');
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateScreenData = async (screenData: ScreenDatas) => {
  try {
    console.log(screenData,"in service update")
    
    const response = await theatreAuthenticate.put('/update-screen', { screenData });
    console.log(response,"response")
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export const moviesRollinShowtime = async (showtimeData : any) => {
  try {
    console.log(showtimeData,"showdata in service");
    
    const response = await theatreAuthenticate.post('/shows-rollin-movies', { showtimeData });
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export const removeShow = async (screenId:string,showtimeId:string) => {
  try {
    
    
    const response = await theatreAuthenticate.delete('/remove-shows', {
      params: {
        screenId,
        showtimeId,
      },});
    return response.data;
  }catch (error: unknown) {
    console.error("Error in service", error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

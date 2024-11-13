import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  googleLoginUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyNewPassword,
  resendOtpAgain,
  getUpcomingMovies,
  getNowShowingMovies
} from './userService';

// Define types for user payloads
interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, mobile, password }: RegisterPayload, thunkAPI) => {
    try {
      return await registerUser(name, email, mobile, password);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      return await loginUser(email, password);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (token: string, thunkAPI) => {
    try {
      return await googleLoginUser(token);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const forgotPass = createAsyncThunk(
  'user/forgotPass',
  async (email: string, thunkAPI) => {
    try {
      return await forgotPassword(email);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const resetPass = createAsyncThunk(
  'user/resetPass',
  async (newPassword: string, thunkAPI) => {
    try {
      return await resetPassword(newPassword);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const userVerify = createAsyncThunk< { message: string }, // Type for resolved value
string,              // Type for input parameter (OTP)
{ rejectValue: { message: string } } // Type for rejected value
>(
  'user/userVerify',
  async (otp: string, thunkAPI) => {
    try {
      return await verifyUser(otp);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'user/resendOtp',
  async (_, thunkAPI) => {
    try {
      return await resendOtpAgain();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
export const newPassVerify = createAsyncThunk(
  'user/newPassVerify',
  async (otp:string, thunkAPI) => {
    try {
      return await verifyNewPassword(otp);
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
)
export const fetchMovies = createAsyncThunk<
  { upcomingMovies: { upcomingMovies: any[] }; nowShowingMovies: { runningMovies: any[] }; message?: string },
   { page?: number; language?: string; genre?: string; searchQuery?: string }|void,
  { rejectValue: string }
>('user/loadMovies', async (params={}, thunkAPI) => {
  try {
    // const { page = 1, language = '', genre = '', searchQuery = '' } = params;
    const upcomingMovies = await getUpcomingMovies();
    const nowShowingMovies = await getNowShowingMovies();
    return { 
      upcomingMovies,
      nowShowingMovies
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Fetching movies failed');
  }
});

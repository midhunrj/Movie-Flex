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
  getNowShowingMovies,
  fetchTheatreData,
  removeMovieFromWishlist,
  movieInWishList,
  favouritesUserMovies,
  newMovieRating
} from './userService';
import { MovieType } from '@/types/movieTypes';

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
export interface FavouritePayload{
  userId:string,
  movieId:string
}
export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, mobile, password }: RegisterPayload, thunkAPI) => {
    try {
      console.log(name,email);
      
      return await registerUser(name, email, mobile, password);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message ||error.message ||"something went wrong in server");
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      return await loginUser(email, password);
    } catch (error: any) {
      console.log(error,"error in thunk");
      
      return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (token: string, thunkAPI) => {
    try {
      return await googleLoginUser(token);
    } catch (error: any) {
      console.log(error,"error in thunk return");
      
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
  { upcomingMovies: { upcomingMovies: any[],totalMovies:number }; nowShowingMovies: { runningMovies: any[],totalMovies:number }; message?: string  },
   { page?: number; language?: string; genre?: string; searchQuery?: string ,sortBy?:string}|void,
  { rejectValue: string }
>('user/loadMovies', async (params, thunkAPI) => {
  try {
    // const { page = 1, language = '', genre = '', searchQuery = '' } = params;
    const { page, language , genre , searchQuery, sortBy } = params || {}
    const upcomingMovies = await getUpcomingMovies({page,language,genre,searchQuery,sortBy});
    const nowShowingMovies = await getNowShowingMovies({page,language,genre,searchQuery,sortBy});
    return { 
      upcomingMovies,
      nowShowingMovies
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Fetching movies failed');
  }
});


export const fetchTheatres = createAsyncThunk(
  "user/fetchTheatres",
  async ({ latitude, longitude }: { latitude: number | null; longitude: number | null }, { rejectWithValue }) => {
    try {
      const theatres = await fetchTheatreData(latitude, longitude);
      return theatres;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToFavourites = createAsyncThunk(
  'user/addMovieToFavourites',
  async ({userId,movieId}:FavouritePayload, thunkAPI) => {
    try {
      return await movieInWishList({userId,movieId});
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
)

export const deleteFromFavourites = createAsyncThunk(
  'user/deleteMovieFromFavourites',
  async ({userId,movieId}:FavouritePayload, thunkAPI) => {
    try {
      return await removeMovieFromWishlist({userId,movieId});
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
)

export const getFavouritesMovieByUser = createAsyncThunk(
  'user/getFavourites',
  async (userId:string, thunkAPI) => {
    try {
      return await favouritesUserMovies(userId);
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
)

 export interface ratingPayload{
  rating:number,
  movieId:string,
  userId:string
}
export const postRating = createAsyncThunk<
  { movieData:MovieType; message?: string  },
   ratingPayload,
  { rejectValue: string }
>('user/ratingMovies', async ({userId,movieId,rating}:ratingPayload, thunkAPI) => {
  try {
    // const { page = 1, language = '', genre = '', searchQuery = '' } = params;
     return await newMovieRating({movieId,userId,rating})
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Fetching movies failed');
  }
});


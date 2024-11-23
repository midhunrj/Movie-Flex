import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyNewPassword,
  resendOtpAgain,
  addMoviesViaTheatre,
  completeTheatreProfileData,
  addScreenData,
  ScreensListData,
  StoreTierData,
  RollingMoviesData,
  updateScreenData,
  moviesRollinShowtime,
  removeShow
} from './theatreService';

// Types for input and output data
interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  file: File;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPassPayload {
  email: string;
}
interface ForgotPassResponse {
  message: string;
}
interface ResetPassPayload {
  newPassword: string;
}

interface OtpPayload {
  otp: string;
}

// interface ScreenData {
//   screenName: string;
//   capacity: number;
//   theatreId: string;
// }
import { ScreenDatas, Tier } from '@/types/theatreTypes';
import { MovieType } from '@/types/movieTypes';

interface MoviesPayload {
  movie: MovieType;
  screenId: string;
}

export const register = createAsyncThunk(
  'theatre/register',
  async ({ name, email, mobile, password, file }: RegisterPayload, thunkAPI) => {
    try {
      console.log(name, email, "in service");
      return await registerUser({name, email, mobile, password, file});
    } catch (error: any) {
      console.log(error, "error in thunk");
      return thunkAPI.rejectWithValue(error.message as string || "something went wrong");
    }
  }
);

export const login = createAsyncThunk<any, LoginPayload, { rejectValue: string }>(
  'theatre/login',
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      console.log(email, password, "in thunk login");
      return await loginUser({email, password});
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
  }
);

export const forgotPass = createAsyncThunk<ForgotPassResponse, // Return type
string, // First argument (email)
{ rejectValue: string } >(
  'theatre/forgotPass',
  async (email : string, thunkAPI) => {
    try {
      return await forgotPassword(email);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message|| "something went wrong");
    }
  }
);

export const resetPass = createAsyncThunk(
  'theatre/resetPass',
  async (newPassword : string, thunkAPI) => {
    try {
      return await resetPassword(newPassword);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message as string|| "something went wrong");
    }
  }
);

export const theatreVerify = createAsyncThunk<
{ message: string }, // This is the expected successful response type
string,              // This is the type of the argument passed (the otp)
{ rejectValue: string }>(
  'theatre/userVerify',
  async ( otp :string, thunkAPI) => {
    try {
      return await verifyUser(otp);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message as string || "something went wrong");
    }
  }
)

export const newPassVerify = createAsyncThunk(
  'theatre/newPassVerify',
  async ( otp :string, thunkAPI) => {
    try {
      return await verifyNewPassword(otp);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message as string || "something went wrong");
    }
  }
);

export const resendOtp = createAsyncThunk(
  'theatre/resendotp',
  async (_,thunkAPI) => {
    try {
      return await resendOtpAgain();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
  }
);

export const addMoviesToScreen = createAsyncThunk< any,MoviesPayload,{ rejectValue: { message: string } }>(
  'theatre/addMovies',
  async ({ movie, screenId }: MoviesPayload, thunkAPI) => {
    try {
      return await addMoviesViaTheatre({ movie, screenId });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "adding movies have been failed");
    }
  }
);

export const CompleteTheatreProfile = createAsyncThunk(
  'theatre/completeProfile',
  async (addressData: any, thunkAPI) => {
    try {
      return await completeTheatreProfileData(addressData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "adding movies have been failed");
    }
  }
);

export const AddScreen = createAsyncThunk(
  'theatre/AddingScreen',
  async (screenData: ScreenDatas, thunkAPI) => {
    try {
      console.log(screenData, "screen data in thunk");
      return await addScreenData(screenData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "adding screen data has failed");
    }
  }
);

export const listScreen = createAsyncThunk<any,string,{ rejectValue: { message: string } }>
 ( 'theatre/listingScreen',
  async (theatreId: string, thunkAPI) => {
    try {
      console.log(theatreId, "theatreId in thunk");
      return await ScreensListData(theatreId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "listing screens to the movie have failed");
    }
  }
);

export const saveTierData = createAsyncThunk<{ screenData: ScreenDatas; message: string },
{ tierData: Tier; screenId: string }, { rejectValue: string }>(
  'theatre/savingTierData',
  async ({ tierData, screenId }, thunkAPI) => {
    try {
      return await StoreTierData({ tierData, screenId });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "saving tier data to the screen has failed");
    }
  }
);

export const fetchMovies = createAsyncThunk<any,void,{ rejectValue: { message: string } } >(
  'theatre/RollingMovies',
  async (_,thunkAPI) => {
    try {
      return await RollingMoviesData();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "fetching movies to the screen has failed");
    }
  }
);

export const updateScreen = createAsyncThunk<{screenData:ScreenDatas,message:string},ScreenDatas,{ rejectValue: string }>(
  'theatre/updateScreen',
  async (screenData: ScreenDatas, thunkAPI) => {
    try {
      return await updateScreenData(screenData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "updating screen data has failed");
    }
  }
);

export const saveMoviesToShowtime = createAsyncThunk<any, // Adjust the return type if needed
any, // Type of the argument (adjust as necessary)
{ rejectValue: string } // Type of the value used with rejectWithValue
>(
  'theatre/moviesToShowtime',
  async (showtimeData: any, thunkAPI) => {
    try {
      console.log(showtimeData,"showdata in thunk");
      
      return await moviesRollinShowtime(showtimeData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "adding movie to showtime has failed");
    }
  }
);

export const removeShowtime = createAsyncThunk <{ message: string; screenData: any }, // Type of the resolved value (success case)
{ screenId: string; showtimeId: string }, // Type of the argument passed to the thunk
{ rejectValue: string } >(
  'screen/removeShowtime',
  async ({ screenId, showtimeId }: { screenId: string; showtimeId: string }, { rejectWithValue }) => {
    try {
      return await removeShow(screenId, showtimeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to remove showtime');
    }
  }
);
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  googleLoginUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyNewPassword,
  Logout,
  resendOtpAgain,
  getUpcomingMovies,
  getNowShowingMovies
} from './userService';
import { setNowShowingMovies, setUpcomingMovies } from './userSlice';
import { useDispatch } from 'react-redux';

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, mobile, password }, thunkAPI) => {
    try {
      return await registerUser(name, email, mobile, password);
    } catch (error) {
      console.log(error, "error in thunk");
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    try {
        console.log(email,password,"in thunk login");
      return await loginUser(email, password);
    } catch (error) {
      console.log("error in thunk", error);
      
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
);
// export const logout=createAsyncThunk(
//     'user/logout',
//     async(_,thunkAPI)=>{
//     try
//     {
//       await Logout()
//       return 
//     }
//     catch (error) {
//         return thunkAPI.rejectWithValue(error.message|"something went wrong");
//       }
//     }
// )

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (token, thunkAPI) => {
    try {

      return await googleLoginUser(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const forgotPass = createAsyncThunk(
  'user/forgotPass',
  async (email, thunkAPI) => {
    try {
      return await forgotPassword(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const resetPass = createAsyncThunk(
  'user/resetPass',
  async (newPassword, thunkAPI) => {
    try {
      return await resetPassword(newPassword);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const userVerify = createAsyncThunk(
  'user/userVerify',
  async (otp, thunkAPI) => {
    try {
      return await verifyUser(otp);
    } catch (error) {
      console.log(error,"error in thunk");
      
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const newPassVerify = createAsyncThunk(
  'user/newPassVerify',
  async (otp, thunkAPI) => {
    try {
      return await verifyNewPassword(otp);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
)

  export const resendOtp = createAsyncThunk(
    'user/resendotp',
    async (otp, thunkAPI) => {
      try {
        return await resendOtpAgain();
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message|"something went wrong");
      }
    }
);

// export const refreshPage = createAsyncThunk(
//   'user/re',
//   async (otp, thunkAPI) => {
//     try {
//       return await resendOtpAgain();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message|"something went wrong");
//     }
//   }
// );

export const fetchMovies=createAsyncThunk('user/loadMovies', async(_,thunkAPI)=>{
  try {
    const upcomingMovies = await getUpcomingMovies();
    //const dispatch=useDispatch()
   // dispatch(setUpcomingMovies(upcomingMovies)) 

   
    const nowShowingMovies = await getNowShowingMovies();
    //dispatch(setNowShowingMovies(nowShowingMovies))
    return {upcomingMovies,nowShowingMovies}
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message||"fetching movies has been failed");
     
  }
})

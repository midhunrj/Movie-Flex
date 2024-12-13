import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
 //googleLogin,
  forgotPass,
  resetPass,
  theatreVerify,
  newPassVerify,
  //logout,
  resendOtp,
  addMoviesToScreen,
  CompleteTheatreProfile,
  AddScreen,
  listScreen,
  fetchMovies,
  saveTierData,
  updateScreen,
  saveMoviesToShowtime,
  removeShowtime
  
} from './theatreThunk';
import { toast } from 'react-toastify';
import { RollingMoviesData } from './theatreService';
import { ScreenDatas, TheatreType } from '@/types/theatreTypes';
//import { log } from 'util';
// interface Theatre {
//   _id: string;
//   address?: { place?: string };
//   [key: string]: any;
// }

// interface Screen {
//   _id: string;
//   enrolledMovies: any[];
// }

interface Movie {
  _id: string;
  title: string;
  [key: string]: any;
}

// Define the shape of your Redux state
interface TheatreState {
  theatre: TheatreType | null;
  token: string | null;
  role:string
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  otpToken: string | null;
  isProfileComplete: boolean;
  screens: ScreenDatas[]|[];
  movies: Movie[]|[];
}

// Load initial state from localStorage
const user: TheatreType | null = JSON.parse(localStorage.getItem('theatre') || 'null');
const theatreAccessToken: string | null = localStorage.getItem('theatreAccessToken');

const initialState: TheatreState = {
  theatre: user ?? null,
  token: theatreAccessToken ?? null,
  isError: false,
  isSuccess: false,
  role:"theatre",
  isLoading: false,
  message: '',
  otpToken: null,
  isProfileComplete: user?.address?.place ? true : false,
  screens: [],
  movies: []
};

const theatreSlice = createSlice({
  name: 'theatre',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('theatre')
      localStorage.removeItem('theatreAccessToken')
      localStorage.removeItem('role')
      console.log("inside slice reducer logouy");
      state.theatre = null;
      state.token=null
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.isProfileComplete=false
      if(!localStorage.getItem('theatre'))
      {
        console.log("in slice confirming localstorage deleted");
      //return true
      }
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.theatre =null
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        console.log("in pending");
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action:PayloadAction<TheatreType>) => {
        console.log("in fulfilled",action);
        state.isLoading = false;
        state.isSuccess = true;
        state.theatre = action.payload
      })
      .addCase(register.rejected, (state, action:PayloadAction<unknown>) => {
        console.log(action,"action in rejected");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        const errorMessage = typeof action.payload === 'string' 
    ? action.payload 
    : (action.payload as { message: string }).message ?? "An error occurred";

  state.message = errorMessage;
        state.message = errorMessage;
      })
      .addCase(login.pending, (state) => {
        console.log("inside login pending");
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ theatre: TheatreType; accessToken: string; message: string }>) => {
        console.log("in extrareducer slice login getting fulfilled papara papara papara pa !!!",initialState,"all states");
        state.isLoading = false;
        state.isSuccess = true;
        state.theatre = action.payload.theatre
        state.token=action.payload.accessToken
        state.message=action.payload.message
      })
      .addCase(login.rejected, (state, action:PayloadAction<string|undefined>) => {
        console.log("in extrareduce slice login getting rejected");
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action?.payload || "An error occurred";
      })
      // .addCase(googleLogin.pending, (state) => {
      //   state.isLoading = true;
      //   state.isSuccess = false;
      //   state.isError = false;
      //   state.message = '';
      // })
      // .addCase(googleLogin.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.user = action.payload;
      // })
      // .addCase(googleLogin.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = false;
      //   state.isError = true;
      //   state.message = action.payload;
      // })
      .addCase(forgotPass.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; 
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?action.payload:"an error occured";
      })
      .addCase(resetPass.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(resetPass.fulfilled, (state, action:PayloadAction<{ message: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload  as string;
      })
      .addCase(theatreVerify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(theatreVerify.fulfilled, (state, action:PayloadAction<{ message: string }>) => {
        console.log("in fulfilled",action);
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        localStorage.removeItem('otpThetToken')
      })
      .addCase(theatreVerify.rejected, (state, action:PayloadAction<string|undefined>) => {
        console.log(action.payload,"payload");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload||"an error occured";
      })
      .addCase(newPassVerify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(newPassVerify.fulfilled, (state, action:PayloadAction<{ message: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(newPassVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(resendOtp.fulfilled, (state, action:PayloadAction<{ message: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string
      })
     
      .addCase(CompleteTheatreProfile.pending, (state) => {
        console.log("pending in completeProfile");
         
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(CompleteTheatreProfile.fulfilled, (state, action) => {
        console.log("fulfilled in complete profile",action.payload.updatedProfile);
        console.log("state in theatre",state.theatre)
        state.theatre=action.payload.updatedProfile
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        state.isProfileComplete=true
        localStorage.setItem('theatre', JSON.stringify(action.payload.updatedProfile));
         toast.success(state.message)
      })
      .addCase(CompleteTheatreProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(AddScreen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(AddScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        
      })
      .addCase(AddScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(listScreen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(listScreen.fulfilled, (state, action: PayloadAction<{ screenData: ScreenDatas[]; message: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        state.screens=action.payload.screenData
        
      })
      .addCase(listScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message || "en error occured";
      })
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<{ movieData: Movie[]; message: string }>) => {
        console.log(action,"Action datas");
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        //state.screens=action.payload.screenData
        state.movies=action.payload.movieData
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message||"an error occured";
      })
      .addCase(addMoviesToScreen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(addMoviesToScreen.fulfilled, (state, action: PayloadAction<{ screenData: ScreenDatas; message: string }>) => {
        console.log(action,"Action datas");
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        //state.screens=action.payload.screenData
        state.screens = state.screens.map(screen => 
          screen._id === action.payload.screenData._id ? action.payload.screenData : screen
        );
      
        //console.log(state.screens.find(screen => screen._id === action.payload.screenData._id).enrolledMovies, "enrolledMovies after update");
      
        toast.success(state.message)
      })
      .addCase(addMoviesToScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.message||"an error occured";
        toast.error(state.message)
      })
      .addCase(saveTierData.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(saveTierData.fulfilled, (state, action: PayloadAction<{ screenData: ScreenDatas; message: string }>) => {
        console.log(action,"Action datas");
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        //state.screens=action.payload.screenData
        state.screens = state.screens.map(screen => 
          screen._id === action.payload.screenData._id ? action.payload.screenData : screen
        );
      
        toast.success(state.message)
      })
      .addCase(saveTierData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ||"an error occured";
        toast.error(state.message)
      })
      .addCase(updateScreen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateScreen.fulfilled, (state, action: PayloadAction<{ screenData: ScreenDatas; message: string }>) => {
        console.log(action,"Action datas");
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message ||"an success";
        //state.screens=action.payload.screenData
        state.screens = state.screens.map(screen => 
          screen._id === action.payload.screenData._id ? action.payload.screenData : screen
        );
      
        toast.success(state.message)
      })
      .addCase(updateScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload||"an error occured";
        toast.error(state.message)
      })
      .addCase(saveMoviesToShowtime.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(saveMoviesToShowtime.fulfilled, (state, action) => {
        console.log(action,"Action datas");
        
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message||"an error occured";
        
        const updatedScreenData=action.payload.screenData;
      state.screens=state.screens.map((screen)=>(
       screen._id==updatedScreenData._id?updatedScreenData:screen
      ))
        toast.success(state.message)
      })
      .addCase(saveMoviesToShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload||"an error occured";
        toast.error(state.message)
      })
      .addCase(removeShowtime.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(removeShowtime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Showtime removed successfully';

        const updatedScreen = action.payload.screenData;

        // Update the screens state with the updated screen data
        state.screens = state.screens.map((screen) =>
          screen._id === updatedScreen._id ? updatedScreen : screen
        );

        toast.success(state.message);
      })
      .addCase(removeShowtime.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
        toast.error(state.message);
      });
  },
});

export const { logout, clearState } = theatreSlice.actions;
export default theatreSlice.reducer;

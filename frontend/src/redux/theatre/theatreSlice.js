import { createSlice } from '@reduxjs/toolkit';
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
  CompleteTheatreProfile
} from './theatreThunk';
import { toast } from 'react-toastify';
//import { log } from 'util';


// let user = null;

// try {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//         user = JSON.parse(storedUser);
//     }
// } catch (error) {
//     console.error("Error parsing JSON from localStorage", error);
//     user = null; // Fallback to null if parsing fails
// }

const user=JSON.parse(localStorage.getItem('theatre'))
console.log(user,"theatre details");

const theatreAccessToken=localStorage.getItem('theatreAccessToken')
const initialState = {
    theatre:user?user:null,
    token:theatreAccessToken?theatreAccessToken:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:'',
    otpToken:null,
    isProfileComplete:user?.address?.place?true:false
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
      .addCase(register.fulfilled, (state, action) => {
        console.log("in fulfilled",action);
        state.isLoading = false;
        state.isSuccess = true;
        state.theatre = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        console.log(action,"action in rejected");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        console.log("inside login pending");
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("in extrareducer slice login getting fulfilled papara papara papara pa !!!",initialState,"all states");
        state.isLoading = false;
        state.isSuccess = true;
        state.theatre = action.payload.theatre
        state.token=action.payload.accessToken
        state.message=action.payload.message
      })
      .addCase(login.rejected, (state, action) => {
        console.log("in extrareduce slice login getting rejected");
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
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
        state.message = action.payload;
      })
      .addCase(resetPass.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(theatreVerify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(theatreVerify.fulfilled, (state, action) => {
        console.log("in fulfilled",action);
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        localStorage.removeItem('otpThetToken')
      })
      .addCase(theatreVerify.rejected, (state, action) => {
        console.log(action.payload,"payload");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload?.error;
      })
      .addCase(newPassVerify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(newPassVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(newPassVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addMoviesToScreen.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(addMoviesToScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        
      })
      .addCase(addMoviesToScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
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
        state.message = action.payload;
      })
  },
});

export const { logout, clearState } = theatreSlice.actions;
export default theatreSlice.reducer;

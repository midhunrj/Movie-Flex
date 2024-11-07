import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  //googleLoginUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyNewPassword,
  Logout,
  resendOtpAgain,
  addMoviesViaTheatre,
  completeTheatreProfileData,
  addScreenData,
  ScreensListData,
  StoreTierData,
  RollingMoviesData,
  updateScreenData,
  moviesRollinShowtime
} from './theatreService';

export const register = createAsyncThunk(
  'theatre/register',
  async ({ name, email, mobile, password,file}, thunkAPI) => {
    try {
      console.log(name,email,"in service");
      return await registerUser(name, email, mobile, password,file);
    } catch (error) {
      console.log(error,"error in thunk");
      
       return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
);


export const login = createAsyncThunk(
  'theatre/login',
  async ({ email, password }, thunkAPI) => {
    try {
        console.log(email,password,"in thunk login");
      return await loginUser(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message||error.error||"something went wrong");
    }
  }
);
// export const logout=createAsyncThunk(
//     'theatre/logout',
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

// export const googleLogin = createAsyncThunk(
//   'theatre/googleLogin',
//   async (token, thunkAPI) => {
//     try {

//       return await googleLoginUser(token);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message|"something went wrong");
//     }
//   }
// );

export const forgotPass = createAsyncThunk(
  'theatre/forgotPass',
  async (email, thunkAPI) => {
    try {
      return await forgotPassword(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const resetPass = createAsyncThunk(
  'theatre/resetPass',
  async (newPassword, thunkAPI) => {
    try {
      return await resetPassword(newPassword);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const theatreVerify = createAsyncThunk(
  'theatre/userVerify',
  async (otp, thunkAPI) => {
    try {
      return await verifyUser(otp);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const newPassVerify = createAsyncThunk(
  'theatre/newPassVerify',
  async (otp, thunkAPI) => {
    try {
      return await verifyNewPassword(otp);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message|"something went wrong");
    }
  }
);

export const resendOtp = createAsyncThunk(
  'theatre/resendotp',
  async (otp, thunkAPI) => {
    try {
      return await resendOtpAgain();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message||"something went wrong");
    }
  }
)

export const addMoviesToScreen=createAsyncThunk('theatre/addMovies',
  async({movie,screenId},thunkAPI)=>{
    try{
      return await addMoviesViaTheatre({movie,screenId})

    }
    catch(error)
    {
      return thunkAPI.rejectWithValue(error.message||"adding movies have been failed")
    }

  })
  export const CompleteTheatreProfile=createAsyncThunk('theatre/completeProfile',
    async(addressData,thunkAPI)=>{
      try {
        // const coordinates = await getCoordinatesFromAddress(addressData);
        // const location = {
        //   type: 'Point',
        //   coordinates: [coordinates.lng, coordinates.lat]
        // };
        return await completeTheatreProfileData(addressData)
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message||"adding movies have been failed")
   
      }
    })

    export const AddScreen=createAsyncThunk('theatre/AddingScreen',
      async(screenData,thunkAPI)=>{
        try {
          console.log(screenData,"screen data in thunk");
          
          return await addScreenData(screenData)
        } catch (error) {
          return thunkAPI.rejectWithValue(error.message||"adding movies have been failed")
     
        }
      })

      export const listScreen=createAsyncThunk('theatre/listingScreen',
        async(theatreId,thunkAPI)=>{
          try{
            console.log(theatreId,"theatreId in thunk");
            
          return await ScreensListData(theatreId)
          }
          catch(error)
          {
            return thunkAPI.rejectWithValue(error.message||"listing screens to the movie have failed")
          }
        }
      )
        export const saveTierData=createAsyncThunk('theatre/savingTierData',
        async({tierData,screenId},thunkAPI)=>{
          try {
            return await StoreTierData({tierData,screenId})
          } catch (error) {
            return thunkAPI.rejectWithValue(error.message||"saving tier data to the screen has failed")
        
          }
        }
        )

        export const fetchMovies=createAsyncThunk('theatre/RollingMovies',
          async(thunkAPI)=>{
            try{
              return await RollingMoviesData()
            }
            catch(error){
              return thunkAPI.rejectWithValue(error.message||"fetching movies  to the screen has failed")
        
            }
          }
        )
          export const updateScreen=createAsyncThunk('theatre/updateScreen',
            async(screenData,thunkAPI)=>{
              try {
                return await updateScreenData(screenData)
              } catch (error) {
                return thunkAPI.rejectWithValue(error.message||"updating screen data has failed")
        
              }
            }
          )

          export const saveMoviesToShowtime=createAsyncThunk('theatre/moviesToShowtime',
            async(showData,thunkAPI)=>{
              try {
                return await moviesRollinShowtime(showData)
              } catch (error) {
                return thunkAPI.rejectWithValue(error.message||"adding movie to showtime has failed")
        
              }
            }
          )
        
      
  


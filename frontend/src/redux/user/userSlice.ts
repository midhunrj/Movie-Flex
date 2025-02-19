import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  googleLogin,
  forgotPass,
  resetPass,
  userVerify,
  newPassVerify,
  //resenOtp,
  resendOtp,
  fetchMovies,
  fetchTheatres,
  addToFavourites,
  deleteFromFavourites,
  getFavouritesMovieByUser,
  postRating,
  //logout
} from './userThunk';
import { MovieType } from '@/types/movieTypes';
import { Theatre } from '@/types/admintypes';
import { TheatreLocate } from '@/components/User/home';

interface User {
  _id?:string
  name?: string;
  email?: string;
  mobile?: string;
  is_verified?: boolean;
  is_blocked?:boolean
}
interface Coordinates{
  latitude?:number;
  longitude?:number;
}
interface UserState {
  user: User | null;
  token: string | null;
  isError: boolean;
  role:string,
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  wallet:number;
  nowShowingMovies: MovieType[]
  nowShowingMoviesCount:number|null
  upcomingMovies: MovieType[];
  upcomingMoviesCount:number|null
  userCoordinates?:Coordinates
  theatres:TheatreLocate[]
  userCurrentLocation?:string|null
}
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
const loginUser=(localStorage.getItem('user'))
const user:User|null=loginUser?JSON.parse(loginUser):null
console.log(user,"SLICEEEEEEEE");


const releasedMovies=localStorage.getItem('nowShowingMovies')
const walletData=localStorage.getItem('wallet')
const runningMovies:MovieType[]|null=releasedMovies?JSON.parse(releasedMovies):null
const accessToken=localStorage.getItem('accessToken')
const initialState:UserState = {
    user:user?user:null,
    token:accessToken?accessToken:null,
    role:"user",
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:'',
    nowShowingMovies:runningMovies?runningMovies:[],
    nowShowingMoviesCount:null,
    upcomingMovies:[],
    upcomingMoviesCount:null,
    userCoordinates:{},
    theatres:[],
    wallet:walletData?parseFloat(walletData):0,
    userCurrentLocation:null
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('role')
      console.log("inside slice reducer logouy");
      state.user = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      if(!localStorage.getItem('user'))
      {
        console.log("in slice confirming localstorage deleted");
      //return true
      }
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    setUpcomingMovies: (state, action: PayloadAction<{ upcomingMovieData: any[] }>) => {
      state.upcomingMovies = action.payload.upcomingMovieData;
    },
    setNowShowingMovies: (state, action: PayloadAction<{ runningMovies: any[] }>) => {
      state.nowShowingMovies = action.payload.runningMovies;
    },
    
    setUserCoordinates: (state, action: PayloadAction<Coordinates>) => {
      console.log(action,"action payload");
      
      state.userCoordinates = action.payload;
      console.log(state.userCoordinates,"state usercoordinates");
      
    },
    setUserLocation(state, action: PayloadAction<string>) {
      state.userCurrentLocation = action.payload;
    },
    updateWalletBalance(state,action:PayloadAction<number>)
    {
      console.log(action.payload,"action payload");
      
      state.wallet +=action.payload
      console.log("state wallet",state.wallet)
      
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        console.log(action,"action");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        console.log("inside login pending");
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("in extrareducer slice login getting fulfilled papara papara papara pa !!!",action);
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token=action.payload.accessToken
        state.wallet=action.payload.wallet.balance
        state.message=action.payload.message
      })
      .addCase(login.rejected, (state, action) => {
        console.log("in extrareduce slice login getting rejected,",action);
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        console.log(action,"payload action in googlelogin");
        
        state.isLoading = false;
        state.isSuccess = true;
        
        state.user = action.payload.user;
        state.token=action.payload.accessToken
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
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
        state.message = action.payload as string;
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
        state.message = action.payload as string;
      })
      .addCase(userVerify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(userVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.user.is_verified = true;
        state.message = action.payload.message;
        localStorage.removeItem('otpToken')
      })
      .addCase(userVerify.rejected, (state, action) => {
        console.log(action,"action in rejected");
        
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as { message: string }).message;;
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
        state.message = action.payload as string;
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
        state.message = action.payload as string;
      })
      .addCase(fetchMovies.pending,(state,action)=>{
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
        
      })
      .addCase(fetchMovies.fulfilled,(state,action)=>{
        console.log("action fufilled in fetchMovies",action);
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
        state.message=action.payload.message||"movie has been loaded"
        state.upcomingMovies=action.payload.upcomingMovies.upcomingMovies
        state.nowShowingMovies=action.payload.nowShowingMovies.runningMovies
        state.nowShowingMoviesCount=action.payload.nowShowingMovies.totalMovies
        state.upcomingMoviesCount=action.payload.upcomingMovies.totalMovies

      })
      .addCase(fetchMovies.rejected, (state, action:PayloadAction<string|undefined>) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "Failed to load movies";
      })
      .addCase(fetchTheatres.pending, (state) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
        
      })
      .addCase(fetchTheatres.fulfilled, (state, action) => {
        console.log(action.payload,"action thaeatre");
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
        state.theatres = action.payload.theatres;
      })
      .addCase(fetchTheatres.rejected, (state, action) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
      })
      .addCase(addToFavourites.pending, (state) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false; 
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
      
      })
      .addCase(addToFavourites.rejected, (state, action) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
      })
      .addCase(deleteFromFavourites.pending, (state) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
        
      })
      .addCase(deleteFromFavourites.fulfilled, (state, action) => {
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
        
      })
      .addCase(deleteFromFavourites.rejected, (state, action) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
      })
      .addCase(getFavouritesMovieByUser.pending, (state) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
        
      })
      .addCase(getFavouritesMovieByUser.fulfilled, (state, action) => {
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
        
      })
      .addCase(getFavouritesMovieByUser.rejected, (state, action) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
      })
      .addCase(postRating.pending, (state) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
        
      })
      .addCase(postRating.fulfilled, (state, action) => {
        console.log(action.payload,"payload data");
        
        state.isLoading=false;
        state.isSuccess=true;
        state.isError=false;
        const movieData=action.payload.movieData
        state.nowShowingMovies=state.nowShowingMovies.map((movie)=>movie._id==movieData._id?movieData:movie)
        state.message=action.payload.message!
      })
      .addCase(postRating.rejected, (state, action) => {
        state.isLoading=true;
        state.isSuccess=false;
        state.isError=false;
      });
  },
});

export const { logout, clearState,setUpcomingMovies,setNowShowingMovies,setUserCoordinates,setUserLocation,updateWalletBalance } = userSlice.actions;
export default userSlice.reducer;

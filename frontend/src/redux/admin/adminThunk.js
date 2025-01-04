import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, fetchUserData, fetchTheatresData, blockUserActive, unblockUserActive, blockTheatreActive, unblockTheatreActive, approveTheatreAction, declineTheatreAction, AddMovies, fetchMovieData, deleteMovieData, blockMovieData } from './adminService';
export const login = createAsyncThunk('admin/login', async ({ email, password }, thunkAPI) => {
    try {
        console.log(email, password, "in thunk login");
        return await loginUser(email, password);
    }
    catch (error) {
        console.log(error, "error in thunk");
        return thunkAPI.rejectWithValue(error.message || error.error || "something went wrong");
    }
});
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
// export const googleLogin = createAsyncThunk(
//   'user/googleLogin',
//   async (token:string, thunkAPI) => {
//     try {
//       return await googleLoginUser(token);
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.message||"something went wrong");
//     }
//   }
// );
// export const forgotPass = createAsyncThunk(
//   'user/forgotPass',
//   async (email, thunkAPI) => {
//     try {
//       return await forgotPassword(email);
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.message||"something went wrong");
//     }
//   }
// );
// export const resetPass = createAsyncThunk(
//   'user/resetPass',
//   async (newPassword, thunkAPI) => {
//     try {
//       return await resetPassword(newPassword);
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.message||"something went wrong");
//     }
//   }
// );
// export const userVerify = createAsyncThunk(
//   'user/userVerify',
//   async (otp, thunkAPI) => {
//     try {
//       return await verifyUser(otp);
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.message||"something went wrong");
//     }
//   }
// );
// export const newPassVerify = createAsyncThunk(
//   'user/newPassVerify',
//   async (otp, thunkAPI) => {
//     try {
//       return await verifyNewPassword(otp);
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.message||"something went wrong");
//     }
//   }
// );
export const fetchUsers = createAsyncThunk('admin/users', async (_, thunkAPI) => {
    try {
        console.log("kjhkj");
        return await fetchUserData();
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const fetchTheatres = createAsyncThunk('admin/theatres', async (_, thunkAPI) => {
    try {
        console.log("in admin thunk");
        return await fetchTheatresData();
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const blockUser = createAsyncThunk('admin/blockuser', async (userId, thunkAPI) => {
    try {
        console.log("in admin tunk block user");
        return await blockUserActive(userId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const unblockUser = createAsyncThunk('admin/unblockuser', async (userId, thunkAPI) => {
    try {
        console.log("in admin tunk unblock user");
        return await unblockUserActive(userId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const blockTheatre = createAsyncThunk('admin/blocktheatre', async (theatreId, thunkAPI) => {
    try {
        console.log("in admin tunk block theatre");
        return await blockTheatreActive(theatreId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const unblockTheatre = createAsyncThunk('admin/unblocktheatre', async (theatreId, thunkAPI) => {
    try {
        console.log("in admin tunk unblock theatre");
        return await unblockTheatreActive(theatreId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const approveTheatre = createAsyncThunk('admin/approveTheatre', async (theatreId, thunkAPI) => {
    try {
        return await approveTheatreAction(theatreId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
export const declineTheatre = createAsyncThunk('admin/declineTheatre', async (theatreId, thunkAPI) => {
    try {
        return await declineTheatreAction(theatreId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
export const addMovie = createAsyncThunk('/admin/addmovie', async (movieData, thunkAPI) => {
    try {
        return await AddMovies(movieData);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
export const fetchMovies = createAsyncThunk('/admin/showingMovies', async (_, thunkAPI) => {
    try {
        return await fetchMovieData();
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const deleteMovie = createAsyncThunk('/admin/deleteMovie', async (movieid, thunkAPI) => {
    try {
        return await deleteMovieData(movieid);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const blockMovie = createAsyncThunk('/admin/blockMovie', async ({ movieId, isBlocked }, thunkAPI) => {
    try {
        console.log(movieId, isBlocked, "log for adminService");
        return await blockMovieData({ movieId, isBlocked });
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});

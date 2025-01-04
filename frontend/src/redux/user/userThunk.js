import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, googleLoginUser, forgotPassword, resetPassword, verifyUser, verifyNewPassword, resendOtpAgain, getUpcomingMovies, getNowShowingMovies, fetchTheatreData, removeMovieFromWishlist, movieInWishList, favouritesUserMovies, newMovieRating } from './userService';
export const register = createAsyncThunk('user/register', async ({ name, email, mobile, password }, thunkAPI) => {
    try {
        console.log(name, email);
        return await registerUser(name, email, mobile, password);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const login = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
    try {
        return await loginUser(email, password);
    }
    catch (error) {
        console.log(error, "error in thunk");
        return thunkAPI.rejectWithValue(error.response.data.message || 'Something went wrong');
    }
});
export const googleLogin = createAsyncThunk('user/googleLogin', async (token, thunkAPI) => {
    try {
        return await googleLoginUser(token);
    }
    catch (error) {
        console.log(error, "error in thunk return");
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const forgotPass = createAsyncThunk('user/forgotPass', async (email, thunkAPI) => {
    try {
        return await forgotPassword(email);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const resetPass = createAsyncThunk('user/resetPass', async (newPassword, thunkAPI) => {
    try {
        return await resetPassword(newPassword);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const userVerify = createAsyncThunk('user/userVerify', async (otp, thunkAPI) => {
    try {
        return await verifyUser(otp);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const resendOtp = createAsyncThunk('user/resendOtp', async (_, thunkAPI) => {
    try {
        return await resendOtpAgain();
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
    }
});
export const newPassVerify = createAsyncThunk('user/newPassVerify', async (otp, thunkAPI) => {
    try {
        return await verifyNewPassword(otp);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const fetchMovies = createAsyncThunk('user/loadMovies', async (params, thunkAPI) => {
    try {
        // const { page = 1, language = '', genre = '', searchQuery = '' } = params;
        const { page, language, genre, searchQuery, sortBy } = params || {};
        const upcomingMovies = await getUpcomingMovies({ page, language, genre, searchQuery, sortBy });
        const nowShowingMovies = await getNowShowingMovies({ page, language, genre, searchQuery, sortBy });
        return {
            upcomingMovies,
            nowShowingMovies
        };
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Fetching movies failed');
    }
});
export const fetchTheatres = createAsyncThunk("user/fetchTheatres", async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
        const theatres = await fetchTheatreData(latitude, longitude);
        return theatres;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const addToFavourites = createAsyncThunk('user/addMovieToFavourites', async ({ userId, movieId }, thunkAPI) => {
    try {
        return await movieInWishList({ userId, movieId });
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const deleteFromFavourites = createAsyncThunk('user/deleteMovieFromFavourites', async ({ userId, movieId }, thunkAPI) => {
    try {
        return await removeMovieFromWishlist({ userId, movieId });
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const getFavouritesMovieByUser = createAsyncThunk('user/getFavourites', async (userId, thunkAPI) => {
    try {
        return await favouritesUserMovies(userId);
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "something went wrong");
    }
});
export const postRating = createAsyncThunk('user/ratingMovies', async ({ userId, movieId, rating }, thunkAPI) => {
    try {
        // const { page = 1, language = '', genre = '', searchQuery = '' } = params;
        return await newMovieRating({ movieId, userId, rating });
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Fetching movies failed');
    }
});

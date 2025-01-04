import axios from 'axios';
import { theatreAuthenticate } from '../../utils/axios/theatreInterceptor';
const API_BASE_URL = "https://api.movie-flex.site";
export const registerUser = async ({ name, email, mobile, password, file }) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('password', password);
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/theatre/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        localStorage.setItem("otpThetToken", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/theatre/login`, { email, password }, { withCredentials: true });
        localStorage.setItem('theatre', JSON.stringify(response.data.theatre));
        localStorage.setItem('theatreAccessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/theatre/forgot-password`, { email });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const resetPassword = async (newPassword) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/theatre/reset-password`, { newPassword });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const verifyUser = async (otp) => {
    try {
        const token = localStorage.getItem("otpThetToken");
        const response = await axios.post(`${API_BASE_URL}/theatre/verify-theatre`, { token, otp });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const verifyNewPassword = async (otp) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/theatre/verify-otp`, { token, otp });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const homePage = async () => {
    try {
        const userToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/theatre/home`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const resendOtpAgain = async () => {
    try {
        const token = localStorage.getItem('otpThetToken');
        const response = await axios.post(`${API_BASE_URL}/theatre/resend-otp`, { token });
        localStorage.setItem('otpThetToken', response.data.theatre);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const addMoviesViaTheatre = async ({ movie, screenId }) => {
    try {
        const response = await theatreAuthenticate.post("/add-movies-screen", { movie, screenId });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const completeTheatreProfileData = async (addressData) => {
    try {
        const response = await theatreAuthenticate.post("/completeProfile", { addressData });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const addScreenData = async (screenData) => {
    try {
        const response = await theatreAuthenticate.post("/AddScreen", { screenData });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const ScreensListData = async (theatreId) => {
    try {
        const response = await theatreAuthenticate.get('/showscreens', {
            params: { theatreId }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const StoreTierData = async ({ tierData, screenId }) => {
    try {
        const response = await theatreAuthenticate.post('/update-tier', { tierData, screenId });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const RollingMoviesData = async () => {
    try {
        const response = await theatreAuthenticate.get('/RollingMovies');
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const updateScreenData = async (screenData) => {
    try {
        console.log(screenData, "in service update");
        const response = await theatreAuthenticate.put('/update-screen', { screenData });
        console.log(response, "response");
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const moviesRollinShowtime = async (showtimeData) => {
    try {
        console.log(showtimeData, "showdata in service");
        const response = await theatreAuthenticate.post('/shows-rollin-movies', { showtimeData });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const removeShow = async (screenId, showtimeId) => {
    try {
        const response = await theatreAuthenticate.delete('/remove-shows', {
            params: {
                screenId,
                showtimeId,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const deleteMovieFromScreen = async (movieId, screenId) => {
    try {
        const response = await theatreAuthenticate.delete('/remove-enroll_movie', {
            params: {
                screenId,
                movieId
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error in service", error);
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
            throw new Error(message);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    }
};

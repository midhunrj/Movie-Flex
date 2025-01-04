
import axios from "axios";
import { theatreUrl } from "./config/urlConfig";


export const theatreAuthenticate = axios.create({
    baseURL: theatreUrl,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true 
});

const API_BASE_URL = "https://api.movie-flex.site";


theatreAuthenticate.interceptors.request.use(
    (request) => {
        const theatreAccessToken = localStorage.getItem('theatreAccessToken');
        if (theatreAccessToken) {
            request.headers.Authorization = `Bearer ${theatreAccessToken}`;
        }
        console.log(request, "request sent");

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor for handling token expiration
theatreAuthenticate.interceptors.response.use(
    (response) => {
        console.log(response,"response got");
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) for expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const response = await axios.get(`${API_BASE_URL}/auth/theatre/refreshtoken`, { withCredentials: true });
                const newtheatreAccessToken = response.data.accessToken;

                // Store the new access token in localStorage
                localStorage.setItem('theatreAccessToken', newtheatreAccessToken);

                // Set new token in Authorization header
                theatreAuthenticate.defaults.headers.common["Authorization"] = `Bearer ${newtheatreAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newtheatreAccessToken}`;

                // Retry the original request with the new token
                return theatreAuthenticate(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Clear tokens and possibly redirect to login if refresh fails
                localStorage.removeItem('theatreAccessToken');
                // Handle navigation to login if needed, for example:
                // window.location.href = "/login"; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

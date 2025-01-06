import axios from "axios";
import { adminUrl } from "./config/urlConfig";

export const adminAuthenticate = axios.create({
  baseURL: adminUrl,  // Corrected the URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const API_BASE_URL = import.meta.env.VITE_USER_URL;

adminAuthenticate.interceptors.request.use(
  (request) => {
    const adminAccessToken = localStorage.getItem('adminAccessToken');
    if (adminAccessToken) {
      request.headers.Authorization = `Bearer ${adminAccessToken}`;
    }
    console.log("Request sent:", request);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminAuthenticate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      const originalRequest = error.config;
      console.log(error.config,"error from config in failed request",originalRequest,"original request");
        // Access config as a property, not a function
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const response = await axios.get(`${API_BASE_URL}/auth/admin/refreshtoken`,{withCredentials:true});
        const newAdminAccessToken = response.data.accessToken;
        localStorage.setItem('adminAccessToken', newAdminAccessToken);

        adminAuthenticate.defaults.headers.common["Authorization"] = `Bearer ${newAdminAccessToken}`;
        console.log("retry original request with new accesstoken using refresh token");
        
        // Retry the original request with the new token
        return adminAuthenticate(originalRequest);
      }
    } catch (err) {
      console.log("Token refresh failed:", err);
      return Promise.reject(error)
    }
  }
);

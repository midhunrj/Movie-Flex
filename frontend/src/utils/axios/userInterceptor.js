import axios from "axios";

export const userAuthenticate = axios.create({
    baseURL: 'http://localhost:7486/', // Corrected baseURL
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

userAuthenticate.interceptors.request.use(
    (request) => {
        const userAccessToken = localStorage.getItem('accessToken');
        if (userAccessToken) {
            request.headers.Authorization = `Bearer ${userAccessToken}`;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

userAuthenticate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config; // Corrected from error.config()
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await userAuthenticate.get('/auth/refreshtoken');
                const newuserAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newuserAccessToken);

                userAuthenticate.defaults.headers.common["Authorization"] = `Bearer ${newuserAccessToken}`;

                return userAuthenticate(originalRequest);
            } catch (error) {
                console.log("Token refresh failed", error);
            }
        }
        return Promise.reject(error);
    }
);

// import axios from "axios";

// export const theatreAuthenticate=axios.create({
//     baseURL:'http::/localhost:7486/',
//     headers:{
//         "Content-Type":"application/json"
//     },
//     withCredentials:true
// })

// const API_BASE_URL = "http://localhost:7486";
// theatreAuthenticate.interceptors.request.use(
//     (request)=>{
//         const theatreAccessToken=localStorage.getItem('theatreAccessToken')
//         if(theatreAccessToken)
//         {
//            request.headers.Authorization=`Bearer ${theatreAccessToken}` 
//         }
//         console.log(request,"request sent");
        
//         return request
//     },
//     (error)=>
//     {
//         return Promise.reject(error)
//     }
// )

// theatreAuthenticate.interceptors.response.use(
//     (response)=>{
//         return response
//     },
//     async (error)=>{
//         try{
//             const originalRequest=error.config
//             if(error.response.status==401&& !originalRequest._retry)
//             {
//                 originalRequest._retry=true
//             }
//             const response=await axios.get(`${API_BASE_URL}/auth/refreshtoken`,{withCredentials:true});
//             const newtheatreAccessToken=response.data
//             localStorage.setItem('theatreAccessToken',newtheatreAccessToken)

//             theatreAuthenticate.defaults.headers.common["Authorization"]=`Bearer ${newtheatreAccessToken}`

//             return theatreAuthenticate(originalRequest)
//         }
//         catch(error)
//         {
//             console.log("token refresh failed",error);
//         }
//     }
// )

import axios from "axios";

// Set the correct baseURL
export const theatreAuthenticate = axios.create({
    baseURL: 'http://localhost:7486/theatre',
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // Ensure cookies like refresh tokens are passed
});

const API_BASE_URL = "http://localhost:7486";

// Request Interceptor
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

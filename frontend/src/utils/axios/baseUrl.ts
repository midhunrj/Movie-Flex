import axios  from "axios"

 const axiosUrl=axios.create({
    baseURL:import.meta.env.VITE_USER_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default axiosUrl
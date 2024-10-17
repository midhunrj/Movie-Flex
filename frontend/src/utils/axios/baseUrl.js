import axios  from "axios"

 const axiosUrl=axios.create({
    baseURL:'http::/localhost:7486/',
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default axiosUrl
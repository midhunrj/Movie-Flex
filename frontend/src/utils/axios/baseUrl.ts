import axios  from "axios"

 const axiosUrl=axios.create({
    baseURL:'https://api.movie-flex.site/',
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default axiosUrl
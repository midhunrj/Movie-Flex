import { RootState } from '@/redux/store/store'
import React,{useState,useEffect, ReactNode} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
const UserProtected: React.FC<{ children: ReactNode }>= ({children}) => {
    const navigate=useNavigate()
    const {user,token}=useSelector((state:RootState)=>state.user)
    console.log(user,"userdata");
    
       const tokenItem=localStorage.getItem('accessToken')
       useEffect(() => {

        if (!token || !user ) {
            console.log("Redirecting: No Token or User Data");
            navigate("/", { replace: true });
        } else if (user?.is_blocked) {
            console.log("Redirecting: User Blocked");
            navigate("/", { replace: true });
        }
    }, [token, user, navigate]);

    if(token && user)
    {
        return children
    }
}

export default UserProtected
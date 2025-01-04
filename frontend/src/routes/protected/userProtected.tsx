import { RootState } from '@/redux/store/store'
import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
const UserProtected = ({children}) => {
    const navigate=useNavigate()
    const {user,token}=useSelector((state:RootState)=>state.user)
    console.log(user,"userdata");
    
    useEffect(()=>{
     if(!token||!user)
     {console.log("ss");
     
        navigate('/',{replace:true})
     }
     else if(user?.is_blocked)
     {
        navigate('/',{replace:true})
     }
    },[token,user])

    if(token && user)
    {
        return children
    }
}

export default UserProtected
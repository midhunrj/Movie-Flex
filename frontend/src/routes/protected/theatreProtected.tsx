import { RootState } from '@/redux/store/store'
import React,{useState,useEffect, ReactNode} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
const TheatreProtected: React.FC<{ children: ReactNode }> = ({children}) => {
    const navigate=useNavigate()
    const {theatre,token,isProfileComplete}=useSelector((state:RootState)=>state.theatre)
    useEffect(()=>{
     if(!token)
     {
        navigate('/theatre',{replace:true})
     }
     if(theatre?.is_blocked)
     {
        navigate('/theatre',{replace:true})
     }
     if(!theatre?.address?.place)
     {
      navigate('/theatre/profile')
     }
    },[])
    if(token&&theatre)
    {
  return children
  
}
}

export default TheatreProtected
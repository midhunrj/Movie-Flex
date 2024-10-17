import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
const TheatreProtected = ({children}) => {
    const navigate=useNavigate()
    const {theatre,token,isProfileComplete}=useSelector((state)=>state.theatre)
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
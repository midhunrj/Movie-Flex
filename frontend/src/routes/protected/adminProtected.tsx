import { RootState } from '@/redux/store/store'
import React,{useState,useEffect, ReactNode} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
const AdminProtected: React.FC<{ children: ReactNode }> = ({children}) => {
    const navigate=useNavigate()
    const {admin,token}=useSelector((state:RootState)=>state.admin)
    useEffect(()=>{
     if(!token)
     {
        navigate('/admin',{replace:true})
     }
     
    },[])
  if(token&&admin)
  {
    return children
  }
}

export default AdminProtected
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
interface OtpData{
    length:number,
    handleSubmit:(otp:string)=>void
}
const OtpInput:React.FC<OtpData> = ({length=4,handleSubmit}) => {
    const [otp,setOtp]=useState(new Array(length).fill(''))
    const inputRefs=useRef<(HTMLInputElement|null)[]>([])
     useEffect(()=>{
        if(inputRefs.current[0]){
            inputRefs.current[0].focus()
        }
     },[])
     const handleChange=(index:number,e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value
        if(isNaN(Number(value))){
            toast.error("otp field should be numbers only")
            return
        }
        const newOtp=[...otp]
        newOtp[index]=value.substring(value.length-1)
        setOtp(newOtp)
        const finalOtp=newOtp.join("")
        if(finalOtp.length==length)
        {
            handleSubmit(finalOtp)
        }

        if(value && index<length-1&&inputRefs.current[index+1]){
            inputRefs.current[index+1]?.focus()
        }
     }

     const handleClick=(index:number)=>{
     inputRefs.current[index]?.setSelectionRange(1,1)
    if(index >0 &&!otp[index-1])
    {
        const emptyIndex=otp.indexOf("")
        if(emptyIndex >=0)
        {
         inputRefs.current[emptyIndex]?.focus()
        }
    }
    }
    const handleKeyDown=(index:number,e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key=="Backspace"&&!otp[index]
            && index>0)
        {
            inputRefs.current[index-1]?.focus()
        }
    }
    return (
    <div>
{otp.map((value,index)=>
(<input key={index} type="text" ref={(input)=>(inputRefs.current[index]=input)}
value={value}
onChange={(e)=>handleChange(index,e)}
onClick={()=>handleClick(index)}
onKeyDown={(e)=>handleKeyDown(index,e)}
className='w-10 h-10 p-[10px] m-2 mb-[10px] pb-[10px] border-gray-300 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'/>
))}
    </div>
  )
}

export default OtpInput
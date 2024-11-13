import React, { useState } from 'react'
import ChildComp from './ChildComp';

const Parentcomp = () => {
    const [data, setData] = useState([]);
    const AddWord=(newWord)=>{
        setData((prev)=>[...prev,newWord])
    }
    return (<><ChildComp sendData={AddWord} />
    <div className="grid place-items-center mt-4">
    {data.length>0?(
    data.map((dat,index)=>(
         <p key={index} className='text-white text-center text-xl bg-blue-700 flex justify-center items-center  m-2 rounded-lg w-40 p-4 '>{dat}</p>))):(<p className='text-center text-2xl font-extralight text-blue'>No words have been added from child component</p>)}
    
    </div>
    </>
  )
}

export default Parentcomp
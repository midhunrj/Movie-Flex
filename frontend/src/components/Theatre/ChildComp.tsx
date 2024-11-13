import React, { useState } from 'react'

const ChildComp = ({ sendData })=> {
    const [inputValue,setInputValue]=useState('')
    const handleClick = (e) =>{e.preventDefault();
        if(inputValue){ sendData(inputValue)
         setInputValue('')
        }}

  return (
    <>
    <div className=' h-96 p-4 m-4 justify-center flex items-center bg-blue-900 text-white'>
        <form className='w-full flex flex-col items-center h-80 p-4 m-4'>
    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} // Update state on input change
                    placeholder="Type something..."
                    className='w-full px-8 py-2 min-h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent mt-4 '
                />
    <button onClick={handleClick} className='cursor-pointer  bg-yellow-500 justify-center min-h-12 w-fit rounded-lg p-4 m-4'>Send Data</button>
    </form>
    </div>
    
    </>
  )
}

export default ChildComp
import React, { useEffect } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlugCirclePlus, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useDispatch, useSelector } from 'react-redux';
import { listScreen } from '../../redux/theatre/theatreThunk';

const ScreensList = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {theatre,token,isSuccess,isLoading,screens}=useSelector((state)=>state.theatre)
  console.log(theatre,"theatre data");
  
  useEffect(()=>{
   dispatch(listScreen(theatre._id))
  },[])
  const handleAddScreen = () => {
    navigate('/theatre/new-screen'); 
  };
const handleEditScreen=(id)=>{
  navigate(`/theatre/edit-screen/${id}`)
}
  return (
    <>
      <div className="bg-orange-300 min-h-screen">
        <TheatreHeader />
        <h1 className="text-4xl font-bold text-blue-400 text-center mt-8">
          Welcome to Movie Ticket Booking
        </h1>
        <div className='flex mt-12 pb-8 gap-5 items-center justify-center'>
          <div className="grid grid-cols-4 gap-12">
            {/* Display existing screens */}
            {console.log(screens,"screen in list page")}
            {screens && screens.length > 0 ? (
              
              screens.map((screen, index) => (
                <div key={index} className="w-full text-center text-white bg-blue-950 bg-gradient-to-r mx-8 h-96 border-b-black rounded-lg">
                  <h2 className="block">{ screen.screenName}</h2>
                 {screen.movie? <img
                    src={screen.image}
                    alt={`Now Showing ${screen.movie}`}
                    className="p-4 rounded w-full h-80"
                  />
                  :<div className='w-full flex  flex-col justify-center items-center p-4 rounded h-80 bg-black text-white text-center '><span className='text-center items-center'>No Movies Added to the screen
                  </span><button className='bg-blue-500 min-h-8 w-fit mt-4 text-white items-end hover:bg-blue-800 p-2'>ADD movie</button> 
                  </div>}
                  <p className="text-sm text-justify cursor-pointer mx-4  text-gray-400" onClick={()=>handleEditScreen(screen._id)}>Edit</p>
                  <p className="text-lg font-semibold text-center">{screen.movie}</p>
                </div>
              ))
            ) : null}

            {/* Always display the Add Screen option after all screens */}
            <div className='mx-8 h-96 w-full text-center text-white bg-blue-950 border-b-black border rounded-lg'>
              <div className='flex flex-col justify-center items-center h-full'>
                <FontAwesomeIcon
                  icon={faPlus}
                  className='text-[15rem]  text-white cursor-pointer'
                  onClick={handleAddScreen}
                   
                />
                <h2 className="block mt-4 text-xl font-medium">Add Screen</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScreensList;

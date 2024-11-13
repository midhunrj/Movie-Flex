import React, { useEffect } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listScreen } from '../../redux/theatre/theatreThunk';
import { AppDispatch, RootState } from '@/redux/store/store';

const ScreensList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theatre, screens } = useSelector((state: RootState) => state.theatre);

  useEffect(() => {
    if (theatre?._id) {
      dispatch(listScreen(theatre._id));
    }
  }, [theatre, dispatch]);

  const handleAddScreen = () => {
    navigate('/theatre/new-screen');
  };

  const handleEditScreen = (id?: string) => {
    if (id) navigate(`/theatre/edit-screen/${id}`);
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FEE685" }}>
        <TheatreHeader />
        <h1 className="text-4xl font-bold text-blue-400 text-center mt-8">
          Welcome to Movie Ticket Booking
        </h1>
        <div className="flex mt-12 pb-8 gap-5 items-center justify-center">
          <div className="grid grid-cols-4 gap-12">
            {screens && screens.length > 0 &&
              screens.map((screen, index) => (
                <div key={index} className="w-full text-center text-white bg-indigo-950 bg-gradient-to-r mx-8 h-96 border-b-black rounded-lg">
                  <h2 className="block">{screen.screenName}</h2>
                  {screen?.enrolledMovies && screen.enrolledMovies.length > 0 ? (
  <img
    src={screen.enrolledMovies?.[0]?.poster_path ?? ""}
    alt={`Now Showing ${screen.enrolledMovies?.[0]?.title ?? "Movie"}`}
    className="p-4 rounded w-full h-80"
  />
) : (
  <div className="w-full flex flex-col justify-center items-center p-4 rounded h-80 bg-black text-white text-center">
    <span>No Movies Added to the screen</span>
    <button className="bg-blue-500 min-h-8 w-fit mt-4 text-white hover:bg-blue-800 p-2">
      ADD movie
    </button>
  </div>
)}

                  <p className="text-sm text-gray-400 cursor-pointer mx-4" onClick={() => handleEditScreen(screen._id)}>Edit</p>
                  <p className="text-lg font-semibold">{screen.enrolledMovies?.[0]?.title ?? "No Movie"}</p>
                </div>
              ))
            }
            {/* Add Screen Button */}
            <div className="mx-8 h-96 w-full text-center text-slate-200 bg-indigo-950 border-b-black border rounded-lg">
              <div className="flex flex-col justify-center items-center h-full">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-[15rem] text-slate-200 cursor-pointer"
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

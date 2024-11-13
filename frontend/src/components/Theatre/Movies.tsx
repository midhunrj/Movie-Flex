import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addMoviesToScreen, fetchMovies } from '../../redux/theatre/theatreThunk';  // Action to add movie to a screen
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { useLocation, useNavigate } from 'react-router';
import { AppDispatch, RootState } from '@/redux/store/store';
import { EnrolledMovie, MovieType } from '@/types/movieTypes';
//import SidebarMenu from './sidebarMenu';

const RollingMovies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation()
  const navigate=useNavigate()
  const { movies, isError, isLoading } = useSelector((state:RootState) => state.theatre); // Assuming movies are stored in 'admin' slice
  
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const enrolledMovies = location.state?.enrolledMovies || [];
   const screenId=location.state?.screenId
  useEffect(() => {

    dispatch(fetchMovies());
  }, [dispatch])

  const handleAddToScreen = (movie:MovieType) => {
    const updatedMovies:MovieType[] = [...enrolledMovies,movie]
    if(location.state?.screenId)
    {
    if (window.confirm('Are you sure you want to add this movie to your screen?')) {
      
      dispatch(addMoviesToScreen({movie,screenId})) // Dispatch action to add movie to screen
    }
  }
    navigate(-1,{state:{updatedMovies}})
  };

  return (
    <>
      <div className="min-h-screen" style={{backgroundColor:"#FEE685"}}>
        <TheatreHeader />
        

          <h1 className="text-blue-800 text-3xl mt-4 font-medium text-center">Available Movies</h1>
        

        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-28 mx-20 my-6">
          {isLoading ? (
            <p>Loading movies...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading movies</p>
          ) : movies.length > 0 ? (
            movies.map((movie, index) => (
              <div key={movie.id || index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                
                <img
                  src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'default_poster.jpg'}
                  alt={movie.title}
                  className="w-full h-80 object-cover rounded-md mb-4"
                />

            
                <h2 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-600 mb-1">Language: {movie.language}</p>
                <p className="text-sm text-gray-600 mb-1">Release Date: {new Date(movie.releaseDate).toDateString()}</p>
                <p className="text-sm text-gray-600 mb-1">Rating: {movie.rating}</p>

                {/* Add to Movie Screen button */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleAddToScreen(movie)}
                    className="text-zinc-200  min-h-8 min-w-fit px-2 bg-blue-600 text-sm cursor-pointer hover:bg-blue-800 hover:text-white  hover:text-base transition-all"
                  >
                    Add to Movie Screen
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No movies available.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RollingMovies;

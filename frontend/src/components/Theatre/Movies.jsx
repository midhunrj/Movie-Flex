import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../../redux/admin/adminThunk'; // Action to fetch movies
import { addMoviesToScreen } from '../../redux/theatre/theatreThunk';  // Action to add movie to a screen
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
//import SidebarMenu from './sidebarMenu';

const RollingMovies = () => {
  const dispatch = useDispatch();
  const { movies, isError, isLoading } = useSelector((state) => state.admin); // Assuming movies are stored in 'admin' slice
  
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images

  useEffect(() => {
    // Fetch all movies when the component mounts
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleAddToScreen = (movieId) => {
    if (window.confirm('Are you sure you want to add this movie to your screen?')) {
      dispatch(addMoviesToScreen(movieId)); // Dispatch action to add movie to screen
    }
  };

  return (
    <>
    <div className=" bg-orange-300 min-h-screen">
        <TheatreHeader/>
      <div className="flex justify-between items-center">
        <h1 className="text-blue-500 font-bold">Available Movies</h1>
      </div>

      {/* Grid layout to display movies */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-28 mx-20 my-6">
        {isLoading ? (
          <p>Loading movies...</p>
        ) : isError ? (
          <p className="text-red-500">Error loading movies</p>
        ) : movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.id || index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
              {/* Movie Poster */}
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'default_poster.jpg'}
                alt={movie.title}
                className="w-max h-80 object-cover rounded-md mb-4"
              />

              {/* Movie Details */}
              <h2 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-600 mb-1">Language: {movie.language}</p>
              <p className="text-sm text-gray-600 mb-1">Release Date: {new Date(movie.releaseDate).toDateString()}</p>
              <p className="text-sm text-gray-600 mb-1">Rating: {movie.rating}</p>

              {/* Add to Movie Screen button */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleAddToScreen(movie.id)}
                  className="text-zinc-200 min-h-8 min-w-fit px-2 bg-blue-500 text-sm cursor-pointer hover:bg-blue-800 hover:text-white hover:underline hover:text-base transition-all"
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
      <Footer/>
      </div>
    </>
  );
};

export default RollingMovies;

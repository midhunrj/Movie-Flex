import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { addMoviesToScreen, fetchMovies } from '../../redux/theatre/theatreThunk';
import TheatreHeader from './TheatreHeader';

import { useLocation, useNavigate } from 'react-router';
import { AppDispatch, RootState } from '@/redux/store/store';
import { EnrolledMovie, MovieType } from '@/types/movieTypes';
import { Footer } from 'flowbite-react';

const RollingMovies: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { movies, isError, isLoading } = useSelector((state: RootState) => state.theatre);
  const[searchQuery,setSearchQuery]=useState('')
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const enrolledMovies: EnrolledMovie[] = location.state?.enrolledMovies || [];
  const screenId = location.state?.screenId;

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleAddToScreen = async (movie: MovieType) => {
    console.log(movie,"movieDetails");
    
    const updatedMovies: EnrolledMovie[] = [
      ...enrolledMovies,
      {
        movieId: movie?._id as string,
        movie_id: movie.movie_id,
        title: movie.title,
        duration: movie.runtime,
        genre: movie.genre,
        releaseDate:movie.releaseDate,
        language: movie.language,
        rating: movie.rating,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        cast: movie.cast,
      },
      
      
    ];
     console.log(enrolledMovies,"enrolledMovie");
     
    if (screenId) {
      const result = await Swal.fire({
        title: 'Add this movie to the screen?',
        text: `Movie: ${movie.title}\nRating: ${movie.rating}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add it!',
        cancelButtonText: 'No, Cancel',
        customClass: {
          confirmButton: 'bg-blue-600 w-fit text-white px-4 py-2 min-h-8 rounded-md hover:bg-blue-800',
          cancelButton: 'bg-gray-300 w-fit text-gray-700 px-4 py-2 min-h-8 rounded-md hover:bg-gray-400',
        },
      });

      if (result.isConfirmed) {
        dispatch(addMoviesToScreen({ movie, screenId }));
        // Swal.fire({
        //   title: 'Movie Added!',
        //   text: `${movie.title} has been added to the screen.`,
        //   icon: 'success',
        //   timer: 2000,
        //   showConfirmButton: false,
        // });
        navigate(-1 as unknown as string, { state: { updatedMovies } });
      } else {
        // Swal.fire({
        //   title: 'Action Cancelled',
        //   text: 'No changes were made.',
        //   icon: 'info',
        //   timer: 1500,
        //   showConfirmButton: false,
        // });
      }
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <>
      {/* <div className="min-h-screen" style={{ backgroundColor: "#FEE685" }}> */}
      <div className="min-h-screen bg-gray-100">
        <TheatreHeader />
        <h1 className="text-blue-800 text-3xl mt-4 font-medium text-center">Available Movies</h1>
        <div className="flex justify-start gap-4 mb-4 ml-10">
        <input
          type="text"
          placeholder="Search movies..."
          className="p-2 border rounded w-fit focus:blue-"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /></div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-28 mx-20 my-6">
          {isLoading ? (
            <p>Loading movies...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading movies</p>
          ) : filteredMovies.length > 0 ? (
            
            filteredMovies.map((movie, index) => (
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
               {screenId &&( <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleAddToScreen(movie)}
                    className="text-zinc-200 min-h-8 min-w-fit px-2 bg-blue-600 text-sm cursor-pointer hover:bg-blue-800 hover:text-white hover:text-base transition-all"
                  >
                    Add to Movie Screen
                  </button>
                </div>
               )}
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

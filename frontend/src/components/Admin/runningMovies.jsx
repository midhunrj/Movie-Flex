import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarMenu from './sidebarMenu';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { blockMovie, deleteMovie, fetchMovies } from '../../redux/admin/adminThunk';
import {ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'
import './css/login.css'

const RunningMovies = () => {
  
  const dispatch = useDispatch();
  const { movies, isError, isSuccess, isLoading } = useSelector((state) => state.admin);

  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images
 const [selectedMovie,setSelectedMovie]=useState(null)
  const getYouTubeEmbedUrl = (videoLink) => {
    const videoId = videoLink.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = (movieId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'swal2-confirm-btn',  // Custom class for confirm button
        cancelButton: 'swal2-cancel-btn',    // Custom class for cancel button
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteMovie(movieId));
        Swal.fire({
          title: 'Deleted!',
          text: 'Your movie has been deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'swal2-confirm-btn'  // Custom class for success message button
          }
        });
    }});
  };
  
  const handleBlock = (movieId, isBlocked) => {
    const confirmMessage = isBlocked ? 'Unblock this movie?' : 'Block this movie?';
    Swal.fire({
      title: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isBlocked ? 'Yes, unblock it!' : 'Yes, block it!',
      customClass: {
        confirmButton: 'swal2-confirm-btn',  
        cancelButton: 'swal2-cancel-btn',    
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(blockMovie({ movieId, isBlocked }));
      Swal.fire({
        title: isBlocked ? 'Unblocked!' : 'Blocked!',
        text: `The movie has been ${isBlocked ? 'unblocked' : 'blocked'}.`,
        icon: 'success',
        customClass: {
          confirmButton: 'swal2-confirm-btn'  // Custom class for success message button
        }
      });
          }
    });
  };
  
  return (
    <>
      <SidebarMenu>
        <div className="flex justify-between items-center">
          <h1 className="text-blue-500 font-bold text-wrap">Running Movies</h1>
        </div>
        <div className='flex justify-end '>
          <a href='/admin/movies' className='bg-lime-500 rounded text-sm p-2  text-slate-100 hover:bg-green-700 hover:text-white hover:text-md transition-all  border-collapse '>Add Movie</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {isLoading ? (
            <p>Loading movies...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading movies</p>
          ) : movies.length > 0 ? (
            movies.map((movie,index) => (
              <div key={movie.id||index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                <div>
                  {/* Movie Poster */}
                  <img
                    src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg'}
                    alt={movie.title}
                    className="w-full h-72 object-cover rounded-md mb-4"
                  />

                  {/* Movie Title */}
                  <h2 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h2>

                  {/* Movie Details */}
                  <p className="text-sm text-gray-600 mb-1">Language: {movie.language}</p>
                  <p className="text-sm text-gray-600 mb-1">Release Date: {new Date(movie.releaseDate).toDateString()}</p>
                  <p className="text-sm text-gray-600 mb-1">Rating: {movie.rating}</p>

                  {/* Movie Video (Trailer) */}
                  {/* {movie.video_link && movie.video_link.includes('youtube.com')&&( */}
                    {/* <a */}
                    {/* //   href={movie.video_link}
                    //   target="_blank"
                    //   rel="noopener noreferrer"
                    //   className="text-blue-500 hover:underline text-sm"
                    // >
                    //   Watch Trailer
                    // </a>
                //     <iframe className='w-full h-48' */}
                {/* //     src={getYouTubeEmbedUrl(movie.video_link)}
                //     frameBorder="0"
                //     allow='accelerometer;autoplay;clipboard-write,encrypted-media;gyroscope;picture-in-picture'
                //     allowFullScreen
                //     title={movie.title}
                //     />
                //   )} */}

                {movie.video_link && movie.video_link.includes('youtube.com') && (
                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className="text-blue-500 hover:underline text-sm mt-2"
                    >
                      Watch Trailer
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between">
                  {/* <Link
                    to={`/edit-movie/${movie.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </Link> */}
                  <button
                    onClick={() => handleBlock(movie.movie_id, movie.is_blocked)}
                    className="bg-blue-500  text-slate-200 hover:underline text-sm min-h-8 hover:text-white hover:scale-105 hover:bg-blue-800 transition-all   p-2"
                  >
                    {movie.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="bg-red-500 hover:underline text-sm text-slate-200 min-h-8  hover:text-white hover:scale-105 hover:bg-red-700 transition-all p-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
        {/* Video Modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedMovie.title} - Trailer</h2>
              <iframe
                className="w-full h-64"
                src={getYouTubeEmbedUrl(selectedMovie.video_link)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedMovie.title}
              />
            </div>
          </div>
        )}
      </SidebarMenu>
    </>
  );
};

export default RunningMovies;

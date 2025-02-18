import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarMenu from './sidebarMenu';

import { Link } from 'react-router-dom';
import { blockMovie, deleteMovie, fetchMovies } from '../../redux/admin/adminThunk';
import { toast } from 'sonner';
import Swal from 'sweetalert2'
import './css/login.css'
import { AppDispatch, RootState } from '@/redux/store/store';
import { MovieType } from '@/types/movieTypes';

const RunningMovies = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const { movies, isError, isSuccess, isLoading } = useSelector((state:RootState) => state.admin);
  const [searchQuery, setSearchQuery] = useState('');
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images
 const [selectedMovie,setSelectedMovie]=useState<MovieType|null>(null)
  const getYouTubeEmbedUrl = (videoLink:string) => {
    const videoId = videoLink.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  const [languageFilter, setLanguageFilter] = useState('');
  const [visibleMovies, setVisibleMovies] = useState(20);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = (movieId:string) => {
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
  
  const handleBlock = (movieId:number, isBlocked:boolean) => {
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

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (languageFilter ? movie.language === languageFilter : true)
  );
  const [currentPage, setCurrentPage] = useState(1);
const moviesPerPage = 20;

const paginateMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

const handleNextPage = () => setCurrentPage(prev => prev + 1);
const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <>
      <SidebarMenu>
        <div className="flex justify-between items-center">
          <h1 className="text-blue-500 font-bold text-wrap">Running Movies</h1>
        </div>
        <div className='flex justify-end '>
          <Link to='/admin/movies' className='bg-lime-500 rounded text-sm p-2  text-slate-100 hover:bg-green-700 hover:text-white hover:text-md transition-all  border-collapse '>Add Movie</Link>
        </div>

        <div className="flex justify-start gap-4 mb-4">
        <input
          type="text"
          placeholder="Search movies..."
          className="p-2 border rounded w-fit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">All Languages</option>
          {[...new Set(movies.map(m => m.language))].map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {isLoading ? (
            <p>Loading movies...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading movies</p>
          ) : paginateMovies.length > 0 ? (
            paginateMovies.map((movie:MovieType,index:number) => (
              <div key={movie.id||index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                <div className='relative'>
                  {/* Movie Poster */}
                  <img
                    src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg'}
                    alt={movie.title}
                    className="w-full h-72 object-cover rounded-md mb-4"
                  />
                     {movie.video_link && movie.video_link.includes('youtube.com') && (
                      <div className="absolute  inset-0 z-10 flex items-center justify-center ">
                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className="text-white bg-black bg-opacity-40 hover:bg-opacity-50 transition-all font-bold  border border-white p-2 h-fit rounded-lg w-fit  text-sm mt-2"
                    >
                      play Trailer
                    </button>
                    </div>
                  )}
                
                  <h2 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h2>

                
                  <p className="text-sm text-gray-600 mb-1">Language: {movie.language}</p>
                  <p className="text-sm text-gray-600 mb-1">Release Date: {new Date(movie.releaseDate).toDateString()}</p>
                  <p className="text-sm text-gray-600 mb-1">Rating: {movie.rating}</p>

                 
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
                    onClick={() => handleBlock(movie.movie_id, movie?.is_blocked)}
                    className="bg-blue-500  text-slate-200 hover:underline text-sm min-h-8 hover:text-white hover:scale-105 hover:bg-blue-800 transition-all   p-2"
                  >
                    {movie.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id??'')}
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
        {/* {visibleMovies < filteredMovies.length && (
        <div className="text-center mt-4">
          <button onClick={() => setVisibleMovies(prev => prev + 20)}
            className="bg-blue-600 text-white  w-fit h-fit p-2 rounded">Load More</button>
        </div>
      )} */}

<div className="flex justify-center mt-8 space-x-4">
  <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-blue-500 px-4 py-2 w-fit h-fit text-white  rounded-md">Previous</button>
  <span className="self-center cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white">
               {currentPage}
            </span>
  <button onClick={handleNextPage} disabled={currentPage * moviesPerPage >= filteredMovies.length} className="  w-fit h-fit px-4 py-2 bg-blue-500 text-white rounded-md">Next</button>
</div>


      
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

// import React ,{useState,useEffect} from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { fetchMovies } from '../../redux/user/userThunk';

// const MovieDetails = () => {
//   const { id } = useParams();
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const {upcomingMovies}=useSelector((state)=>state.user)
// console.log(upcomingMovies,"upcomingMovies in movieDetails");
//   const dispatch=useDispatch()
//   const movie = useSelector((state) =>
//     state.user.upcomingMovies.find((movie) => movie.id === id)||state.user.nowShowingMovies.find((movie)=>movie.id===id)
//   );
//   const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
//   useEffect(()=>{
//    dispatch(fetchMovies())
//   },[])

//   if (!movie) return <div>Movie not found</div>;

//   return (
//     <div className="movie-details-page">
//       {/* Movie Poster with Play Button */}
//       <div className="relative">
//         <img 
//          src={movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "banner img brand.jpeg"} 
//           alt={movie.title} 
//           className="w-full h-96 object-cover"
//           style={{ filter: 'brightness(50%)' }} // Darken for overlay
//         />
        
//         <div className="absolute inset-0 flex items-center justify-center">
//           {!isVideoPlaying ? (
//             <button
//               className="bg-red-600 text-white p-4 rounded-full"
//               onClick={() => setIsVideoPlaying(true)} // Play video
//             >
//               Play Trailer
//             </button>
//           ) : (
//             <iframe
//               width="560"
//               height="315"
//               src={movie.video_link}
//               title={movie.title}
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className="w-full h-full"
//             ></iframe>
//           )}
//         </div>

//         {/* Movie Info on Top of Poster */}
//         <div className="absolute bottom-0 left-0 p-4 text-white">
//           <h1 className="text-4xl font-bold">{movie.title} ({new Date(movie.releaseDate).getFullYear()})</h1>
//           <p className="text-lg">Rating: {movie.rating}/10</p>
//           <button className="bg-blue-500  min-h-8 w-fit mt-2 p-2 rounded">Add to Favorites</button>
//         </div>
//       </div>

//       {/* Movie Details Below */}
//       <div className="p-4">
//         <h2 className="text-2xl font-bold">Description</h2>
//         <p>{movie.description}</p>

//         <h3 className="text-xl font-bold mt-4">Cast & Crew</h3>
//         <p><strong>Director:</strong> {movie.crew.director}</p>
//         <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>

//         {/* Add Rating */}
//         <div className="mt-6">
//           <button className="bg-green-500 p-2 rounded min-h-8 w-fit">Add Your Rating</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovies } from '../../redux/user/userThunk';
import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa'; // Font Awesome Icons

const MovieDetails = () => {
  const { id } = useParams();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Favorite state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { upcomingMovies, nowShowingMovies } = useSelector((state) => state.user);
  const movie = upcomingMovies.find((movie) => movie.id === id) || nowShowingMovies.find((movie) => movie.id === id);

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (!movie) return <div>Movie not found</div>;

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite); // Toggle favorite state
  };
  const videoId = movie?.video_link.split('v=')[1];
  const ampersandPosition = videoId?.indexOf('&');
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="movie-details-page relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button className="bg-gray-800 min-h-8 text-white p-2 rounded-full" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
      </div>

      {/* Movie Poster with Play Button */}
      <div className="relative">
        <img
          src={movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "/banner-img-brand.jpeg"}
          alt={movie.title}
          className={`w-full h-96 object-cover ${isVideoPlaying ? 'hidden' : ''}`}
          style={{ filter: 'brightness(50%)' }} // Darken for overlay
        />

        {/* Play Button and Trailer */}
        {!isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="bg-red-600 min-h-10 text-white p-4 rounded-full"
              onClick={() => setIsVideoPlaying(true)} // Play video
            >
              Play
            </button>
          </div>
        )}

        {isVideoPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`${embedUrl}?autoplay=1&controls=0`}
              title={movie.title}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-screen object-cover"
            ></iframe>
  
            
            <button
              onClick={() => setIsVideoPlaying(false)} 
              className="absolute top-4 right-4 min-h-8 bg-white text-black p-2 rounded-full font-bold text-lg"
            >
              X
            </button>
          </div>
        )}

        {/* Movie Info on Top of Poster */}
        {!isVideoPlaying && (
          <div className="absolute bottom-0 left-0 p-4 text-white z-30">
            <h1 className="text-4xl font-bold">
              {movie.title} ({new Date(movie.releaseDate).getFullYear()})
            </h1>
            <p className="text-lg flex items-center">
              Rating:
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`ml-1 ${i < movie.rating / 2 ? 'text-yellow-400' : 'text-gray-500'}`} />
              ))}
              <span className="ml-2">{movie.rating}/10</span>
            </p>
            {/* Favorite Button */}
            <button
              className={`mt-2 p-2 rounded-full min-h-8 w-fit ${isFavorite ? 'bg-red-600' : 'bg-gray-300'} flex items-center`}
              onClick={handleFavoriteToggle}
              onMouseEnter={() => !isFavorite && setIsFavorite(true)}
              onMouseLeave={() => !isFavorite && setIsFavorite(false)}
            >
              <FaHeart className={`mr-2  min-h-8 w-fit ${isFavorite ? 'text-white' : 'text-gray-600'}`} />
              Add to Favorites
            </button>
          </div>
        )}
      </div>

      {/* Movie Details Below */}
      {!isVideoPlaying && (
        <div className="p-4">
          <h2 className="text-2xl font-bold">Description</h2>
          <p>{movie.description}</p>

          <h3 className="text-xl font-bold mt-4">Cast & Crew</h3>
          <p><strong>Director:</strong> {movie.crew.director}</p>
          <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>

          {/* Add Your Rating Button */}
          <div className="mt-6">
            <button className="bg-green-500 p-2 min-h-8 w-fit rounded hover:bg-green-600 transition duration-300">
              Add Your Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovies } from '../../redux/user/userThunk';
import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa'; // Font Awesome Icons
import { AppDispatch, RootState } from '@/redux/store/store';

const MovieDetails = () => {
  const { id } = useParams();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { upcomingMovies, nowShowingMovies } = useSelector((state: RootState) => state.user);
  const movie = upcomingMovies.find((movie) => movie.id === id) || nowShowingMovies.find((movie) => movie.id === id);
  console.log(movie,"movie detais");
  
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (!movie) return <div>Movie not found</div>;

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite); 
  };

  let videoId = movie?.video_link.split('v=')[1];
  const ampersandPosition = videoId?.indexOf('&');
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const handleBookTicket = (movieId: string) => {
    navigate('/date-Shows', { state: { movieId } });
  };

  
  const getCastImage = (actorName: string) => {
    
    return `${TMDB_IMAGE_BASE_URL}${actorName.replace(" ", "_")}.jpg`;
  };

  return (
    <div className="movie-details-page relative bg-gray-100">
      
      <div className="absolute top-4 left-4 z-50">
        <button className="bg-gray-800 min-h-8 text-white p-2 rounded-full" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
      </div>

      
      <div className="relative">
        <img
          src={movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "/banner-img-brand.jpeg"}
          alt={movie.title}
          className={`w-full h-96 object-cover ${isVideoPlaying ? 'hidden' : ''}`}
          style={{ filter: 'brightness(50%)' }} 
        />

      
        {!isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="bg-red-600 min-h-10 text-white p-4 rounded-full"
              onClick={() => setIsVideoPlaying(true)} 
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
          <div className="flex flex-wrap gap-4 mt-2">
            {movie.cast.map((actor, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* <img
                  src={getCastImage(actor)}
                  alt={actor}
                  className="w-32 h-32 object-cover rounded-full"
                /> */}
                <p className="mt-2">{actor}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mt-4">Crew</h3>
          <p><strong>Director:</strong> {movie.crew.director}</p>
          <p><strong>Editor:</strong> {movie.crew.editor}</p>
          <p><strong>Cinematographer:</strong> {movie.crew.cinematographer}</p>
          <p><strong>Music Composer:</strong> {movie.crew.musicComposer}</p>
          <p><strong>Producer:</strong> {movie.crew.producer}</p>

          {/* Add Your Rating Button */}
          <div className="mt-6">
            <button className="bg-green-500 p-2 min-h-8 w-fit rounded hover:bg-green-600 transition duration-300">
              Add Your Rating
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button className="bg-red-500 text-gray-200 p-2 min-h-8 w-fit" onClick={() => handleBookTicket(movie.id ?? '')}>
              Book tickets
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;




// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa'; // Font Awesome Icons
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store/store';
// import { fetchMovies } from '@/redux/user/userThunk';

// const MovieDetails = () => {
//   const { id } = useParams();
//   const [movieDetails, setMovie] = useState<any>(null);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const navigate = useNavigate();

//   const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
//   const apiKey = 'de211859fbf9be075be8898c50affa35'; // Replace with your TMDB API key
//   const dispatch = useDispatch<AppDispatch>();


//   const { upcomingMovies, nowShowingMovies } = useSelector((state: RootState) => state.user);
//   const movie = upcomingMovies.find((movie) => movie.id === id) || nowShowingMovies.find((movie) => movie.id === id);

  

//   useEffect(() => {
//     dispatch(fetchMovies());
//   }, [dispatch]);

// useEffect(() => {
//     // Fetch movie details from TMDB API
//     const fetchMovieDetails = async () => {
//       try {
//         const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos`;
//         const { data } = await axios.get(movieDetailsUrl);

//         const movieData = {
//           ...data,
//           cast: data.credits.cast.slice(0, 10).map((actor: any) => ({
//             name: actor.name,
//             character: actor.character,
//             profile_path: actor.profile_path
//               ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
//               : '/default-profile.png',
//           })),
//           crew: data.credits.crew.slice(0, 10).map((crewMember: any) => ({
//             name: crewMember.name,
//             job: crewMember.job,
//             profile_path: crewMember.profile_path
//               ? `${TMDB_IMAGE_BASE_URL}${crewMember.profile_path}`
//               : '/default-profile.png',
//           })),
//           video: data.videos.results.find((video: any) => video.type === 'Trailer')?.key || '',
//         };
// console.log(movieData,"movieData in movieDetails");

//         setMovie(movieData);
//       } catch (error) {
//         console.error('Error fetching movie details:', error);
//       }
//     };

//     fetchMovieDetails();
//   }, [id]);

//   if (!movie) return <div>Loading...</div>;

//   const handleFavoriteToggle = () => {
//     setIsFavorite(!isFavorite); // Toggle favorite state
//   };

//   const embedUrl = `https://www.youtube.com/embed/${movie.video}?autoplay=1&controls=0`;

//   const handleBookTicket = () => {
//     navigate('/date-Shows', { state: { movieId: movie.id } });
//   };

//   return (
//     <div className="movie-details-page relative bg-gray-100">
//       {/* Back Button */}
//       <div className="absolute top-4 left-4 z-50">
//         <button className="bg-gray-800 min-h-8 text-white p-2 rounded-full" onClick={() => navigate(-1)}>
//           <FaArrowLeft size={20} />
//         </button>
//       </div>

//       {/* Movie Poster with Play Button */}
//       <div className="relative">
//         <img
//           src={movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "/banner-img-brand.jpeg"}
//           alt={movie.title}
//           className={`w-full h-96 object-cover ${isVideoPlaying ? 'hidden' : ''}`}
//           style={{ filter: 'brightness(50%)' }}
//         />

//         {/* Play Button and Trailer */}
//         {!isVideoPlaying && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <button
//               className="bg-red-600 min-h-10 text-white p-4 rounded-full"
//               onClick={() => setIsVideoPlaying(true)} // Play video
//             >
//               Play
//             </button>
//           </div>
//         )}

//         {isVideoPlaying && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black">
//             <iframe
//               width="100%"
//               height="100%"
//               src={embedUrl}
//               title={movie.title}
//               frameBorder="0"
//               allow="autoplay; fullscreen"
//               allowFullScreen
//               className="w-full h-screen object-cover"
//             ></iframe>

//             <button
//               onClick={() => setIsVideoPlaying(false)}
//               className="absolute top-4 right-4 min-h-8 bg-white text-black p-2 rounded-full font-bold text-lg"
//             >
//               X
//             </button>
//           </div>
//         )}

//         {/* Movie Info on Top of Poster */}
//         {!isVideoPlaying && (
//           <div className="absolute bottom-0 left-0 p-4 text-white z-30">
//             <h1 className="text-4xl font-bold">
//               {movie.title} ({new Date(movie.release_date).getFullYear()})
//             </h1>
//             <p className="text-lg flex items-center">
//               Rating:
//               {[...Array(5)].map((_, i) => (
//                 <FaStar key={i} className={`ml-1 ${i < movie.vote_average / 2 ? 'text-yellow-400' : 'text-gray-500'}`} />
//               ))}
//               <span className="ml-2">{movie.vote_average}/10</span>
//             </p>

//             {/* Favorite Button */}
//             <button
//               className={`mt-2 p-2 rounded-full min-h-8 w-fit ${isFavorite ? 'bg-red-600' : 'bg-gray-300'} flex items-center`}
//               onClick={handleFavoriteToggle}
//               onMouseEnter={() => !isFavorite && setIsFavorite(true)}
//               onMouseLeave={() => !isFavorite && setIsFavorite(false)}
//             >
//               <FaHeart className={`mr-2  min-h-8 w-fit ${isFavorite ? 'text-white' : 'text-gray-600'}`} />
//               Add to Favorites
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Movie Details Below */}
//       {!isVideoPlaying && (
//         <div className="p-4">
//           <h2 className="text-2xl font-bold">Description</h2>
//           <p>{movie.overview}</p>

//           <h3 className="text-xl font-bold mt-4">Cast</h3>
//           <div className="flex flex-wrap gap-4 mt-2">
//             {movie.cast.map((actor: any, index: number) => (
//               <div key={index} className="flex flex-col items-center">
//                 <img
//                   src={actor.profile_path}
//                   alt={actor.name}
//                   className="w-32 h-32 object-cover rounded-full"
//                 />
//                 <p className="mt-2">{actor.name}</p>
//                 <p className="text-sm">{actor.character}</p>
//               </div>
//             ))}
//           </div>

//           <h3 className="text-xl font-bold mt-4">Crew</h3>
//           <div>
//             {movie.crew.map((crewMember: any, index: number) => (
//               <p key={index}>
//                 <strong>{crewMember.job}:</strong> {crewMember.name}
//               </p>
//             ))}
//           </div>

//           <div className="flex items-center justify-center">
//             <button
//               className="bg-red-500 text-gray-200 p-2 min-h-8 w-fit"
//               onClick={handleBookTicket}
//             >
//               Book tickets
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MovieDetails;

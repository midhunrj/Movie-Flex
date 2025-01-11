import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovies, postRating } from '../../redux/user/userThunk';
import { FaStar, FaHeart, FaArrowLeft, FaAngleLeft, FaPlay, FaHandHoldingHeart } from 'react-icons/fa'; // Font Awesome Icons
import { AppDispatch, RootState } from '@/redux/store/store';
import {motion, AnimatePresence } from 'framer-motion';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { ClassNames } from '@emotion/react';
import { Slider } from '@mui/material';
import RatingModal from './ratingModal';
import { MovieType } from '@/types/movieTypes';
import { Favorite } from './FavouriteList';

const MovieDetails = () => {
  const { id } = useParams();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModelOpen,setIsModelOpen]=useState<boolean>(false)
  const [loading,setLoading]=useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { upcomingMovies, nowShowingMovies,user } = useSelector((state: RootState) => state.user);
  const movie = upcomingMovies.find((movie) => movie.id === id) || nowShowingMovies.find((movie) => movie.id === id);
  console.log(movie,"movie detais");

  const MovieTime=()=>{
   let hour= Math.floor(movie?.duration!/60)
   let min= movie?.duration!%60
     return `${hour}hr ${min}min`
  }
  const userId=user?._id!
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const fetchFavourites=async()=>{
  const response = await userAuthenticate.get<Favorite[]>('/favourites', { params: { userId } });
   console.log(response.data,"response from favourites",movie);
    if(response.data.some((mov)=>mov.movieId._id==movie?.id))
    {
      setIsFavorite(true)
    }
   
}
const handleRateMovie = async (movieId:string, rating:number) => {
  // const ratingData: ratingPayload = {
  //   userId, // Assuming `userId` is available in the component's scope
  //   movieId,
  //   rating,
  // };
  dispatch(postRating({movieId,userId,rating}))
  
  
  setIsModelOpen(false)
};
  useEffect(() => {
    window.scrollTo(0,0)
    dispatch(fetchMovies());
    fetchFavourites()
  
  }, [isModelOpen]);

   if (!movie) return <div>Movie not found</div>;

  const handleFavoriteToggle = async(movieId:string) => {
    setIsFavorite(!isFavorite); 
    if(!isFavorite)
    {
    await userAuthenticate.put('/add-favourite',{userId,movieId})
    }
    else
    {
      await userAuthenticate.delete('/remove-favourite',  {data:{ movieId, userId }})
    }
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

  const handleMovieNavigation=(movieId:string)=>{
   setLoading(true)
   window.scrollTo(0,0)
    navigate(`/movies/${movieId}`)
  }
   
  console.log(new Date,"date",movie.releaseDate,"releaseDate of movie")
const upcoming=new Date(movie.releaseDate)<new Date()?true:false
  const similarMovies = [...upcomingMovies, ...nowShowingMovies]
  .filter((m) => m.genre.some((g)=>(movie.genre.includes(g)) && m.id !== movie.id))
  .slice(0, 6)
  
  const getCastImage = (actorName: string) => {
    
    return `${TMDB_IMAGE_BASE_URL}${actorName.replace(" ", "_")}.jpg`;
  };

  return (
    <>
    
    <RatingModal
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        onSubmit={handleRateMovie}
        movieId={movie.id!}
      />
         <div className="movie-details-page relative bg-gray-100">
      
      <div className="absolute top-4 left-4 z-50">
        <button className="bg-gray-100 bg-opacity-80  min-h-8  h-fit text-opacity-100 text-slate-900 w-fit hover:text-gray-300 hover:bg-transparent p-2 rounded-md" onClick={() => navigate(-1)}>
          <FaAngleLeft size={30} />
        </button>
      </div>

      
      <div className="relative ">
      {!isVideoPlaying && (
        <div>
      <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute  top-7 right-3/4 transform -translate-x-1/2 z-30 w-72 h-96 shadow-2xl rounded-lg overflow-hidden"
        >
          
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/fallback-poster.jpg"}
            alt={`${movie.title} Poster`}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className='inset-y-0 left-0  bg-slate-950  backdrop-blur-lg '>
        <img
          src={movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "/banner-img-brand.jpeg"}
          alt={movie.title}
          className={`w-full h-[28rem]  object-fill ${isVideoPlaying ? 'hidden' : ''}`}
          style={{ filter: 'brightness(50%)' }} 
        /></div>
        


            {/* <div className="absolute inset-0 z-30    flex justify-center right-1/4 top-[22rem] ">
            <button className="bg-[#FF3C38] min-h-12 text-xl p-2 shadow-lg  rounded-lg  text-gray-200   w-48" style={{cursor:"pointer"}} onClick={() => handleBookTicket(movie.id ?? '')}>
              Book tickets
            </button>
          </div> */}
        <div className="absolute inset-0 z-30 flex items-center left-48">
            <button
              className="bg-gradient-to-r from-transparent border  hover:105 border-white min-h-8 w-fit text-white px-4 py-1 rounded-md"
              onClick={() => setIsVideoPlaying(true)} 
            >
              <div></div>play trailer
            </button>
          </div>
          </div>
        )}
      

          

        {/* {isVideoPlaying && (
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
        )} */}

{isVideoPlaying && (
          <div className="absolute inset-x-0 flex items-center justify-center bg-black">
            <iframe
              // width="100%"
              // height="100%"
              src={`${embedUrl}?autoplay=1`}
              title={movie.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-screen"
            ></iframe>
            <button
              className="absolute top-4  min-h-8 right-4 bg-white text-black p-2 rounded-full font-bold text-lg"
              onClick={() => setIsVideoPlaying(false)}
            >
              X
            </button>
          </div>
        )}
      

      {/* (
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
        )} */}

        
        {!isVideoPlaying && (
          <div className="absolute top-28 left-1/4 p-4 flex gap-2 flex-col text-white z-30">
            <h1 className="text-4xl font-bold">
              {movie.title} ({new Date(movie.releaseDate).getFullYear()})
            </h1>
            <p className="text-lg flex p-2 w-fit  bg-gray-600 bg-opacity-50 space-x-6 text-center items-center">
              Rating:
              {
                <FaStar  size={26} className={`ml-1 ${ movie.rating  ? 'text-red-500' : 'text-gray-500'}`} />
              }
              <span className="ml-2">{movie.rating}/10</span>

              <button className='p-2 bg-white min-h-8 w-fit h-fit text-base  text-slate-950' onClick={()=>setIsModelOpen(true)}> Rate Now</button>
            </p>
            <p className='space-x-4 text-base  text-slate-100'> <span>{MovieTime()}</span>  <span>{movie.genre.join(',')}</span>   <span> {new Date(movie.releaseDate).toDateString()}</span></p>

            {/* Favorite Button */}
            
          </div>
        )}
      </div>

      {/* Movie Details Below */}
      {!isVideoPlaying && (
        <>
        <div className='absolute z-40 bg-slate-200 shadow-md flex mx-8 justify-start space-x-2'>
            <button
  className={`mt-2 p-2 rounded-lg min-h-8 w-fit text-gray-100 ${isFavorite ? 'bg-gradient-to-br from-indigo-600 to-red-600' : 'bg-red-600'} flex items-center cursor-pointer`}
  onClick={() => handleFavoriteToggle(movie.id!)}
>
  <FaHeart size={10} className={`mr-2 ${isFavorite ? 'text-red-600' : 'text-slate-200'}`} />
  {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
</button>
</div>
        <div className="mt-12 p-4">
          
          <h2 className="text-2xl font-bold">Description</h2>
          <p>{movie.description}</p>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Cast</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-center">
              {movie.cast.map((actor: any, index: number) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={actor.image || '/fallback_profile.jpg'}
                    alt={actor.name}
                    className="w-24 h-24 object-cover rounded-full mb-2 shadow-md"
                  />
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-sm text-gray-600">{actor.character}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Crew Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Crew</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 justify-center">
              {movie.crew.map((member: any, index: number) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={member.image || '/fallback_profile.jpg'}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded-full mb-2 shadow-md"
                  />
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.job}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
          {/* Add Your Rating Button */}
          <div className="mt-6 flex justify-center">
            <button className="bg-green-500 p-2 min-h-8 w-fit h-fit rounded hover:bg-green-600 transition duration-300 cursor-pointer" onClick={()=>setIsModelOpen(true)}>
              Add Your Rating
            </button>
          </div>
          <div className="absolute inset-0 z-30 h-20 flex justify-center right-1/4 top-[19rem]  pointer-events-auto ">
            {upcoming?<button className="bg-[#FF3C38] min-h-12 text-xl p-2 shadow-lg  rounded-lg  text-gray-200   w-48" style={{cursor:"pointer"}} onClick={() => handleBookTicket(movie.id ?? '')}>
              Book tickets
            </button>
            :<button
            className="bg-[#006BFF]  min-h-12 text-xl px-6 py-3 shadow-lg rounded-lg text-gray-100 w-48 flex justify-center items-center gap-2 transition-all duration-300"
            style={{ cursor: "pointer" }}
          >
            <FaHeart size={10} />
            I'm Interested
          </button>}
          </div>
         
          <div className="p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <div className=" mx-20 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-10">
          {similarMovies.slice(0,4).map((similarMovie) => (
            <div key={similarMovie.id} className="shadow-lg rounded-lg overflow-hidden">
              <img
                src={similarMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${similarMovie.poster_path}` : "/fallback-poster.jpg"}
                alt={similarMovie.title}
                className="w-full h-80 object-cover cursor-pointer" onClick={() => navigate(`/movies/${similarMovie.id}`)}
              />
              <div className="p-2 cursor-pointer ">
                <h3 className="text-lg font-bold overflow-visible">{similarMovie.title}</h3>
                <div className='flex  items-end align-text-bottom justify-end'>
                <button
                  className="text-sm cursor-pointer text-blue-500 mt-1"
                  onClick={() => handleMovieNavigation(similarMovie.id!)} >
                  View Details
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        </div>
        </>
      )}
    </div>
    </>
  );
};

export default MovieDetails;





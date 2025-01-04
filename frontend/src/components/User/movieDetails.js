import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovies, postRating } from '../../redux/user/userThunk';
import { FaStar, FaHeart, FaAngleLeft } from 'react-icons/fa'; // Font Awesome Icons
import { motion } from 'framer-motion';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import RatingModal from './ratingModal';
const MovieDetails = () => {
    const { id } = useParams();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { upcomingMovies, nowShowingMovies, user } = useSelector((state) => state.user);
    const movie = upcomingMovies.find((movie) => movie.id === id) || nowShowingMovies.find((movie) => movie.id === id);
    console.log(movie, "movie detais");
    const MovieTime = () => {
        let hour = Math.floor(movie?.duration / 60);
        let min = movie?.duration % 60;
        return `${hour}hr ${min}min`;
    };
    const userId = user?._id;
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const fetchFavourites = async () => {
        const response = await userAuthenticate.get('/favourites', { params: { userId } });
        console.log(response.data, "response from favourites", movie);
        if (response.data.some((mov) => mov.movieId._id == movie?.id)) {
            setIsFavorite(true);
        }
    };
    const handleRateMovie = async (movieId, rating) => {
        // const ratingData: ratingPayload = {
        //   userId, // Assuming `userId` is available in the component's scope
        //   movieId,
        //   rating,
        // };
        dispatch(postRating({ movieId, userId, rating }));
        setIsModelOpen(false);
    };
    useEffect(() => {
        dispatch(fetchMovies());
        fetchFavourites();
    }, [isModelOpen]);
    if (!movie)
        return _jsx("div", { children: "Movie not found" });
    const handleFavoriteToggle = async (movieId) => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            await userAuthenticate.put('/add-favourite', { userId, movieId });
        }
        else {
            await userAuthenticate.delete('/remove-favourite', { data: { movieId, userId } });
        }
    };
    let videoId = movie?.video_link.split('v=')[1];
    const ampersandPosition = videoId?.indexOf('&');
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const handleBookTicket = (movieId) => {
        navigate('/date-Shows', { state: { movieId } });
    };
    const handleMovieNavigation = (movieId) => {
        setLoading(true);
        window.scrollTo(0, 0);
        navigate(`/movies/${movieId}`);
    };
    console.log(new Date, "date", movie.releaseDate, "releaseDate of movie");
    const upcoming = new Date(movie.releaseDate) < new Date() ? true : false;
    const similarMovies = [...upcomingMovies, ...nowShowingMovies]
        .filter((m) => m.genre.some((g) => (movie.genre.includes(g)) && m.id !== movie.id))
        .slice(0, 6);
    const getCastImage = (actorName) => {
        return `${TMDB_IMAGE_BASE_URL}${actorName.replace(" ", "_")}.jpg`;
    };
    return (_jsxs(_Fragment, { children: [_jsx(RatingModal, { isOpen: isModelOpen, onClose: () => setIsModelOpen(false), onSubmit: handleRateMovie, movieId: movie.id }), _jsxs("div", { className: "movie-details-page relative bg-gray-100", children: [_jsx("div", { className: "absolute top-4 left-4 z-50", children: _jsx("button", { className: "bg-gray-100 bg-opacity-80  min-h-8  h-fit text-opacity-100 text-slate-900 w-fit hover:text-gray-300 hover:bg-transparent p-2 rounded-md", onClick: () => navigate(-1), children: _jsx(FaAngleLeft, { size: 30 }) }) }), _jsxs("div", { className: "relative ", children: [!isVideoPlaying && (_jsxs("div", { children: [_jsx(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "absolute  top-7 right-3/4 transform -translate-x-1/2 z-30 w-72 h-96 shadow-2xl rounded-lg overflow-hidden", children: _jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/fallback-poster.jpg", alt: `${movie.title} Poster`, className: "w-full h-full object-cover" }) }), _jsx("div", { className: 'inset-y-0 left-0  bg-slate-950  backdrop-blur-lg ', children: _jsx("img", { src: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : "/banner-img-brand.jpeg", alt: movie.title, className: `w-full h-[28rem]  object-fill ${isVideoPlaying ? 'hidden' : ''}`, style: { filter: 'brightness(50%)' } }) }), _jsx("div", { className: "absolute inset-0 z-30 flex items-center left-48", children: _jsxs("button", { className: "bg-gradient-to-r from-transparent border  hover:105 border-white min-h-8 w-fit text-white px-4 py-1 rounded-md", onClick: () => setIsVideoPlaying(true), children: [_jsx("div", {}), "play trailer"] }) })] })), isVideoPlaying && (_jsxs("div", { className: "absolute inset-x-0 flex items-center justify-center bg-black", children: [_jsx("iframe", { 
                                        // width="100%"
                                        // height="100%"
                                        src: `${embedUrl}?autoplay=1`, title: movie.title, allow: "autoplay; fullscreen", allowFullScreen: true, className: "w-full h-screen" }), _jsx("button", { className: "absolute top-4  min-h-8 right-4 bg-white text-black p-2 rounded-full font-bold text-lg", onClick: () => setIsVideoPlaying(false), children: "X" })] })), !isVideoPlaying && (_jsxs("div", { className: "absolute top-28 left-1/4 p-4 flex gap-2 flex-col text-white z-30", children: [_jsxs("h1", { className: "text-4xl font-bold", children: [movie.title, " (", new Date(movie.releaseDate).getFullYear(), ")"] }), _jsxs("p", { className: "text-lg flex p-2 w-fit bg-gray-600 bg-opacity-50 space-x-3 text-center items-center", children: ["Rating:", _jsx(FaStar, { size: 26, className: `ml-1 ${movie.rating ? 'text-red-500' : 'text-gray-500'}` }), _jsxs("span", { className: "ml-2", children: [movie.rating, "/10"] }), _jsx("button", { className: 'p-3 bg-white  w-fit h-fit text-lg text-slate-950', onClick: () => setIsModelOpen(true), children: " Rate Now" })] }), _jsxs("p", { className: 'space-x-4 text-base  text-slate-100', children: [" ", _jsx("span", { children: MovieTime() }), "  ", _jsx("span", { children: movie.genre.join(',') }), "   ", _jsxs("span", { children: [" ", new Date(movie.releaseDate).toDateString()] })] })] }))] }), !isVideoPlaying && (_jsxs(_Fragment, { children: [_jsx("div", { className: 'absolute z-40 bg-slate-200 shadow-md flex mx-8 justify-start space-x-2', children: _jsxs("button", { className: `mt-2 p-2 rounded-lg min-h-8 w-fit text-gray-100 ${isFavorite ? 'bg-gradient-to-br from-indigo-600 to-red-600' : 'bg-red-600'} flex items-center cursor-pointer`, onClick: () => handleFavoriteToggle(movie.id), children: [_jsx(FaHeart, { size: 10, className: `mr-2 ${isFavorite ? 'text-red-600' : 'text-slate-200'}` }), isFavorite ? 'Added to Favorites' : 'Add to Favorites'] }) }), _jsxs("div", { className: "mt-12 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Description" }), _jsx("p", { children: movie.description }), _jsxs(motion.section, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Cast" }), _jsx("div", { className: "grid grid-cols-3 md:grid-cols-6 gap-4 justify-center", children: movie.cast.map((actor, index) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "flex flex-col items-center text-center", children: [_jsx("img", { src: actor.image || '/fallback_profile.jpg', alt: actor.name, className: "w-24 h-24 object-cover rounded-full mb-2 shadow-md" }), _jsx("p", { className: "font-semibold", children: actor.name }), _jsx("p", { className: "text-sm text-gray-600", children: actor.character })] }, index))) })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.7 }, className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Crew" }), _jsx("div", { className: "grid grid-cols-3 md:grid-cols-6 gap-2 justify-center", children: movie.crew.map((member, index) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "flex flex-col items-center text-center", children: [_jsx("img", { src: member.image || '/fallback_profile.jpg', alt: member.name, className: "w-24 h-24 object-cover rounded-full mb-2 shadow-md" }), _jsx("p", { className: "font-semibold", children: member.name }), _jsx("p", { className: "text-sm text-gray-600", children: member.job })] }, index))) })] }), _jsx("div", { className: "mt-6 flex justify-center", children: _jsx("button", { className: "bg-green-500 p-2 min-h-8 w-fit rounded hover:bg-green-600 transition duration-300 cursor-pointer", onClick: () => setIsModelOpen(true), children: "Add Your Rating" }) }), _jsx("div", { className: "absolute inset-0 z-30 h-20 flex justify-center right-1/4 top-[19rem]  pointer-events-auto ", children: upcoming ? _jsx("button", { className: "bg-[#FF3C38] min-h-12 text-xl p-2 shadow-lg  rounded-lg  text-gray-200   w-48", style: { cursor: "pointer" }, onClick: () => handleBookTicket(movie.id ?? ''), children: "Book tickets" })
                                            : _jsxs("button", { className: "bg-[#006BFF]  min-h-12 text-xl px-6 py-3 shadow-lg rounded-lg text-gray-100 w-48 flex justify-center items-center gap-2 transition-all duration-300", style: { cursor: "pointer" }, children: [_jsx(FaHeart, { size: 10 }), "I'm Interested"] }) }), _jsxs("div", { className: "p-4 mt-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "You May Also Like" }), _jsx("div", { className: " mx-20 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-10", children: similarMovies.slice(0, 4).map((similarMovie) => (_jsxs("div", { className: "shadow-lg rounded-lg overflow-hidden", children: [_jsx("img", { src: similarMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${similarMovie.poster_path}` : "/fallback-poster.jpg", alt: similarMovie.title, className: "w-full h-80 object-cover cursor-pointer", onClick: () => navigate(`/movies/${similarMovie.id}`) }), _jsxs("div", { className: "p-2 cursor-pointer ", children: [_jsx("h3", { className: "text-lg font-bold overflow-visible", children: similarMovie.title }), _jsx("div", { className: 'flex  items-end align-text-bottom justify-end', children: _jsx("button", { className: "text-sm cursor-pointer text-blue-500 mt-1", onClick: () => handleMovieNavigation(similarMovie.id), children: "View Details" }) })] })] }, similarMovie.id))) })] })] })] }))] })] }));
};
export default MovieDetails;

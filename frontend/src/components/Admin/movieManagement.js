import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
//import axiosRetry, { exponentialDelay } from 'axios-retry'
import SidebarMenu from './sidebarMenu';
import { useDispatch } from 'react-redux';
import { addMovie } from '../../redux/admin/adminThunk';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { tmdbApiKey } from '@/utils/axios/config/urlConfig';
//axiosRetry(axios,{retries:3,retryDelay:axiosRetry.exponentialDelay})
const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const dispatch = useDispatch();
    const fetchMovies = async (page, languages, genres, searchQuery, sortBy) => {
        try {
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&page=${page}&sort_by=${sortBy}`;
            if (searchQuery) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${searchQuery}&page=${page}`;
            }
            else {
                if (languages.length > 0) {
                    url += `&with_original_language=${languages.join('|')}`;
                }
                if (genres.length > 0) {
                    url += `&with_genres=${genres.join(',')}`;
                }
            }
            // const axiosConfig={
            //   timeout:60000
            // }
            const response = await axios.get(url);
            setMovies(response.data.results);
        }
        catch (error) {
            console.error('Error fetching movies:', error);
        }
    };
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'hi', name: 'Hindi' }
    ];
    const genres = [
        { id: '28', name: 'Action' },
        { id: '35', name: 'Comedy' },
        { id: '18', name: 'Drama' }
    ];
    useEffect(() => {
        fetchMovies(currentPage, selectedLanguages, selectedGenres, searchTerm, sortBy);
    }, [currentPage, selectedLanguages, selectedGenres, searchTerm, sortBy]);
    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const toggleLanguage = (language) => {
        setSelectedLanguages((prev) => prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]);
        setCurrentPage(1);
    };
    const toggleGenre = (genre) => {
        setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
        setCurrentPage(1);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };
    //   {
    //     data: { /* actual data returned by the API */ },
    //     status: 200,
    //     statusText: 'OK',
    //     headers: { /* response headers */ },
    //     config: { /* request configuration */ },
    //     request: { /* request object */ },
    //   }
    const handleAddMovie = async (movie) => {
        try {
            let movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&append_to_response=credits,videos`;
            const { data: movieDetails } = await axios.get(movieDetailsUrl);
            console.log(movieDetails, "movies data including every detals");
            // Extract specific crew roles (like director, producer, etc.)
            // const director = movieDetails.credits.crew.find((crew:any) => crew.job === 'Director')?.name || 'N/A';
            // const producer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Producer')?.name || 'N/A';
            // const cinematographer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Director of Photography')?.name || 'N/A';
            // const editor = movieDetails.credits.crew.find((crew:any) => crew.job === 'Editor')?.name || 'N/A';
            // const musicComposer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Original Music Composer')?.name || 'N/A';
            const languageMapping = {
                ta: 'Tamil',
                ml: 'Malayalam',
                hi: 'Hindi',
                te: 'Telugu',
                en: 'English',
                ka: 'Kannada'
            };
            const originalLanguage = languageMapping[movieDetails.original_language] || movieDetails.original_language;
            const cast = movieDetails.credits.cast.slice(0, 5).map((actor) => ({
                name: actor.name,
                character: actor.character,
                image: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/uploads/fallback_profile.jpeg', // Include profile image
            }));
            const keyCrewJobs = [
                'Director',
                'Producer',
                'Director of Photography',
                'Editor',
                'Original Music Composer',
                'Writer',
                'Production Designer',
            ];
            const crew = keyCrewJobs.map((job) => {
                let tempJob = job;
                if (tempJob === 'Original Music Composer') {
                    tempJob = 'Music director';
                }
                const member = movieDetails.credits.crew.find((crew) => crew.job === job);
                return member ? { name: member.name, job: tempJob, image: member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path || ''}` : '/uploads/fallback_profile.jpeg' } : null;
            }).filter((member) => member !== null);
            let videoLink = movieDetails.videos.results.find((video) => video.type === 'Trailer')?.key || '';
            if (!videoLink) {
                videoLink = 'default_trailer_link'; // replace with your default link
            }
            const movieData = {
                movie_id: movieDetails.id, // Movie ID from the API
                title: movieDetails.title, // Movie title
                description: movieDetails?.description,
                language: originalLanguage, // Original language of the movie
                overview: movieDetails.overview, // Movie overview/description
                releaseDate: movieDetails.release_date, // Release date
                popularity: movieDetails.popularity, // Movie popularity
                rating: movieDetails.vote_average, // Average rating
                genre: movieDetails.genres.map((genr) => genr.name), // Array of genre names
                video_link: `https://www.youtube.com/watch?v=${videoLink}`, // Trailer video link (YouTube link)
                runtime: movieDetails.runtime, // Movie runtime in minutes
                backdrop_path: movieDetails.backdrop_path, // Backdrop image path
                poster_path: movieDetails.poster_path, // Poster image path
                cast, // Top 5 cast members
                // crew: {
                //   director,
                //   producer,
                //   cinematographer,
                //   editor,
                //   musicComposer
                // },  
                crew,
                vote_average: movieDetails?.vote_average,
                duration: movieDetails?.duration,
                isApproved: true,
                is_blocked: false,
                createdAt: new Date()
            };
            dispatch(addMovie(movieData));
            toast.success(`Movie "${movie.title}" added successfully!`);
        }
        catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie.');
        }
    };
    return (_jsx("div", { children: _jsxs(SidebarMenu, { children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h1", { className: "text-blue-500 text-nowrap font-bold", children: "Movie List" }) }), _jsx("div", { className: 'flex justify-end ', children: _jsx(Link, { to: '/admin/running-movies', className: 'bg-orange-400 rounded text-sm p-2  text-slate-1000 hover:bg-green-700 hover:text-white hover:text-md transition-all  border-collapse ', children: "New releases" }) }), _jsxs("div", { className: "mt-4 flex justify-between", children: [_jsxs("div", { className: 'flex-grow', children: [_jsx("label", { className: "block text-gray-700", children: "Search for Movies:" }), _jsx("input", { type: "text", value: searchTerm, onChange: handleSearchChange, className: "mt-2 p-2 border border-gray-300 rounded", placeholder: "Search by title..." })] }), _jsxs("div", { className: "flex  mt-4  items-center space-x-4", children: [_jsxs("div", { className: 'relative w-full', children: [_jsx("button", { onClick: () => setShowLanguageDropdown(!showLanguageDropdown), className: "p-2 border  border-gray-300 rounded min-h-12  bg-white text-gray-700 w-40", children: "Select Languages" }), _jsx("div", { className: `absolute z-10 mt-2 p-4 w-full border border-gray-300 bg-white rounded shadow-lg grid  gap-2 transition-all duration-300 ease-in-out ${showLanguageDropdown ? 'block' : 'hidden'}`, children: languages.map(({ code, name }) => (_jsx("button", { onClick: () => toggleLanguage(code), className: `p-2 min-h-8 rounded w-full ${selectedLanguages.includes(code) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, children: name }, code))) })] }), _jsxs("div", { className: "relative space-x-4 w-full", children: [_jsx("button", { onClick: () => setShowGenreDropdown(!showGenreDropdown), className: "p-2 border min-h-12 border-gray-300 rounded bg-white text-gray-700 w-full", children: "Select Genres" }), _jsx("div", { className: `absolute z-10 mt-2 p-4 border border-gray-300 bg-white rounded shadow-lg grid  gap-2 transition-all duration-300 ease-in-out ${showGenreDropdown ? 'block' : 'hidden'}`, children: genres.map(({ id, name }) => (_jsx("button", { onClick: () => toggleGenre(id), className: `p-2 min-h-8 rounded ${selectedGenres.includes(id) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, children: name }, id))) })] }), _jsx("div", { className: "relative w-full space-x-4", children: _jsxs("select", { value: sortBy, onChange: handleSortChange, className: " p-2 border min-h-12 border-gray-300 rounded bg-white", children: [_jsx("option", { value: "popularity.desc", children: "Most Popular" }), _jsx("option", { value: "release_date.desc", children: "New Releases" }), _jsx("option", { value: "release_date.asc", children: "Upcoming Releases" }), _jsx("option", { value: "vote_average.desc", children: "Highest Rated" })] }) })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6", children: movies.length > 0 ? (movies.map((movie) => (_jsxs("div", { className: "border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg", children: [_jsx("img", { src: `https://image.tmdb.org/t/p/w300${movie.poster_path}`, alt: movie.title, className: "w-full h-72 object-cover rounded-md" }), _jsx("h2", { className: "text-lg font-bold mt-4", children: movie.title }), _jsxs("p", { className: "text-gray-600 mt-2", children: [movie.overview.substring(0, 100), "..."] }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Release Date:", movie?.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'] }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Rating: ", movie?.vote_average] }), _jsx("button", { onClick: () => handleAddMovie(movie), className: "mt-2 min-h-8 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600", children: "Add Movie" })] }, movie.id)))) : (_jsx("p", { className: "col-span-4 text-center", children: "No movies found" })) }), _jsxs("div", { className: "flex justify-center mt-8", children: [_jsx("button", { onClick: handlePreviousPage, disabled: currentPage === 1, className: "px-4 py-2 mx-2 min-h-8 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-800", children: "Previous" }), _jsx("span", { className: "px-6 py-1 mx-2 min-h-8 bg-blue-700 rounded cursor-pointer text-white", children: currentPage }), _jsx("button", { onClick: handleNextPage, className: "px-4 py-2 mx-2 min-h-8 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-800", children: "Next" })] })] }) }));
};
export default MovieList;

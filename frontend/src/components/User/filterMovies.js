import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../../redux/user/userThunk"; // Adjust your path for fetching movies
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "./footer";
const FullMoviesList = ({ movieType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { nowShowingMovies = [], upcomingMovies = [], isSuccess, isLoading, nowShowingMoviesCount, upcomingMoviesCount } = useSelector((state) => state.user);
    const [movies, setMovies] = useState([]);
    const [movieCount, setMovieCount] = useState(null);
    const [filterLanguage, setFilterLanguage] = useState("");
    const [filterGenre, setFilterGenre] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 8;
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    useEffect(() => {
        console.log("jhfjh");
        window.scrollTo(0, 0);
        dispatch(fetchMovies({
            page: currentPage,
            language: filterLanguage,
            genre: filterGenre,
            searchQuery,
            sortBy
        }));
    }, [currentPage, filterGenre, filterLanguage, searchQuery, sortBy]);
    useEffect(() => {
        console.log("skjhfh");
        if (movieType === "now-showing") {
            setMovies(nowShowingMovies);
            setMovieCount(nowShowingMoviesCount);
        }
        else if (movieType === "upcoming") {
            setMovies(upcomingMovies);
            setMovieCount(upcomingMoviesCount);
        }
    }, [movieType, upcomingMovies, nowShowingMovies, currentPage]);
    const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
    const handleMovieClick = (id) => {
        navigate(`/movies/${id}`);
    };
    const handleFilterLanguage = (e) => { setFilterLanguage(e.target.value); setCurrentPage(1); };
    const handleFilterGenre = (e) => { setFilterGenre(e.target.value); setCurrentPage(1); };
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        const sortedMovies = [...movies];
        if (e.target.value === "releaseDate") {
            sortedMovies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        }
        else if (e.target.value === "rating") {
            sortedMovies.sort((a, b) => b.rating - a.rating);
        }
        else if (e.target.value === "popularity") {
            sortedMovies.sort((a, b) => b.popularity - a.popularity);
        }
        setMovies(sortedMovies);
    };
    console.log(movies, "movies in pagination");
    const filteredMovies = movies
        .filter((movie) => (filterLanguage ? movie.language === filterLanguage : true))
        .filter((movie) => (filterGenre ? movie.genre.includes(filterGenre) : true))
        .filter((movie) => (searchQuery ? movie.title.toLowerCase().includes(searchQuery.toLowerCase()) : true));
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    console.log(filteredMovies, "filtered movies", currentMovies, "current movies in ghghg");
    const totalPages = Math.ceil(movieCount / moviesPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "flex items-center justify-between bg-blue-950  p-4 text-white", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "movielogo 2.jpeg", alt: "Movie Site Logo", className: "h-12 w-12 mr-4" }), _jsx("h1", { className: "text-2xl font-bold", children: "Movie Flex" })] }), _jsxs("div", { className: "flex space-x-8", children: [_jsx(Link, { to: "/", className: "hover:bg-amber-400 px-4 py-2 rounded", children: "Home" }), _jsx(Link, { to: "/profile", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Profile" }), _jsx(Link, { to: "/orders", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Your Orders" }), _jsx(Link, { to: "/favourites", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Favourites" }), _jsx(Link, { to: "#", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Shows" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search", value: searchQuery, className: "p-2 rounded bg-gray-700 text-white pl-10", onChange: handleSearchChange }), _jsx(BiSearch, { className: "absolute left-2 top-2 text-gray-300", size: 24 })] })] }), _jsxs("div", { className: "p-4  bg-gray-100", children: [_jsxs("div", { className: "flex justify-between mb-4", children: [_jsxs("div", { className: "flex justify-start gap-6", children: [_jsxs("select", { value: filterLanguage, onChange: handleFilterLanguage, className: "p-2 bg-white rounded shadow", children: [_jsx("option", { value: "", children: "All Languages" }), _jsx("option", { value: "English", children: "English" }), _jsx("option", { value: "Malayalam", children: "Malayalam" }), _jsx("option", { value: "Tamil", children: "Tamil" }), _jsx("option", { value: "Telugu", children: "Telugu" }), _jsx("option", { value: "Hindi", children: "Hindi" }), _jsx("option", { value: "Spanish", children: "Spanish" })] }), _jsxs("select", { value: filterGenre, onChange: handleFilterGenre, className: "p-2  flex  bg-white rounded shadow", children: [_jsx("option", { value: "", children: "All Genres" }), _jsx("option", { value: "Action", children: "Action" }), _jsx("option", { value: "Drama", children: "Drama" }), _jsx("option", { value: "Comedy", children: "Comedy" })] })] }), _jsxs("select", { value: sortBy, onChange: handleSortChange, className: "p-2 bg-white rounded shadow", children: [_jsx("option", { value: "releaseDate", children: "Release Date" }), _jsx("option", { value: "rating", children: "Rating" }), _jsx("option", { value: "popularity", children: "Popularity" })] })] }), isLoading ? (_jsx("div", { className: "grid grid-cols-4 gap-12", children: [...Array(8)].map((_, index) => (_jsx(Skeleton, { height: 400, width: 250 }, index))) })) : filteredMovies.length > 0 ? (_jsx("div", { className: "grid grid-cols-4 gap-12", children: filteredMovies.map((movie) => (_jsxs("div", { className: "text-center", onClick: () => handleMovieClick(movie?.id ?? ''), children: [_jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "banner img brand.jpeg", alt: movie.title, className: "w-96 h-72 object-cover rounded-lg hover:scale-105 transition-transform" }), _jsx("p", { className: "mt-2 text-lg font-semibold", children: movie.title }), _jsxs("p", { className: "text-sm text-gray-600", children: [movie.rating > 0 ? `Rating: ${movie.rating}` : "Popular", " "] })] }, movie._id))) })) : (_jsxs("div", { className: "flex justify-center items-center flex-col", children: [_jsx("img", { src: "https://via.placeholder.com/150?text=No+Upcoming+Movies", alt: "No Upcoming Movies", className: "w-48 h-48 mb-4" }), _jsx("p", { className: "text-xl font-semibold text-gray-700", children: "No  movies available at this time" })] })), _jsx("div", { className: "flex justify-end mt-8", children: movieType === "now-showing" ? (_jsx("button", { className: "bg-blue-500 min-h-12 w-fit text-white px-4 py-2 rounded-lg hover:bg-blue-600", onClick: () => navigate("/upcoming-movies"), children: "View Upcoming Movies" })) : (_jsx("button", { className: "bg-blue-500 min-h-12 w-fit text-white px-4 py-2 rounded-lg hover:bg-blue-600", onClick: () => navigate("/now-showing"), children: "View Now Showing Movies" })) }), _jsxs("div", { className: "flex justify-center mt-8 space-x-2", children: [_jsx("button", { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, className: `px-4 py-2 rounded-lg min-h-8 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Previous" }), Array.from({ length: totalPages }, (_, index) => (_jsx("button", { onClick: () => paginate(index + 1), className: `px-4 py-2 rounded-lg min-h-8 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`, children: index + 1 }, index + 1))), _jsx("button", { onClick: () => paginate(currentPage + 1), disabled: currentPage === totalPages, className: `px-4 py-2 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Next" })] })] }), _jsx(Footer, {})] }));
};
export default FullMoviesList;

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarMenu from './sidebarMenu';
import { Link } from 'react-router-dom';
import { blockMovie, deleteMovie, fetchMovies } from '../../redux/admin/adminThunk';
import Swal from 'sweetalert2';
import './css/login.css';
const RunningMovies = () => {
    const dispatch = useDispatch();
    const { movies, isError, isSuccess, isLoading } = useSelector((state) => state.admin);
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images
    const [selectedMovie, setSelectedMovie] = useState(null);
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
                confirmButton: 'swal2-confirm-btn', // Custom class for confirm button
                cancelButton: 'swal2-cancel-btn', // Custom class for cancel button
            }
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteMovie(movieId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your movie has been deleted.',
                    icon: 'success',
                    customClass: {
                        confirmButton: 'swal2-confirm-btn' // Custom class for success message button
                    }
                });
            }
        });
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
                        confirmButton: 'swal2-confirm-btn' // Custom class for success message button
                    }
                });
            }
        });
    };
    return (_jsx(_Fragment, { children: _jsxs(SidebarMenu, { children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h1", { className: "text-blue-500 font-bold text-wrap", children: "Running Movies" }) }), _jsx("div", { className: 'flex justify-end ', children: _jsx(Link, { to: '/admin/movies', className: 'bg-lime-500 rounded text-sm p-2  text-slate-100 hover:bg-green-700 hover:text-white hover:text-md transition-all  border-collapse ', children: "Add Movie" }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6", children: isLoading ? (_jsx("p", { children: "Loading movies..." })) : isError ? (_jsx("p", { className: "text-red-500", children: "Error loading movies" })) : movies.length > 0 ? (movies.map((movie, index) => (_jsxs("div", { className: "bg-white shadow-md rounded-lg p-4 flex flex-col justify-between", children: [_jsxs("div", { className: 'relative', children: [_jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg', alt: movie.title, className: "w-full h-72 object-cover rounded-md mb-4" }), movie.video_link && movie.video_link.includes('youtube.com') && (_jsx("div", { className: "absolute  inset-0 z-10 flex items-center justify-center ", children: _jsx("button", { onClick: () => setSelectedMovie(movie), className: "text-white bg-black bg-opacity-40 hover:bg-opacity-50 transition-all font-bold  border border-white p-2 h-fit rounded-lg w-fit  text-sm mt-2", children: "play Trailer" }) })), _jsx("h2", { className: "text-lg font-bold text-gray-800 mb-2", children: movie.title }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Language: ", movie.language] }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Release Date: ", new Date(movie.releaseDate).toDateString()] }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Rating: ", movie.rating] })] }), _jsxs("div", { className: "mt-4 flex justify-between", children: [_jsx("button", { onClick: () => handleBlock(movie.movie_id, movie?.is_blocked), className: "bg-blue-500  text-slate-200 hover:underline text-sm min-h-8 hover:text-white hover:scale-105 hover:bg-blue-800 transition-all   p-2", children: movie.is_blocked ? 'Unblock' : 'Block' }), _jsx("button", { onClick: () => handleDelete(movie.id ?? ''), className: "bg-red-500 hover:underline text-sm text-slate-200 min-h-8  hover:text-white hover:scale-105 hover:bg-red-700 transition-all p-2", children: "Delete" })] })] }, movie.id || index)))) : (_jsx("p", { children: "No movies found." })) }), selectedMovie && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-4 rounded-lg max-w-lg w-full relative", children: [_jsx("button", { onClick: () => setSelectedMovie(null), className: "absolute top-2 right-2 text-gray-600 hover:text-black", children: "\u00D7" }), _jsxs("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: [selectedMovie.title, " - Trailer"] }), _jsx("iframe", { className: "w-full h-64", src: getYouTubeEmbedUrl(selectedMovie.video_link), frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, title: selectedMovie.title })] }) }))] }) }));
};
export default RunningMovies;

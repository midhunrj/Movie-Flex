import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { addMoviesToScreen, fetchMovies } from '../../redux/theatre/theatreThunk';
import TheatreHeader from './TheatreHeader';
import { useLocation, useNavigate } from 'react-router';
import { Footer } from 'flowbite-react';
const RollingMovies = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { movies, isError, isLoading } = useSelector((state) => state.theatre);
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const enrolledMovies = location.state?.enrolledMovies || [];
    const screenId = location.state?.screenId;
    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);
    const handleAddToScreen = async (movie) => {
        const updatedMovies = [
            ...enrolledMovies,
            {
                movieId: movie?._id,
                movie_id: movie.movie_id,
                title: movie.title,
                duration: movie.runtime,
                genre: movie.genre,
                language: movie.language,
                rating: movie.rating,
                backdrop_path: movie.backdrop_path,
                poster_path: movie.poster_path,
                cast: movie.cast,
            },
        ];
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
                navigate(-1, { state: { updatedMovies } });
            }
            else {
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
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(TheatreHeader, {}), _jsx("h1", { className: "text-blue-800 text-3xl mt-4 font-medium text-center", children: "Available Movies" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-28 mx-20 my-6", children: isLoading ? (_jsx("p", { children: "Loading movies..." })) : isError ? (_jsx("p", { className: "text-red-500", children: "Error loading movies" })) : movies.length > 0 ? (movies.map((movie, index) => (_jsxs("div", { className: "bg-white shadow-md rounded-lg p-4 flex flex-col justify-between", children: [_jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'default_poster.jpg', alt: movie.title, className: "w-full h-80 object-cover rounded-md mb-4" }), _jsx("h2", { className: "text-lg font-bold text-gray-800 mb-2", children: movie.title }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Language: ", movie.language] }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Release Date: ", new Date(movie.releaseDate).toDateString()] }), _jsxs("p", { className: "text-sm text-gray-600 mb-1", children: ["Rating: ", movie.rating] }), _jsx("div", { className: "mt-4 flex justify-center", children: _jsx("button", { onClick: () => handleAddToScreen(movie), className: "text-zinc-200 min-h-8 min-w-fit px-2 bg-blue-600 text-sm cursor-pointer hover:bg-blue-800 hover:text-white hover:text-base transition-all", children: "Add to Movie Screen" }) })] }, movie.id || index)))) : (_jsx("p", { children: "No movies available." })) }), _jsx(Footer, {})] }) }));
};
export default RollingMovies;

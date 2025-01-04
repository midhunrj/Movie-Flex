import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
const FavouriteMovies = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.user);
    const userId = user?._id;
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    // Fetch favorites from backend
    const fetchFavorites = async () => {
        try {
            const response = await userAuthenticate.get('/favourites', { params: { userId } });
            setFavorites(response.data);
            console.log(response.data, "favourites by user from backend");
        }
        catch (error) {
            console.error('Error fetching favorites:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleRemoveFavorite = async (movieId) => {
        try {
            await userAuthenticate.delete('/remove-favourite', { data: { movieId, userId } });
            setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.movieId._id !== movieId));
        }
        catch (error) {
            console.error('Error removing favorite:', error);
        }
    };
    useEffect(() => {
        fetchFavorites();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-col items-center bg-gray-200 min-h-screen p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "My Favorite Movies" }), loading ? (_jsx("p", { children: "Loading..." })) : favorites.length === 0 ? (_jsx("p", { children: "No favorite movies found." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl", children: favorites.map((favorite) => (_jsxs("div", { className: "relative bg-white shadow-md rounded-lg p-4 hover:scale-105 cursor-pointer transition-all", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: `${TMDB_IMAGE_BASE_URL}/${favorite.movieId.poster_path}`, alt: favorite.movieId.title, className: "w-full h-72 object-fill rounded-md mb-4" }), _jsx("button", { onClick: () => handleRemoveFavorite(favorite.movieId._id), className: "absolute top-4 right-0  text-3xl text-red-500 hover:text-red-700 focus:outline-none", "aria-label": "Toggle favorite", children: favorites.some(fav => fav.movieId._id === favorite.movieId._id) ? (_jsx(AiFillHeart, { color: 'red' }) // Filled heart icon
                                            ) : (_jsx(FiHeart, { color: 'transparent' }) // Unfilled heart icon
                                            ) })] }), _jsx("h2", { className: "text-lg font-bold mb-2", children: favorite.movieId.title }), _jsx("p", { className: "mb-4", children: favorite.movieId.description }), _jsx("div", { className: 'flex justify-end items-end', children: _jsx("span", { className: "text-white bg-red-500    rounded-lg py-1 px-3 text-sm", onClick: () => handleRemoveFavorite(favorite.movieId._id), children: " Mark UnFavorite" }) })] }, favorite.movieId._id))) }))] }), _jsx(Footer, {})] }));
};
export default FavouriteMovies;

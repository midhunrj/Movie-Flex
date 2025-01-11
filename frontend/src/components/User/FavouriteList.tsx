import React, { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { MovieType } from '@/types/movieTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

export interface Favorite {
  movieId: MovieType;
  userId: string;
  createdAt: Date;
}

const FavouriteMovies = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const response = await userAuthenticate.get('/favourites', { params: { userId } });
      setFavorites(response.data);
      console.log(response.data, "favourites by user from backend");
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleRemoveFavorite = async (movieId: string) => {
    try {
      await userAuthenticate.delete('/remove-favourite',  {data:{ movieId, userId }}
      );
      
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.movieId._id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <Header searchQuery="" setSearchQuery={()=>{}} />
      <div className="flex flex-col items-center bg-gray-200 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">My Favorite Movies</h1>
        {loading ? (
          <p>Loading...</p>
        ) : favorites.length === 0 ? (
          <p>No favorite movies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {favorites.map((favorite) => (
              <div
                key={favorite.movieId._id}
                className="relative bg-white shadow-md rounded-lg p-4 hover:scale-105 cursor-pointer transition-all"
              >
                {/* Image with Heart Icon Overlay */}
                <div className="relative">
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}/${favorite.movieId.poster_path}`}
                    alt={favorite.movieId.title}
                    className="w-full h-72 object-fill rounded-md mb-4"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(favorite.movieId._id!)}
                    className="absolute top-3 right-3 w-fit  text-3xl text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Toggle favorite"
                  >
                    {favorites.some(fav => fav.movieId._id === favorite.movieId._id) ? (
                      <AiFillHeart color='red'  /> // Filled heart icon
                    ) : (
                      <FiHeart color='transparent' /> // Unfilled heart icon
                    )}
                  </button>
                </div>

                <h2 className="text-lg font-bold mb-2">{favorite.movieId.title}</h2>
                <p className="mb-4">{favorite.movieId.description}</p>

                {/* Favorite Caption */}
                <div className='flex justify-end self-end '>
                <span className="text-white bg-red-500    rounded-lg py-1 px-3 text-sm" onClick={() => handleRemoveFavorite(favorite.movieId._id!)}> Mark UnFavorite</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FavouriteMovies;

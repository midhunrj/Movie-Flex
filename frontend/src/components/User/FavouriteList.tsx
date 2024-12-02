import React, { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { MovieType } from '@/types/movieTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

interface Favorite {
  movieId: MovieType; // Adjusted to remove `string`
  userId: string;
  createdAt: Date;
}

const FavouriteMovies = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const fetchFavorites = async () => {
    try {
      const response = await userAuthenticate.get('/favourites', { params: { userId:userId } });
      setFavorites(response.data);
      console.log(response.data, "favourites by user from backend");
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-gray-200 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">My Favorite Movies</h1>
        {loading ? (
          <p>Loading...</p>
        ) : favorites.length === 0 ? (
          <p>No favorite movies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {favorites.map((favorite) => (
              <div key={favorite.movieId._id} className="bg-white shadow-md rounded-lg p-4 hover:scale-105 cursor-pointer transition-all">
                <img
                  src={`${TMDB_IMAGE_BASE_URL}/${favorite.movieId.poster_path}`}
                  alt={favorite.movieId.title}
                  className="w-full h-72 object-fill rounded-md mb-4 "
                />
                <h2 className="text-lg font-bold mb-2">{favorite.movieId.title}</h2>
                <p>{favorite.movieId.description}</p>
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

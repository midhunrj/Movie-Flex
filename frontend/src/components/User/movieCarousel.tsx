import React from "react";
import { motion } from "framer-motion";
import { MovieType } from "@/types/movieTypes";


const MovieCarousel: React.FC<{ movies: MovieType[] }> = ({ movies }) => {
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
  
  return (
    <motion.div
      className="flex overflow-x-auto scrollbar-hide space-x-4 p-4"
      drag="x"
      dragConstraints={{ right: 0, left: -300 }}
    >
      {movies.map((movie) => (
        <motion.div key={movie._id} className="flex-none w-80">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/assets/fallback.jpg"}
            alt={movie.title}
            className="w-full cursor-pointer rounded-lg hover:scale-105 transition-transform"
          />
          <p className="mt-2 text-lg font-semibold">{movie.title}</p>
          <p className="text-sm text-gray-600">Rating: {movie.rating || "N/A"}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MovieCarousel;

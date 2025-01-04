import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const MovieCarousel = ({ movies }) => {
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    return (_jsx(motion.div, { className: "flex overflow-x-auto scrollbar-hide space-x-4 p-4", drag: "x", dragConstraints: { right: 0, left: -300 }, children: movies.map((movie) => (_jsxs(motion.div, { className: "flex-none w-80", children: [_jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/assets/fallback.jpg", alt: movie.title, className: "w-full cursor-pointer rounded-lg hover:scale-105 transition-transform" }), _jsx("p", { className: "mt-2 text-lg font-semibold", children: movie.title }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Rating: ", movie.rating || "N/A"] })] }, movie._id))) }));
};
export default MovieCarousel;

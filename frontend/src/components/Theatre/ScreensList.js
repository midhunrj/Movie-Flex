import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import TheatreHeader from "./TheatreHeader";
import Footer from "../User/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listScreen } from "../../redux/theatre/theatreThunk";
import { motion } from "framer-motion";
const ScreensList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, screens } = useSelector((state) => state.theatre);
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    useEffect(() => {
        if (theatre?._id) {
            dispatch(listScreen(theatre._id));
        }
    }, [theatre, dispatch]);
    const handleAddScreen = () => {
        navigate("/theatre/new-screen");
    };
    const handleEditScreen = (id) => {
        if (id)
            navigate(`/theatre/edit-screen/${id}`);
    };
    const marqueeVariants = {
        animate: {
            x: ["100%", "-100%"],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
            },
        },
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "min-h-screen bg-zinc-100", children: [_jsx(TheatreHeader, {}), _jsx("h1", { className: "text-4xl font-bold text-blue-400 text-center mt-8", children: "Welcome to Movie Ticket Booking" }), _jsx("div", { className: "flex mt-12 pb-8 gap-5 items-center justify-center", children: _jsxs("div", { className: "grid grid-cols-4 gap-12", children: [screens &&
                                    screens.length > 0 &&
                                    screens.map((screen, index) => (_jsxs("div", { className: "relative w-full text-center text-white bg-indigo-950 bg-gradient-to-r h-96 border-b-black rounded-lg", children: [screen?.enrolledMovies && screen.enrolledMovies.length > 0 ? (_jsxs("div", { className: "relative w-full h-80 overflow-hidden", children: [_jsx("img", { src: `${TMDB_IMAGE_BASE_URL}${screen.enrolledMovies[0].poster_path}`, alt: `Now Showing ${screen.enrolledMovies[0]?.title ?? "Movie"}`, className: "rounded w-full h-full" }), _jsx(motion.div, { className: "absolute top-2 left-0 w-fit p-4 rounded-lg text-center text-white font-semibold bg-black bg-opacity-30 py-1", variants: marqueeVariants, animate: "animate", children: `${screen.enrolledMovies[0].title} is Playing` })] })) : (_jsxs("div", { className: "relative w-full h-80 bg-black flex items-center justify-center text-white overflow-hidden", children: [_jsx(motion.div, { className: "absolute top-2 left-0 w-full text-center text-white font-semibold bg-black/60 py-1", variants: marqueeVariants, animate: "animate", children: "No Movies Added" }), _jsx("span", { className: "text-center", children: "No Movies Added to the Screen" })] })), _jsxs("h1", { className: "ml-2 flex justify-start mb-2 font-medium", children: [screen.screenName, " Screen ", index + 1] }), _jsx("p", { className: "text-sm text-gray-200 hover:text-white flex justify-end mt-4 cursor-pointer mx-4", onClick: () => handleEditScreen(screen._id), children: "Edit" })] }, index))), _jsx("div", { className: "mx-8 h-96 w-full text-center text-slate-200 bg-indigo-950 border-b-black border rounded-lg", children: _jsxs("div", { className: "flex flex-col justify-center items-center h-full", children: [_jsx(FontAwesomeIcon, { icon: faPlus, className: "text-[15rem] text-slate-200 hover:text-white cursor-pointer", onClick: handleAddScreen }), _jsx("h2", { className: "block mt-4 text-xl text-white font-medium", children: "Add Screen" })] }) })] }) })] }), _jsx(Footer, {})] }));
};
export default ScreensList;

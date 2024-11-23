import React, { useEffect } from "react";
import TheatreHeader from "./TheatreHeader";
import Footer from "../User/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listScreen } from "../../redux/theatre/theatreThunk";
import { AppDispatch, RootState } from "@/redux/store/store";
import { motion } from "framer-motion";

const ScreensList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theatre, screens } = useSelector((state: RootState) => state.theatre);

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    if (theatre?._id) {
      dispatch(listScreen(theatre._id));
    }
  }, [theatre, dispatch]);

  const handleAddScreen = () => {
    navigate("/theatre/new-screen");
  };

  const handleEditScreen = (id?: string) => {
    if (id) navigate(`/theatre/edit-screen/${id}`);
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

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FEE685" }}>
        <TheatreHeader />
        <h1 className="text-4xl font-bold text-blue-400 text-center mt-8">
          Welcome to Movie Ticket Booking
        </h1>
        <div className="flex mt-12 pb-8 gap-5 items-center justify-center">
          <div className="grid grid-cols-4 gap-12">
            {screens &&
              screens.length > 0 &&
              screens.map((screen, index) => (
                <div
                  key={index}
                  className="relative w-full text-center text-white bg-[#244269] bg-gradient-to-r h-96 border-b-black rounded-lg"
                >
                  {/* Movie Poster */}
                  {screen?.enrolledMovies && screen.enrolledMovies.length > 0 ? (
                    <div className="relative w-full h-80 overflow-hidden">
                      {/* Movie Image */}
                      <img
                        src={`${TMDB_IMAGE_BASE_URL}${screen.enrolledMovies[0].poster_path}`}
                        alt={`Now Showing ${screen.enrolledMovies[0]?.title ?? "Movie"}`}
                        className="rounded w-full h-full"
                      />

                      {/* Scrolling Text */}
                      <motion.div
                        className="absolute top-2 left-0 w-fit p-4 rounded-lg text-center text-white font-semibold bg-black bg-opacity-30 py-1"
                        variants={marqueeVariants}
                        animate="animate"
                      >
                        {`${screen.enrolledMovies[0].title} is Playing`}
                      </motion.div>
                    </div>
                  ) : (
                    <div className="relative w-full h-80 bg-black flex items-center justify-center text-white overflow-hidden">
                      {/* Scrolling Text */}
                      <motion.div
                        className="absolute top-2 left-0 w-full text-center text-white font-semibold bg-black/60 py-1"
                        variants={marqueeVariants}
                        animate="animate"
                      >
                        No Movies Added
                      </motion.div>

                      {/* Placeholder */}
                      <span className="text-center">No Movies Added to the Screen</span>
                    </div>
                  )}

                  {/* Screen Name */}
                  <h1 className="ml-2 flex justify-start mb-2 font-medium">
                    {screen.screenName} Screen {index + 1}
                  </h1>

                  {/* Edit Button */}
                  <p
                    className="text-sm text-gray-200 hover:text-white flex justify-end mt-4 cursor-pointer mx-4"
                    onClick={() => handleEditScreen(screen._id)}
                  >
                    Edit
                  </p>
                </div>
              ))}

            {/* Add Screen Button */}
            <div className="mx-8 h-96 w-full text-center text-slate-200 bg-[#244269] border-b-black border rounded-lg">
              <div className="flex flex-col justify-center items-center h-full">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-[15rem] text-slate-200 hover:text-white cursor-pointer"
                  onClick={handleAddScreen}
                />
                <h2 className="block mt-4 text-xl text-white font-medium">Add Screen</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScreensList;

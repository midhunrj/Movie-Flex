// BannerCarousel.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
type BannerCarouselProps = {
  images: string[]; // Define the type for images as an array of strings
};
const BannerCarousel:React.FC<BannerCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const nextSlide = () => {
    setDirection("right")
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection("left")
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const navigate=useNavigate()

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [images.length,nextSlide,prevSlide]);

  return (
    <div className="relative h-[28rem] mb-4 overflow-hidden flex items-center justify-between bg-sky-100 rounded-sm shadow-lg">
            <AnimatePresence initial={false} custom={direction}>
      <motion.div className="flex flex-col justify-center px-8 text-slate-950 w-1/2">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
          Explore Your Movies
        </h1>
        <p className="text-lg lg:text-xl font-light mb-6">
          Discover and book tickets for your favorite movies effortlessly.
        </p>
        <button className="px-6 py-3 w-fit h-fit bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition" onClick={()=>navigate('/now-showing')}>
          Book Now
        </button>
      </motion.div>


        {images.map((image, index) =>
          index === currentIndex ? (
            <motion.img
              key={image}
              src={image}
              alt={`Banner ${index}`}
              initial={{
                opacity: 0,
                scale: 0.9,
                x: direction === "right" ? "100%" : "-100%",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                x: direction === "right" ? "-100%" : "100%",
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="h-[24rem] w-fit object-fill m-8  rounded-lg"
            />
          ) : null
        )}
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 min-h-12 transform -translate-y-1/2 text-white text-3xl font-semibold bg-gray-700 bg-opacity-70 hover:bg-opacity-90 rounded-lg  opacity-0 group-hover:opacity-90 transition"
      >
        &lt;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 min-h-12 transform -translate-y-1/2 text-white text-3xl font-semibold bg-gray-700 bg-opacity-70 hover:bg-opacity-90 rounded-lg opacity-0 group-hover:opacity-100 transition"
      >
        &gt;
      </button>
  </div>  );
};

export default BannerCarousel;

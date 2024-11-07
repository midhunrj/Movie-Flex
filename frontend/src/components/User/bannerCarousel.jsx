// BannerCarousel.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BannerCarousel = ({ images }) => {
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

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [images.length,nextSlide,prevSlide]);

  return (
    <div className="relative my-1 mb-4 overflow-hidden flex justify-center">
    <AnimatePresence initial={false} custom={direction}>
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
                duration: 0.2,
                ease: "easeIn",
              }}
              className="h-screen object-cover w-full rounded-lg shadow-lg"
            />
          ) : null
        )}
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 min-h-12 transform -translate-y-1/2 text-white text-3xl font-semibold bg-gray-700 bg-opacity-70 hover:bg-opacity-90 rounded-lg  transition"
      >
        &lt;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 min-h-12 transform -translate-y-1/2 text-white text-3xl font-semibold bg-gray-700 bg-opacity-70 hover:bg-opacity-90 rounded-lg  transition"
      >
        &gt;
      </button>
  </div>  );
};

export default BannerCarousel;

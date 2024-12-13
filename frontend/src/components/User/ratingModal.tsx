import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import { FaStar } from "react-icons/fa"; // Star icon for rating

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movieId: string, rating: number) => void;
  movieId: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  movieId,
}) => {
  const [rating, setRating] = useState<number>(5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-md w-96 shadow-lg">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <AiOutlineClose size={20} />
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <FaStar className="text-yellow-500" />
          <span>Rate Movie</span>
        </h2>

        {/* Rating Input */}
        <p className="mb-2 text-gray-700">Rate this movie from 1 to 10:</p>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-lg font-semibold text-blue-600">{rating}</span>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            <AiOutlineClose className="mr-2" />
            Cancel
          </button>
          <button
            onClick={() => onSubmit(movieId, rating)}
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <FaStar className="mr-2" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

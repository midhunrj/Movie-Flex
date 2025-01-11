import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import { FaHandHolding, FaStar, FaThumbsUp } from "react-icons/fa"; // Star icon for rating

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
  const [rating, setRating] = useState<number>(0);

  if (!isOpen) return null;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <FaStar
          key={i}
          size={30}
          onClick={() => setRating(i)}
          //onMouseEnter={() => setRating(i)}
          className={`cursor-pointer ${
            i <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center gap-4 justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-md w-96 h-fit shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 -right-10 text-gray-500 hover:text-gray-800"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <FaStar className="text-yellow-500" />
          <span>Rate Movie</span>
        </h2>

        <p className="mb-2 text-gray-700">Rate this movie:</p>
        <div>
        <div className="flex justify-center space-x-2 mb-4 ">{renderStars()}</div>

        <p className="text-end justify-end text-lg font-semibold text-slate-900">
          Selected Rating: {rating}/10
        </p>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-fit h-fit bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-slate-400 hover:text-gray-100"
          >
            <AiOutlineClose className="mr-2" />
            Cancel
          </button>
          <button
            onClick={() => onSubmit(movieId, rating)}
            className="flex items-center justify-center w-fit h-fit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <FaThumbsUp className="mr-2" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

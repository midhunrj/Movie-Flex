import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import { FaStar, FaThumbsUp } from "react-icons/fa"; // Star icon for rating
const RatingModal = ({ isOpen, onClose, onSubmit, movieId, }) => {
    const [rating, setRating] = useState(5);
    if (!isOpen)
        return null;
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(_jsx(FaStar, { size: 30, onClick: () => setRating(i), 
                //onMouseEnter={() => setRating(i)}
                className: `cursor-pointer ${i <= rating ? "text-yellow-500" : "text-gray-300"}` }, i));
        }
        return stars;
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center gap-4 justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "relative bg-white p-6 rounded-md w-96 h-fit shadow-lg", children: [_jsx("button", { onClick: onClose, className: "absolute top-2 -right-10 text-gray-500 hover:text-gray-800", children: _jsx(AiOutlineClose, { size: 20 }) }), _jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center space-x-2", children: [_jsx(FaStar, { className: "text-yellow-500" }), _jsx("span", { children: "Rate Movie" })] }), _jsx("p", { className: "mb-2 text-gray-700", children: "Rate this movie:" }), _jsxs("div", { children: [_jsx("div", { className: "flex justify-center space-x-2 mb-4 ", children: renderStars() }), _jsxs("p", { className: "text-end justify-end text-lg font-semibold text-slate-900", children: ["Selected Rating: ", rating, "/10"] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-4", children: [_jsxs("button", { onClick: onClose, className: "flex items-center justify-center w-fit h-fit bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-slate-400 hover:text-gray-100", children: [_jsx(AiOutlineClose, { className: "mr-2" }), "Cancel"] }), _jsxs("button", { onClick: () => onSubmit(movieId, rating), className: "flex items-center justify-center w-fit h-fit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600", children: [_jsx(FaThumbsUp, { className: "mr-2" }), "Confirm"] })] })] }) }));
};
export default RatingModal;

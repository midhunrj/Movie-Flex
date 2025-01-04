import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaTicketAlt, FaBell, FaExclamationCircle, FaCalendarAlt, } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AiOutlineDown } from "react-icons/ai";
const NotificationItem = ({ notification, onMarkAsRead, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        if (notification.status === "Unread") {
            onMarkAsRead(notification._id); // Mark as read if unread
        }
        setIsOpen((prev) => !prev); // Toggle accordion
    };
    const navigate = useNavigate();
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const getIcon = (type) => {
        switch (type) {
            case "Booking Confirmation":
                return _jsx(FaTicketAlt, { className: "text-blue-500 w-6 h-6" });
            case "Reminder Alert":
                return _jsx(FaBell, { className: "text-yellow-500 w-6 h-6" });
            case "System Alert":
                return _jsx(FaExclamationCircle, { className: "text-red-500 w-6 h-6" });
            case "Payment Success":
                return _jsx(FaCalendarAlt, { className: "text-green-500 w-6 h-6" });
            default:
                return _jsx(FaBell, { className: "text-gray-500 w-6 h-6" });
        }
    };
    return (_jsxs("li", { className: `border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 ${notification.status === "Unread"
            ? "bg-blue-50 border-blue-300"
            : "bg-gray-50 border-gray-200"}`, children: [_jsxs("div", { className: "flex items-center cursor-pointer space-x-4", onClick: handleToggle, children: [_jsx("div", { children: getIcon(notification.type) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: `font-semibold text-base ${notification.status === "Unread"
                                    ? "text-blue-800"
                                    : "text-gray-800"}`, children: notification.title }), _jsx("small", { className: "text-xs text-gray-500", children: new Date(notification.createdAt).toLocaleString() })] }), _jsx("button", { className: `ml-4 w-fit transform transition-transform ${isOpen ? "rotate-180" : ""}`, children: _jsx(AiOutlineDown, {}) })] }), isOpen && (_jsxs("div", { className: "mt-4 bg-white border rounded-lg p-4 transition-all shadow-inner", children: [_jsx("p", { className: "text-sm text-gray-600", children: notification.message }), notification.data && (_jsxs("div", { className: "mt-4 flex flex-col sm:flex-row sm:space-x-4 cursor cursor-pointer", onClick: () => navigate('/orders'), children: [notification.data.movieDetails?.image && (_jsx("div", { className: "flex-shrink-0 w-full sm:w-48 h-auto mx-auto sm:mx-0", children: _jsx("img", { src: `${TMDB_IMAGE_BASE_URL}/${notification.data.movieDetails.image}`, alt: "Movie Poster", className: "rounded-lg shadow-md w-40 h-40" }) })), _jsxs("div", { className: "mt-4 sm:mt-0 flex-1 text-sm space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Booking ID:" }), " ", notification.data.bookingId] }), _jsxs("p", { children: [_jsx("strong", { children: "Movie:" }), " ", notification.data.movieDetails?.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Showtime:" }), " ", notification.data.showDetails?.showtime] }), _jsxs("p", { children: [_jsx("strong", { children: "Date:" }), " ", notification.data.showDetails?.showDate] }), _jsxs("p", { children: [_jsx("strong", { children: "Seats:" }), " ", notification.data.selectedSeats?.join(", ")] }), _jsxs("p", { children: [_jsx("strong", { children: "Total Price:" }), " $", notification.data.totalPrice] })] })] }))] }))] }));
};
export default NotificationItem;

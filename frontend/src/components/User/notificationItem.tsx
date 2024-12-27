import React, { useState } from "react";
import {
  FaTicketAlt,
  FaBell,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { Notification } from "./notifications";
import { useNavigate } from "react-router";
import { BiArchiveIn } from "react-icons/bi";
import { LucideAArrowDown, LucideAlignEndVertical, LucideArrowBigDown, LucideArrowBigDownDash, LucideTrendingDown } from "lucide-react";
import { AiOutlineDown } from "react-icons/ai";

interface NotificationProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void; // Callback to handle "mark as read"
}

const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (notification.status === "Unread") {
      onMarkAsRead(notification._id); // Mark as read if unread
    }
    setIsOpen((prev) => !prev); // Toggle accordion
  };
const navigate=useNavigate()
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const getIcon = (type: string) => {
    switch (type) {
      case "Booking Confirmation":
        return <FaTicketAlt className="text-blue-500 w-6 h-6" />;
      case "Reminder Alert":
        return <FaBell className="text-yellow-500 w-6 h-6" />;
      case "System Alert":
        return <FaExclamationCircle className="text-red-500 w-6 h-6" />;
      case "Payment Success":
        return <FaCalendarAlt className="text-green-500 w-6 h-6" />;
      default:
        return <FaBell className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <li
      className={`border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300 ${
        notification.status === "Unread"
          ? "bg-blue-50 border-blue-300"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Notification Header */}
      <div
        className="flex items-center cursor-pointer space-x-4"
        onClick={handleToggle}
      >
        <div>{getIcon(notification.type)}</div>
        <div className="flex-1">
          <p
            className={`font-semibold text-base ${
              notification.status === "Unread"
                ? "text-blue-800"
                : "text-gray-800"
            }`}
          >
            {notification.title}
          </p>
          <small className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleString()}
          </small>
        </div>
        <button
          className={`ml-4 w-fit transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <AiOutlineDown />
        </button>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="mt-4 bg-white border rounded-lg p-4 transition-all shadow-inner">
          <p className="text-sm text-gray-600">{notification.message}</p>
          {notification.data && (
            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 cursor cursor-pointer" onClick={()=>navigate('/orders')}>
              
              {notification.data.movieDetails?.image && (
                <div className="flex-shrink-0 w-full sm:w-48 h-auto mx-auto sm:mx-0">
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}/${notification.data.movieDetails.image}`}
                    alt="Movie Poster"
                    className="rounded-lg shadow-md w-40 h-40"
                  />
                </div>
              )}

              <div className="mt-4 sm:mt-0 flex-1 text-sm space-y-2">
                <p>
                  <strong>Booking ID:</strong> {notification.data.bookingId}
                </p>
                <p>
                  <strong>Movie:</strong> {notification.data.movieDetails?.name}
                </p>
                <p>
                  <strong>Showtime:</strong> {notification.data.showDetails?.showtime}
                </p>
                <p>
                  <strong>Date:</strong> {notification.data.showDetails?.showDate}
                </p>
                <p>
                  <strong>Seats:</strong>{" "}
                  {notification.data.selectedSeats?.join(", ")}
                </p>
                <p>
                  <strong>Total Price:</strong> ${notification.data.totalPrice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default NotificationItem;

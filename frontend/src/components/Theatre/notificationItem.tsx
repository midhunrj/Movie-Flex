import React from "react";
import {
  FaTicketAlt,
  FaBell,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { Notification } from "./notification";


interface NotificationProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "Booking confirmation":
        return <FaTicketAlt className="text-blue-500 w-6 h-6" />;
      case "reminder":
        return <FaBell className="text-yellow-500 w-6 h-6" />;
      case "alert":
        return <FaExclamationCircle className="text-red-500 w-6 h-6" />;
      case "event_reminder":
        return <FaCalendarAlt className="text-green-500 w-6 h-6" />;
      default:
        return <FaBell className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <li className="flex items-center mx-12 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="mr-4">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{notification.title}</p>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <small className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
    </li>
  );
};

export default NotificationItem;

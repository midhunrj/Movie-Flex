import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaTicketAlt, FaBell, FaExclamationCircle, FaCalendarAlt, } from "react-icons/fa";
const NotificationItem = ({ notification }) => {
    const getIcon = (type) => {
        switch (type) {
            case "Booking confirmation":
                return _jsx(FaTicketAlt, { className: "text-blue-500 w-6 h-6" });
            case "reminder":
                return _jsx(FaBell, { className: "text-yellow-500 w-6 h-6" });
            case "alert":
                return _jsx(FaExclamationCircle, { className: "text-red-500 w-6 h-6" });
            case "event_reminder":
                return _jsx(FaCalendarAlt, { className: "text-green-500 w-6 h-6" });
            default:
                return _jsx(FaBell, { className: "text-gray-500 w-6 h-6" });
        }
    };
    return (_jsxs("li", { className: "flex items-center mx-12 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm", children: [_jsx("div", { className: "mr-4", children: getIcon(notification.type) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold text-gray-800", children: notification.title }), _jsx("p", { className: "text-sm text-gray-600", children: notification.message }), _jsx("small", { className: "text-xs text-gray-400", children: new Date(notification.createdAt).toLocaleString() })] })] }));
};
export default NotificationItem;

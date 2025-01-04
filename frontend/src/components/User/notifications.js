import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationItem from "./notificationItem";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import { useSelector } from "react-redux";
import Header from "./header";
import Footer from "./footer";
export var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_CONFIRMATION"] = "Booking Confirmation";
    NotificationType["REMINDER_ALERT"] = "Reminder Alert";
    NotificationType["PAYMENT_SUCCESS"] = "Payment Success";
    NotificationType["SYSTEM_ALERT"] = "System Alert";
    NotificationType["OTHER"] = "Other";
})(NotificationType || (NotificationType = {}));
export var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["READ"] = "Read";
    NotificationStatus["UNREAD"] = "Unread";
})(NotificationStatus || (NotificationStatus = {}));
const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { user, role } = useSelector((state) => state.user);
    const userId = user?._id;
    const fetchNotifications = async () => {
        const response = await userAuthenticate.get(`/notifications/${userId}/${role}`);
        setNotifications(response.data.notifications);
    };
    const markAsRead = async (id) => {
        await userAuthenticate.patch(`/notifications/mark-as-read/${id}`);
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, status: NotificationStatus.READ } : n)));
    };
    useEffect(() => {
        const socket = io("https://api.movie-flex.site");
        socket.emit("subscribe", userId, role);
        socket.on("initialNotifications", (pastNotifications) => {
            setNotifications(pastNotifications);
        });
        socket.on("notification", (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        });
        return () => {
            socket.emit("Mark-as-read", userId, role);
            socket.disconnect();
        };
    }, [userId, role]);
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("div", { className: "flex flex-col min-h-screen gap-4", children: _jsxs("div", { className: "flex-1 p-4 my-4 w-full max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Notifications" }), _jsx("ul", { className: "space-y-4", children: notifications.map((notification) => (_jsx(NotificationItem, { notification: notification, onMarkAsRead: markAsRead }, notification._id))) })] }) }), _jsx(Footer, {})] }));
};
export default Notifications;

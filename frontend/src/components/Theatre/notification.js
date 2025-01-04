import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationItem from "./notificationItem";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import { useSelector } from "react-redux";
import TheatreHeader from "./TheatreHeader";
import Footer from "../User/footer";
import { theatreUrl } from "@/utils/axios/config/urlConfig";
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
    const { theatre, role } = useSelector((state) => state.theatre);
    const userId = theatre?._id;
    const fetchNotifications = async () => {
        const response = await userAuthenticate.get(`/notifications/${userId}/${role}`);
        setNotifications(response.data.notifications);
    };
    useEffect(() => {
        //fetchNotifications();
        const socket = io(theatreUrl);
        socket.emit("subscribe", userId, role);
        console.log("sssd");
        socket.on("initialNotifications", (pastNotifications) => {
            console.log("sgsgs");
            setNotifications(pastNotifications);
        });
        socket.on("notification", (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        });
        return () => {
            socket.emit('Mark-as-read', userId, role);
            socket.disconnect();
        };
    }, [userId, role]);
    return (_jsxs(_Fragment, { children: [_jsx(TheatreHeader, {}), _jsxs("div", { className: "p-4 w-full max-w-full mx-auto bg-white rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-4", children: "Notifications" }), _jsx("ul", { className: "space-y-4", children: notifications.map((notification) => (_jsx(NotificationItem, { notification: notification }, notification?._id))) })] }), _jsx(Footer, {})] }));
};
export default Notifications;

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationItem from "./notificationItem";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import Header from "./header";
import Footer from "./footer";
export enum NotificationType {
    BOOKING_CONFIRMATION = "Booking Confirmation",
    REMINDER_ALERT = "Reminder Alert",
    PAYMENT_SUCCESS = "Payment Success",
    SYSTEM_ALERT = "System Alert",
    OTHER = "Other",
  }
  
  
  export enum NotificationStatus {
    READ = "Read",
    UNREAD = "Unread",
  }
  
  
  export interface Notification  {
    _id:string,
    recipients: {
      recipientId: string; 
      recipientRole: "user" | "admin" | "theatre"; 
    }[];
    type: NotificationType; 
    title: string; 
    message: string; 
    data?: Record<string, any>; 
    status: NotificationStatus; 
    createdAt: Date; 
    updatedAt: Date; 
  }

  const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, role } = useSelector((state: RootState) => state.user);
    const userId = user?._id;
  
    const fetchNotifications = async () => {
      const response = await userAuthenticate.get(`/notifications/${userId}/${role}`);
      setNotifications(response.data.notifications);
    };
  
    const markAsRead = async (id: string) => {
      await userAuthenticate.patch(`/notifications/mark-as-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status:NotificationStatus.READ } : n))
      );
    };
  
    useEffect(() => {
      const socket = io("http://localhost:748);
      socket.emit("subscribe", userId, role);
  
      socket.on("initialNotifications", (pastNotifications: Notification[]) => {
        setNotifications(pastNotifications);
      });
  
      socket.on("notification", (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      });
  
      return () => {
        socket.emit("Mark-as-read", userId, role);
        socket.disconnect();
      };
    }, [userId, role]);
  
    return (
      <>
        <Header />
        <div className="flex flex-col min-h-screen gap-4">
        <div className="flex-1 p-4 my-4 w-full max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </ul>
        </div>
        </div>
        <Footer />
      </>
    );
  };
  
  export default Notifications;
  
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

  const{user,role}=useSelector((state:RootState)=>state.user)
  const userId=user?._id
  const fetchNotifications = async () => {
    const response = await userAuthenticate.get(`/notifications/${userId}/${role}`);
    
    setNotifications(response.data.notifications);
  };
  useEffect(() => {
    

    //fetchNotifications();

    const socket = io("http://localhost:7486"); 
    socket.emit("subscribe", userId, role);
   console.log("sssd");
   
    socket.on("initialNotifications", (pastNotifications: Notification[]) => {
        console.log("sgsgs");
        
        setNotifications(pastNotifications);
      });

      
      socket.on("notification", (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      });

    return () => {
        socket.emit('Mark-as-read',userId,role)
      socket.disconnect();
    };
  }, [userId, role]);

  return (
    <>
    <Header/>
    <div className="p-4 w-full max-w-full mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem key={notification?._id} notification={notification} />
        ))}
      </ul>
    </div>
    <Footer/>
    </>
  );
};

export default Notifications;

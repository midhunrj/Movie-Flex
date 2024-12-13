export enum NotificationType {
    BOOKING_CONFIRMATION = "Booking Confirmation",
    REMINDER_ALERT = "Reminder Alert",
    PAYMENT_SUCCESS = "Payment Success",
    SYSTEM_ALERT = "System Alert",
    TICKET_CANCEL="Ticket Cancellation",
    OTHER = "Other",
  }
  
  
  export enum NotificationStatus {
    READ = "Read",
    UNREAD = "Unread",
  }
  
  
  export interface Notification  {
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
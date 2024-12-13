import mongoose, { Schema, Document } from "mongoose";


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


export interface INotification extends Document {
  recipients: {
    recipientId: mongoose.Types.ObjectId; 
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


const NotificationSchema: Schema = new Schema<INotification>(
  {
    recipients: [
      {
        recipientId: { type: Schema.Types.ObjectId, required: true },
        recipientRole: {
          type: String,
          required: true,
          enum: ["user", "admin", "theatre"],
        },
      },
    ],
    type: {
      type: String,
      required: true,
      enum: Object.values(NotificationType),
      default: NotificationType.OTHER,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Object, 
      default: {},
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.UNREAD,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default Notification;

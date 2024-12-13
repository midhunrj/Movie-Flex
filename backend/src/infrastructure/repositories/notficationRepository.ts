import { INotificationRepository } from "../../application/repositories/iNotificationRepository";
import Notification from "../database/models/notficationModel";

export class NotificationRepository implements INotificationRepository{
    async getNotificationsByUser(recipientId: string, role: string): Promise<string[]> {
       return await Notification.find({'recipients.recipientId':recipientId,'recipients.role':role}) 
    }

    async createNotification(data: any): Promise<void> {
         const notification = new Notification(data);
    await notification.save();
    }
}
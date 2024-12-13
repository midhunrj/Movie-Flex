import { INotificationRepository } from "../repositories/iNotificationRepository";

export class Notification{
    constructor(private notificationRepo:INotificationRepository){}

    async newNotification(data:any)
    {
        await this.notificationRepo.createNotification(data)

    }

    async userNotification(recipientId:string,role:string)
    {
        await this.notificationRepo.getNotificationsByUser(recipientId,role)
    }
}
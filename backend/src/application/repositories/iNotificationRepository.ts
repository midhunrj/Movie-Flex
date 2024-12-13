export interface INotificationRepository{
    createNotification(data:any):Promise<void>
    getNotificationsByUser(recipientId:string,role:string):Promise<string[]>
}
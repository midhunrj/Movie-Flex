import {Server,Socket} from 'socket.io'
import { Server as HttpServer } from 'http'
import Notification, { NotificationStatus } from '../database/models/notficationModel'
import configKeys from '../config/config'

class SocketService{
    private io:Server|null=null
  
init(httpServer:HttpServer)
{
    this.io=new Server(httpServer,{
        cors:{
            origin:[configKeys.CLIENT_URL!,"http://localhost:5173"],
            methods:['GET','POST']
        }
    })

    this.io.on("connection",(socket:Socket)=>{
        console.log("A client has successfully connected");

        socket.on("subscribe",async(userId:string,role:string)=>{
            console.log(`Subscribed to notifications for: ${userId} (${role})`);
            if (userId && role) {
                const room = `${userId}:${role}`;
                console.log(`Subscribed to notifications for: ${room}`);
                socket.join(room);
                const pastNotifications = await this.fetchPastNotifications(userId, role);
                const count=await Notification.countDocuments({'recipients.recipientId':userId,status:NotificationStatus.UNREAD})
                console.log("sfkhfjkshf",count);
                
                socket.emit('Notification-unread-count',count)
          socket.emit("initialNotifications", pastNotifications)
              } else {
                console.error("Invalid subscription details: userId or role missing.");
              }
        
        })

        socket.on("Mark-as-read",async(userId:string,role:string)=>{
            try{
            if (userId && role) {
                // const room = `${userId}:${role}`;
                // console.log(`Subscribed to notifications for: ${room}`);
                // socket.join(room);
                console.log("socket room time");
                
                await Notification.updateMany({'recipients.recipientId':userId,'recipients.recipientRole':role},{$set:{status:NotificationStatus.READ}})
            }
            console.log(`Marked notifications as read for: ${userId} (${role})`);
        }
        catch(error:any)
        {
            console.error("Error marking notifications as read:", error);
        }
        })
        socket.on("seat-selected",(data)=>this.handleSeatSelection(socket,data))
         
       socket.on("disconnect",()=>{
        console.log("client disconnected:",socket.id)
        
       })
    })
}

private async handleSeatSelection(socket:Socket,data:any)
{
    console.log("seat selected :",data)

    socket.broadcast.emit("update-seats",data)
    
}
private async fetchPastNotifications(userId: string, role: string) {
    try {
      return await Notification.find({
        recipients: { $elemMatch: { recipientId: userId, recipientRole: role } },
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error fetching past notifications:", error);
      return [];
    }
  }


sendNotification(userId: string, role: string, event: string, data: any) {
    const room = `${userId}:${role}`;
    if (this.io) {
        this.io.to(room).emit(event, data);
    } else {
        console.error("Socket.IO not initialized");
    }
}

getIO():Server{
    if(!this.io)
    {
        throw new Error("Socket.IO not initialised")
    }

    return this.io
}

}

export const socketService=new SocketService()
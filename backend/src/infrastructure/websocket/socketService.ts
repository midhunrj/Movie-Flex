import {Server,Socket} from 'socket.io'
import { Server as HttpServer } from 'http'

class SocketService{
    private io:Server|null=null

init(httpServer:HttpServer)
{
    this.io=new Server(httpServer,{
        cors:{
            origin:"http://localhost:3000",
            methods:['GET','POST']
        }
    })

    this.io.on("connection",(socket:Socket)=>{
        console.log("A client has successfully connected");

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

getIO():Server{
    if(!this.io)
    {
        throw new Error("Socket.IO not initialised")
    }

    return this.io
}

}

export const socketService=new SocketService()
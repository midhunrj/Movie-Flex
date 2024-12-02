import {Server} from 'http'
import configKeys from '../../infrastructure/config/config'
import { socketService } from '../../infrastructure/websocket/socketService'

const serverConfig=(server:Server)=>{
    return{
        startServer:()=>{

            socketService.init(server)
            const PORT=configKeys.PORT;
            server.listen(PORT,()=>{
                 console.log(`server running on port ${PORT}`);
                
            })
        }
    }
}

export default serverConfig
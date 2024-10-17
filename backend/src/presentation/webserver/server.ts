import {Server} from 'http'
import configKeys from '../../infrastructure/config/config'

const serverConfig=(server:Server)=>{
    return{
        startServer:()=>{
            const PORT=configKeys.PORT;
            server.listen(PORT,()=>{
                 console.log(`server running on port ${PORT}`);
                
            })
        }
    }
}

export default serverConfig
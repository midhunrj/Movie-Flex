import express,{Application} from 'express'
import cors, { CorsOptions } from 'cors'
import '../../infrastructure/services/cronJobService'
import authRoutes from '../webserver/routes/authRoutes'
import userRoute from '../webserver/routes/userRouter'
import theatreRoute from '../webserver/routes/theatreRoutes'
import adminRoute from '../webserver/routes/adminRoutes'
import configKeys from '../../infrastructure/config/config'
import cookieParser from 'cookie-parser';


const expressConfig=(app:Application)=>{
    console.log(configKeys.CLIENT_URL,"dffdfde");
    console.log(configKeys.SERVER_URL,"server url");
    
    const corsOptions:CorsOptions={
        origin:[configKeys.CLIENT_URL!,"http://localhost:5173"],   
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };
    console.log("ftyhfygyj");
    app.use(cors(corsOptions))
    // app.options( cors(corsOptions))
    app.use(cookieParser());
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use('/',userRoute)
    app.use('/auth',authRoutes)
    app.use('/theatre',theatreRoute)
    app.use('/admin',adminRoute)
}

export default expressConfig
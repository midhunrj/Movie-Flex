import mongoose from 'mongoose'

import configKeys from '../config/config'

const connectDB=async()=>{
    try{
    await mongoose.connect(configKeys.MONGODB_URI)
    .then(()=>{
        console.log("mongodb connected ...");
        
    })
    
    }
    catch(error)
    {
        //console.log(error.message);

        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
          } else {
            console.error('An unknown error occurred');
          }
        
    }
}

export default connectDB
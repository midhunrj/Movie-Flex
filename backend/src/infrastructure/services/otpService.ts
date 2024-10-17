// import { createClient } from 'redis';

// // Create and connect the Redis client
// const redisClient = createClient();

// redisClient.on('error', (err) => console.log('Redis Client Error', err));

// (async () => {
//     await redisClient.connect();
// })();
// import { MailService } from './mailService'
// import nodemailer from 'nodemailer'
// import { User } from '../../Domain/entities/user'
// export class OtpService{
//     generateOtp():string
//     {
//         return Math.floor(1000 + Math.random() * 9000).toString()


//     }

//     // async sendOtp(email:string,otp:string):Promise<void>
//     // {
//     //    await this.
//     // }


//     async saveTempUserData(email:string,user:User,otp:string):Promise<void>
//     {
//         const tempUserData={user,otp}
//         await redisClient.setEx(email,600,JSON.stringify(tempUserData))
//     }

//     async getTempUserData(email:string):Promise<any>
//     {
//       const tempData=await redisClient.get(email)
//       return tempData?JSON.parse(tempData):null
//     }

//     async deleteTempUserData(email:string):Promise<void>
//     {
//         await redisClient.del(email)
//     }
//     async saveOtp(email:string,otp:string):Promise<void>
//     {
//         await redisClient.setEx(email,600,otp)
//     }

//     async verifyOtp(email:string,otp:string):Promise<boolean>
//     {
//         const storedOtp=await redisClient.get(email)
//         return storedOtp==otp
//     }
// }


import jwt from 'jsonwebtoken';
import { MailService } from './mailService';
import { User } from '../../Domain/entities/user';

import configKeys from '../config/config';
import { Theatre } from '../../Domain/entities/theatre';

export class OtpService {
    
    generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    
    generateToken(email: string, user: User, otp: string): string {
        const payload = { email, user, otp };
        const token = jwt.sign(payload, configKeys.JWT_SECRET, { expiresIn: '10m' }); // Token valid for 10 minutes
        return token;
    }


    generateThetre(email: string, theatre: Theatre, otp: string): string {
        const payload = { email, theatre, otp };
        const token = jwt.sign(payload, configKeys.JWT_SECRET, { expiresIn: '10m' }); // Token valid for 10 minutes
        return token;
    }
    
    verifyToken(token: string): { isValid: boolean, data?: any } {
        try {
            const decoded = jwt.verify(token,configKeys.JWT_SECRET);
            return { isValid: true, data: decoded };
        } catch (err) {
            return { isValid: false };
        }
    }

    
    async saveTempUserData(email: string, user: User, otp: string): Promise<string> {
        
        const token = this.generateToken(email, user, otp);
        return token;
    }


    async saveTempTheatreData(email: string, theatre:Theatre, otp: string): Promise<string> {
        
        const token = this.generateThetre(email, theatre, otp);
        return token;
    }

    
    async verifyOtp(token: string, otp: string): Promise<boolean> {
        const { isValid, data } = this.verifyToken(token);
        if (isValid && data.otp === otp) {
            return true; 
        } else {
            return false; 
        }
    }

    // In a token-based system, there's no need to delete data, as tokens expire automatically
}

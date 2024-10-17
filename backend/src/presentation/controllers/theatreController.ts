import {NextFunction, Request,Response} from 'express'
import { TheatreUseCase } from '../../application/usecases/theatre';
import { FileUploadService } from '../../infrastructure/services/fileService';

export class TheatreController{
    constructor(private theatreUseCase:TheatreUseCase,private fileUploadService:FileUploadService){}

    async register(req:Request,res:Response)
    {
        try{

            console.log("lksksl",req.body,req.file);
            let theatreLicensePath = '';
            if (req.file) {
                theatreLicensePath = this.fileUploadService.saveFile(req.file); 
                console.log("Theatre license uploaded at: ", theatreLicensePath);
            }
      const theatre=await this.theatreUseCase.register(req.body,theatreLicensePath)
      if(theatre=='403')
        {
          res.status(403).json({message:"your email is already   registered try different email"})
        }
        else{
            console.log('theattre',theatre);
            'hhhh'
         res.status(201).json(theatre)
        }
    }
        catch(error)
        {
            res.status(500).json({error:"Failed to reigister theatre"})
        }
    }

    async login(req:Request,res:Response)
    {
        try{

            console.log(req.body,"jhbjh");
            
            const{email,password}=req.body
            const theatre=await this.theatreUseCase.login(email,password)
            console.log(theatre,"ifhih thet");
            
            if (!theatre) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            if(theatre.theatre.is_approved=="Pending")
            {
                return res.status(403).json({ message: "Your Account has been under verification we will notify you once approved" });
            }
            if (theatre.theatre.is_blocked) {
                return res.status(403).json({ message: "Your Account has been blocked" });
            }
            
                // console.log(user,"user");

                const{refreshToken}=theatre as{refreshToken:string}
                res.cookie('theatreRefreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV==="production",  
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                
                console.log(theatre,"its before sending theatre details to frontend");
                
                return res.status(200).json(theatre)
            }
            
        
        catch(error)
        {
            res.status(500).json({error:'failed to login'})
        }

    }

    async home(req:Request,res:Response)
    {
        res.status(200).json({message:"welcome to the homepage"})
    }


    
    async forgotPassword(req:Request,res:Response){
        try{
            const {email}=req.body
            await this.theatreUseCase.sendOtp(email)
            res.status(200).json({message:"Otp sent successfully"})

        }
        catch(error)
        {
            res.status(500).json({error:"Failed to send otp"})
        }
    }

    async verifytheatre(req:Request,res:Response)
    {
        try{
            const {token,otp}=req.body
            console.log(req.body);
            
            const isValid=await this.theatreUseCase.verifyTheatre(token,otp)
            console.log(isValid,"valid hgg");
            
            if(isValid)
            {
                console.log("true dan dana dan dan dana dan");
                
                res.status(200).json({message:"otp verified successfully"})
            }
            else
            {
                res.status(400).json({error:"Invalid OTP "})
            }
        }
        catch(error)
        {
            res.status(500).json({error:"failed to verify otp"})
        }
    }


    async verifyOtp(req:Request,res:Response)
    {
        try{
            const {email,otp}=req.body
            const isValid=await this.theatreUseCase.verifyOtp(email,otp)
            if(isValid)
            {
                res.status(200).json({message:"otp verified successfully"})
            }
            else
            {
                res.status(400).json({error:"Invalid OTP "})
            }
        }
        catch(error)
        {
            res.status(500).json({error:"failed to verify otp"})
        }
    }


    async resetPassword(req:Request,res:Response)
    {
        try {
            const {email,newPassword}=req.body
            await this.theatreUseCase.resetPassword(email,newPassword) 
            res.status(200).json({message:"password reset successfully"}) 
        } catch (error) {
         
            res.status(500).json({error:"failed to reset password"})
        }
    }

    async resendOtp(req:Request,res:Response)
    {
        try{
           const {token}=req.body
          const theatre= await this.theatreUseCase.resendOtp(token)
           res.status(200).json({message:"otp has been resent successfully",theatre})
        }
        catch(error)
        {
            console.log(error);
            
            res.status(500).json({message:'failed to resend otp'})
        }
    }

    async completeProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
           const theatreId = req.theatre?.id; // Assuming JWT middleware sets user in req
           console.log(theatreId,"theatreid");
           
            const addressData = req.body.addressData;
            console.log(addressData,"addressData");
            
            const updatedProfile = await this.theatreUseCase.completeTheatreprofile(theatreId, addressData);
            console.log(updatedProfile,"updatedProfile ");
            
            res.status(200).json({updatedProfile,message:"Profile has been updated Successfully"});
        } catch (error) {
            res.status(500).json({ message: "failed to complete theatre profile"});
        }
    }

}
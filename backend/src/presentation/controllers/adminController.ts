import {Request,Response} from 'express'
import { AdminUseCase } from '../../application/usecases/admin';

export class AdminController{
    constructor(private adminCase:AdminUseCase){}

    

    async login(req:Request,res:Response)
    {
        try{

            console.log(req.body,"jhbjh");
            
            const{email,password}=req.body
            
            const admin=await this.adminCase.login(email,password)
            console.log(admin,"ifhih adm");
            
            if (!admin) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
                

                const{refreshToken}=admin
                console.log("Setting cookie:", refreshToken);
                res.cookie('adminRefreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                console.log("Refresh token cookie set:", refreshToken)

                
                // After setting the cookie
// console.log('Cookies set:', req.cookies);
                return res.status(200).json(admin)
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

    async userData(req:Request,res:Response)
    {
        try {
            console.log('errererer',req.cookies)
           const userData= await this.adminCase.fetchUserDetails()
           res.status(200).json({message:"here all the user data available",userData})
        } catch (error) {
            
        }
    }

    async theatreData(req:Request,res:Response)
    {
        try {
            console.log("eeklmekle");
            
           const theatreData= await this.adminCase.fetchTheatreDetails()
           console.log(theatreData,"the data");
           
           res.status(200).json({message:"here all the user data available",theatreData})
        } catch (error) {
            
        }
    }

    async blockUser(req:Request,res:Response)
    {
        try{
            console.log("eeklembi");
              let userId=req.params.userId
              console.log("userId",userId);
              
            const user=await this.adminCase.blockUser(userId)
            console.log(user,"after block");
            
            res.status(200).json({message:"the user has been blocked",user})
        }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
            res.status(500).json({ message: "failed to blcok user" });
        }
    }

    
    async unblockUser(req:Request,res:Response)
    {
        try{
            console.log("eeklembi");
              let userId=req.params.userId
            const user=await this.adminCase.unblockUser(userId)
            console.log(user,"after unblock");
           
            // if(isUnBlocked)
            // {
            res.status(200).json({message:"the user has been unblocked",user})
            }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
    res.status(500).json({ message: "failed to unblock user" });
        }
    }

    
    async blockTheatre(req:Request,res:Response)
    {
        try{
            console.log("eeklembi");
              let theatreId=req.params.theatreId
            const theatre=await this.adminCase.blockTheatre(theatreId)
            console.log("after block",theatre);
            
            res.status(200).json({message:"the user has been blocked",theatre})
        }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
            res.status(500).json({ message:"failed to blcok theatre" });
        }
    }

    
    async unblockTheatre(req:Request,res:Response)
    {
        try{
            console.log("eeklembi");
              let theatreId=req.params.theatreId
            const theatre=await this.adminCase.unblockTheatre(theatreId)
            console.log("after unblock",theatre);
            
            // if(isUnBlocked)
            // {
            res.status(200).json({message:"the user has been unblocked",theatre})
            }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
    res.status(500).json({ message: "failed to unblock theatre" });
        }
    }

    async approveTheatre(req: Request, res: Response) {
        try {
            console.log("jdjkdj this is theatre");
            
            const theatreId = req.params.theatreId;
            const theatre = await this.adminCase.approveTheatre(theatreId);
            
            if (!theatre) {
                return res.status(404).json({ message: "Theatre not found" });
            }
            return res.status(200).json({ message: "Theatre approved successfully", theatre });
        } catch (error) {
            console.error("Error approving theatre", error);
            return res.status(500).json({ message: "Failed to approve theatre" });
        }
    }

    // Decline Theatre
    async declineTheatre(req: Request, res: Response) {
        try {
            const theatreId = req.params.theatreId;
            const theatre = await this.adminCase.declineTheatre(theatreId);
            
            if (!theatre) {
                return res.status(404).json({ message: "Theatre not found" });
            }
            return res.status(200).json({ message: "Theatre declined successfully", theatre });
        } catch (error) {
            console.error("Error declining theatre", error);
            return res.status(500).json({ message: "Failed to decline theatre" });
        }
    }
}
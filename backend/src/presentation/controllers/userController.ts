import {NextFunction, Request,Response} from 'express'
import { UserUseCases } from '../../application/usecases/user'
import { log } from 'node:console';

export class UserController{
    constructor(private userUseCases:UserUseCases){}

    async register(req:Request,res:Response)
    {
        try{

            console.log("lksksl",req.body);
            
      const user=await this.userUseCases.register(req.body)
      if(user=='403')
      {
        res.status(403).json({message:"your email is already registered try different email"})
      }
      else{
         res.status(201).json(user)
      }
        }
        catch(error)
        {
            res.status(500).json({error:"Failed to reigister user"})
        }
    }

    async login(req:Request,res:Response)
    {
        try{

            console.log(req.body,"jhbjh");
            
            const{email,password}=req.body
            const user=await this.userUseCases.login(email,password)
            console.log(user,"ifhih");
            
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            if (user.user.is_blocked) {
                return res.status(403).json({ message: "Your Account has been blocked" });
            }
            
                console.log(user,"user");

                const{refreshToken}=user as{refreshToken:string}
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV==="production",  // Only send secure cookies in production
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                
                return res.status(200).json(user)
            }
            
        
        catch(error)
        {
            res.status(500).json({error:'failed to login'})
        }

    }

    async home(req:Request,res:Response,next:NextFunction)
    {
        res.status(200).json({message:"welcome to the homepage"})
    }

    async forgotPassword(req:Request,res:Response){
        try{
            const {email}=req.body
            await this.userUseCases.sendOtp(email)
            res.status(200).json({message:"Otp sent successfully"})

        }
        catch(error)
        {
            res.status(500).json({error:"Failed to send otp"})
        }
    }

    async verifyUser(req:Request,res:Response)
    {
        try{
            const {token,otp}=req.body
            console.log(req.body,"fkdnfj");
            
            const isValid=await this.userUseCases.verifyUser(token,otp)
            console.log(isValid,"valid hgg");
            
            if(isValid)
            {
                console.log("true dan dana dan dan dana dan");
                
                res.status(200).json({message:"otp verified successfully"})
            }
            else
            {
                res.status(400).json({message:"Invalid OTP "})
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
            const {otp}=req.body
            const isValid=await this.userUseCases.verifyOtp(otp)
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
            const {newPassword}=req.body
            await this.userUseCases.resetPassword(newPassword) 
            res.status(200).json({message:"password reset successfully"}) 
        } catch (error) {
             console.log(error);
             
            res.status(500).json({error:"failed to reset password"})
        }
    }

    async resendOtp(req:Request,res:Response)
    {
        try{
           const {token}=req.body
          const user= await this.userUseCases.resendOtp(token)
           res.status(200).json({message:"otp has been resent successfully",user})
        }
        catch(error)
        {
            console.log(error);
            
            res.status(500).json({message:'failed to resend otp'})
        }
    }

//     async updateProfile(req: Request, res: Response,next:NextFunction) {
//         try {
//             console.log("hello i am in user profile");
//             console.log("this is update body parts",req.body);
            
//             const userId = req.user?.id; 
//             console.log(userId);
            
//             const profileData = req.body;

        
//             const updatedUserData = await this.userUseCases.updateProfile(userId, profileData);

        
//             res.status(200).json({
//                 message: 'Profile updated successfully',
//                 data: updatedUserData,
//             });
//         } catch (error) {
//             console.log(error);
            
//             res.status(500).json({message:'failed to update Profile'}) 
//         } 
// }

async updateUserProfile(req: Request, res: Response,next:NextFunction): Promise<Response> {
    const { name, email, mobile, oldPassword, newPassword } = req.body;
    console.log(req.user,"req user");
    
    const userId = req.user?.id; // Assuming the user is authenticated and you get the ID from the token/session

    try {
      // Call the use case and pass the necessary data
      console.log(req.body,"body details");
      
      const result = await this.userUseCases.updateProfile(userId, {
        name,
        email,
        mobile,
        oldPassword,
        newPassword,
      });

      // If the result is null (user not found or no updates), return a meaningful message
      if (!result) {
        return res.status(404).json({ success: false, message: 'User not found or no updates made' });
      }

      // Return a success response if the profile was updated
      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: result });
    } catch (error) {
      // Handle errors with a type guard
    if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      // Handle unexpected errors
      return res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
    
  }


async upcomingMovies(req:Request,res:Response,next:NextFunction){
    try {
        const { page = 1, limit = 10, search = '', genre = '', language = '' } = req.query;

        // Filters based on query parameters
        let filters: any = {};
        if (genre) filters.genre = genre;
        if (language) filters.language = language;
        if (search) filters.title = { $regex: search, $options: "i" }; // Case-insensitive search

        // Pagination
        const totalMovies = await this.userUseCases.upcomingMoviesCount(filters); // Get total count for pagination
        const upcomingMovieData = await this.userUseCases.upcomingMovies(filters, Number(page), Number(limit)); // Fetch data

        res.status(200).json({
            message: "Here are the upcoming movies",
            upcomingMovies: upcomingMovieData,
            totalMovies,
            totalPages: Math.ceil(totalMovies / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        console.log(error);
            
            res.status(500).json({message:'failed to load upcoming movies'})
    }
}

async nowShowingMovies(req:Request,res:Response,next:NextFunction){
    try {
        const { page = 1, limit = 10, search = '', genre = '', language = '' } = req.query;

        // Filters based on query parameters
        let filters: any = {};
        if (genre) filters.genre = genre;
        if (language) filters.language = language;
        if (search) filters.title = { $regex: search, $options: "i" }; // Case-insensitive search

        // Pagination
        const totalMovies = await this.userUseCases.nowShowingMoviesCount(filters); // Get total count for pagination
        const nowShowingMovieData = await this.userUseCases.nowShowingMovies(filters, Number(page), Number(limit)); // Fetch data

        res.status(200).json({
            message: "These are the movies running in cinemas",
            runningMovies: nowShowingMovieData,
            totalMovies,
            totalPages: Math.ceil(totalMovies / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        console.log(error);
            
            res.status(500).json({message:'failed to load now Showing movies'})
    }
}
}
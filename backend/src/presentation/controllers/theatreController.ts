import {NextFunction, Request,Response} from 'express'
import { TheatreUseCase } from '../../application/usecases/theatre';
import { FileUploadService } from '../../infrastructure/services/fileService';
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService';
import { BookingMovies } from '../../application/usecases/booking';

export class TheatreController{
    constructor(private theatreUseCase:TheatreUseCase,private fileUploadService:FileUploadService,private CloudinaryService:CloudinaryService,private bookingUseCase:BookingMovies){}

    async register(req:Request,res:Response)
    {
        try{

            let theatreLicensePath = '';
            if (req.file) {
                theatreLicensePath =await this.fileUploadService.saveFile(req.file) 
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
           const theatreId = req.theatre?.id as string
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

    // async fetchRunningMovies(req: Request, res: Response,next:NextFunction): Promise<void> {
    //     try {
    //        const theatreId = req.theatre?.id; // Assuming JWT middleware sets user in req
    //        console.log(theatreId,"theatreid");
           
    //         const movieData = await this.theatreUseCase.rollingMovies();
    //         console.log(movieData,"MovieData ");
            
    //         res.status(200).json({movieData,message:"Movies has been loaded from backend successfully"});
    //     } catch (error) {
    //         res.status(500).json({ message: "failed to complete theatre profile"});
    //     }
    // }


    async bookingTrends(req: Request, res: Response): Promise<Response> {
        try {
            const { interval } = req.query;
            if (!interval) {
                return res.status(400).json({ message: "Interval is required" });
            }
          console.log(req.headers,"req headers");
          
            const theatreId=req.headers.theatreid

            const bookingTrend = await this.bookingUseCase.theatreBookingTrends(interval as string,theatreId as string);

            console.log(bookingTrend,"bookingTrend")
            
            return res.status(200).json({ message: "Booking trends fetched successfully", bookingTrend });
        } catch (error) {
            console.error("Error fetching booking trends", error);
            return res.status(500).json({ message: "Failed to fetch booking trends" });
        }
    }

    async revenueTrends(req: Request, res: Response): Promise<Response> {
        try {
            const { interval } = req.query; 
            if (!interval) {
                return res.status(400).json({ message: "Interval is required" });
            }
             
            const theatreId=req.headers.theatreid
            const revenueTrend = await this.bookingUseCase.theatreRevenueTrends(interval as string,theatreId as string);
            console.log(revenueTrend,"revenueTrend")
            
            return res.status(200).json({ message: "Revenue trends fetched successfully", revenueTrend });
        } catch (error) {
            console.error("Error fetching revenue trends", error);
            return res.status(500).json({ message: "Failed to fetch revenue trends" });
        }
    }

    async listTheatreShowtimes(req:Request,res:Response,next:NextFunction){
        const { screenId,date } = req.query;
      try {
        console.log(req.query,"jhjjk");
        // const userCoords: UserCoordinates = {
        //     latitude: parseFloat(req.query.latitude as string),
        //     longitude: parseFloat(req.query.longitude as string),
        //   };
        //const objectIdMovieId = new Types.ObjectId(movieId as string);
    
        const showtimes = await this.theatreUseCase.getTheatreShowtimes(screenId as string,date as string);
        console.log(showtimes,"showtimes");
        
        res.status(200).json({message:"available showtimes for movie in this region",showtimes});
      } catch (error:any) {
        console.log(error,"error");
        
        res.status(500).json({ error: 'Error fetching showtimes' });
      }
    }
    async showtimeSeatLayout(req:Request,res:Response){
    
        try {
          console.log(req.body,"booking data from frontend")
          const {showtimeId}=req.params
          const seatData = await this.theatreUseCase.showtimeSeats(showtimeId as string)
          console.log(seatData,"booking data in contorller")
          
          res.status(200).json({message:"seatlayout on this showtime",seatData})
        } catch (error:any) {
          console.log(error,"error");
          
          res.status(500).json({ error: 'Error fetching showtimes' });
        }
      }

      async bookMovieTickets(req:Request,res:Response){
    
        try {
          console.log(req.body,"booking data from frontend")
          
          const bookingData = await this.bookingUseCase.theatreSideBooking(req.body)
          console.log(bookingData,"booking data in contorller")
          
          res.status(200).json({message:"tickets have been reserved for this seats on this showtime",bookingId:bookingData._id})
        } catch (error:any) {
          console.log(error,"error");
          
          res.status(500).json({ error: 'Error fetching showtimes' });
        }
      }

      async getBookings(req: Request, res: Response): Promise<void> {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
            const theatreId=req.query.theatreId as string
          const { bookings, total } = await this.bookingUseCase.getTheatrebookingHistory(page, limit,theatreId);
          res.status(200).json({
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
          });
        } catch (error) {
          res.status(500).json({ message: "Error fetching bookings", error });
        }
      }

      
}
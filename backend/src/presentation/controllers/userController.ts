import {NextFunction, Request,Response} from 'express'
import { UserUseCases } from '../../application/usecases/user'
import { log } from 'node:console';
import { UserCoordinates } from '../../Domain/entities/user';
import { Types } from 'mongoose';
import { BookingMovies } from '../../application/usecases/booking';

export class UserController{
    constructor(private userUseCases:UserUseCases,private bookingUseCase:BookingMovies){}

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

async listShowtimes(req:Request,res:Response,next:NextFunction){
    const { movieId, date,userCoords } = req.query;
  try {
    console.log(req.query,"jhjjk");
    const userCoords: UserCoordinates = {
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
      };
    const objectIdMovieId = new Types.ObjectId(movieId as string);

    const showtimes = await this.userUseCases.getShowtimes(objectIdMovieId, date as string,userCoords as UserCoordinates);
    console.log(showtimes,"showtimes");
    
    res.status(200).json({message:"available showtimes for movie in this region",showtimes});
  } catch (error:any) {
    console.log(error,"error");
    
    res.status(500).json({ error: 'Error fetching showtimes' });
  }
}
async listTheatreShowtimes(req:Request,res:Response,next:NextFunction){
    const { theatreId,date } = req.query;
  try {
    console.log(req.query,"jhjjk");
    // const userCoords: UserCoordinates = {
    //     latitude: parseFloat(req.query.latitude as string),
    //     longitude: parseFloat(req.query.longitude as string),
    //   };
    //const objectIdMovieId = new Types.ObjectId(movieId as string);

    const showtimes = await this.userUseCases.getTheatreShowtimes(theatreId as string,date as string);
    console.log(showtimes,"showtimes");
    
    res.status(200).json({message:"available showtimes for movie in this region",showtimes});
  } catch (error:any) {
    console.log(error,"error");
    
    res.status(500).json({ error: 'Error fetching showtimes' });
  }
}

async bookMovieTickets(req:Request,res:Response){
    
  try {
    console.log(req.body,"booking data from frontend")
    
    const bookingData = await this.bookingUseCase.createBooking(req.body)
    console.log(bookingData,"booking data in contorller")
    
    res.status(200).json({message:"tickets have been reserved for this seats on this showtime",bookingId:bookingData._id})
  } catch (error:any) {
    console.log(error,"error");
    
    res.status(500).json({ error: 'Error fetching showtimes' });
  }
}



// async confirmMovieTickets(req:Request,res:Response){
    
//     try {
//       console.log(req.body,"booking data from frontend")
//       const {bookingId,totalCost}=req.body
//       const bookingData = await this.bookingUseCase.confirmPayment(bookingId,totalCost)
//       console.log(bookingData,"booking data in contorller")
      
//       res.status(200).json({message:"booking has been confirmed with the payment",bookingData,success:true})
//     } catch (error:any) {
//       console.log(error,"error");
      
//       res.status(500).json({ error: 'Error fetching showtimes' });
//     }
//   }
  
  async initiateOrder(req:Request,res:Response){
    
    try {
      console.log(req.body,"booking data from frontend")
      const {amount,currency,receipt,bookingId}=req.body

      const paymentData = await this.bookingUseCase.createOrder(amount,currency,receipt,bookingId)
      console.log(paymentData,"payment data in contorller")
       if(!paymentData)
       {
        res.status(403).json({message:"your session has been expired",success:false})
       }
       else{
      res.status(200).json({message:"Razorpay has been initiated with the payment",paymentData,success:true})
       }
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error having initiating razorpay' });
    }
  }

  async verifyPayment(req:Request,res:Response){
    
    try {
      console.log(req.body,"booking data from frontend for confirming payment")
      const {paymentDetails, bookingId,totalCost } = req.body;
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature}=paymentDetails;
      const paymentVerified = this.bookingUseCase.verifyPayment( razorpay_order_id,razorpay_payment_id,razorpay_signature);
      const bookingData = await this.bookingUseCase.confirmMovieTickets(bookingId,totalCost)
      console.log(bookingData,"booking data in contorller")
      
      console.log(paymentVerified,"payment data in contorller")
      
      res.status(200).json({message:"booking has been confirmed with the payment",success:paymentVerified&&bookingData?true:false})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error in verifying signature in payment verfication' });
    }
  }

  async showtimeSeatLayout(req:Request,res:Response){
    
    try {
      console.log(req.body,"booking data from frontend")
      const {showtimeId}=req.query
      const seatData = await this.userUseCases.showtimeSeats(showtimeId as string)
      console.log(seatData,"booking data in contorller")
      
      res.status(200).json({message:"seatlayout on this showtime",seatData})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching showtimes' });
    }
  }
  async bookingOrders(req:Request,res:Response){
    
    try {
      console.log(req.body,"booking data from frontend")
      const {userId}=req.query
      const bookingData = await this.bookingUseCase.bookingHistory(userId as string)
      console.log(bookingData,"booking data for user")
      
      res.status(200).json({message:"movie booking history of this user",bookingData})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching movie booking history' });
    }
  }

  async cancelTickets(req:Request,res:Response){
    
    try {
      console.log(req.query,"booking Id from frontend")
      const {bookingId}=req.query
      const bookingData = await this.bookingUseCase.cancelMovieTickets(bookingId as string)
      console.log(bookingData,"booking data in contorller")
      
      res.status(200).json({message:"tickets have been reserved for this seats on this showtime",success:bookingData})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching showtimes' });
    }
  }
  
  
}
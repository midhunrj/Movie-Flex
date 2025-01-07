import {NextFunction, Request,Response} from 'express'
import { UserUseCases } from '../../application/usecases/user'
import { log } from 'node:console';
import { UserCoordinates } from '../../Domain/entities/user';
import { Types } from 'mongoose';
import { BookingMovies } from '../../application/usecases/booking';
import { Notification } from '../../application/usecases/notification';
import { socketService } from '../../infrastructure/websocket/socketService';
import { NotificationType } from '../../Domain/entities/notification';

export class UserController{
    constructor(private userUseCases:UserUseCases,private bookingUseCase:BookingMovies,private notificationUsecase:Notification, ){}

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
            const userData=await this.userUseCases.login(email,password)
            console.log(userData,"ifhih")
            
            if (!userData) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            
            if (userData.user.is_blocked) {
                return res.status(403).json({ message: "Your Account has been blocked" });
            }
            
                console.log(userData,"user");
              const wallet=  await this.userUseCases.walletByUser(userData.user.id!)
              
                const{refreshToken}=userData as{refreshToken:string}
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV==="production",  // Only send secure cookies in production
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                const user={...userData,wallet}
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

    
      if (!result) {
        return res.status(404).json({ success: false, message: 'User not found or no updates made' });
      }

      
      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: result });
    } catch (error) {
      
    if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      
      return res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
    
  }


async upcomingMovies(req:Request,res:Response,next:NextFunction){
    try {
        const { page, limit = 8, search = '', genre = '', language = '',sortBy } = req.query;

        
        let filters: any = {};
        if (genre) filters.genre = genre;
        if (language) filters.language = language;
        if (search) filters.title = { $regex: search, $options: "i" }; 

        const sortOptions: any = {};
        switch (sortBy) {
            case 'rating':
                sortOptions.rating = -1; 
                break;
            case 'popularity':
                sortOptions.popularity = -1; 
                break;
            case 'releaseDate':
            default:
                sortOptions.releaseDate = 1; 
                break;
        }    
    

        const totalMovies = await this.userUseCases.upcomingMoviesCount(filters); 
        const upcomingMovieData = await this.userUseCases.upcomingMovies(filters, Number(page), Number(limit),sortOptions); 

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
        const { page, limit = 8, searchQuery, genre, language,sortBy } = req.query;
        console.log(req.query,"req query gfffhg");
        
        console.log(sortBy,"sortby from query");
        
        let filters: any = {};
        if (genre) filters.genre = genre;
        if (language) filters.language = language;
        if (searchQuery) filters.search =searchQuery 
        const sortOptions: any = {};
        switch (sortBy) {
            case 'rating':
                sortOptions.rating = -1; 
                break;
            case 'popularity':
                sortOptions.popularity = -1; // Descending order for popularity
                break;
            case 'releaseDate':
            default:
                sortOptions.releaseDate = -1; // Ascending order for releaseDate
                break;
        }
        
        const totalMovies = await this.userUseCases.nowShowingMoviesCount(filters); // Get total count for pagination
        const nowShowingMovieData = await this.userUseCases.nowShowingMovies(filters, Number(page), Number(limit),sortOptions); // Fetch data
         console.log(nowShowingMovieData,"now showing  after search");
         
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
    console.log("nlm,m");
    
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
    const { screenId,date } = req.query;
  try {
    console.log(req.query,"jhjjk");
    // const userCoords: UserCoordinates = {
    //     latitude: parseFloat(req.query.latitude as string),
    //     longitude: parseFloat(req.query.longitude as string),
    //   };
    //const objectIdMovieId = new Types.ObjectId(movieId as string);

    const showtimes = await this.userUseCases.getTheatreShowtimes(screenId as string,date as string);
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
    
    const bookingData = await this.bookingUseCase.userSideBooking(req.body)
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

      console.log(process.env.Razorsecret_Key,process.env.Razorpay_id_Key,"razorsecrets");
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
      const {paymentMethod,paymentDetails, bookingId,totalPrice,Description } = req.body;
      
      if(paymentMethod=="online")
      {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature}=paymentDetails;
      const paymentVerified = this.bookingUseCase.verifyPayment( razorpay_order_id,razorpay_payment_id,razorpay_signature);
      console.log(paymentVerified,"payment data in contorller")
      
      }
      else if(paymentMethod=="wallet")
      {
        const userWallet=await this.userUseCases.walletByUser(req.user?.id!)
        
        if(userWallet?.balance!<totalPrice)
        {
          return res.status(400).json({message:"insufficeint balance in wallet"})
        }
        const type='Debit'
         await this.userUseCases.updateUserWallet(req.user?.id!,-totalPrice,Description,type)
      }
      const bookingData = await this.bookingUseCase.confirmMovieTickets(bookingId,totalPrice)
      console.log(bookingData,"booking data in contorller")
      const recipients={
        recipientId:req.user?.id,
        recipientRole:req.user?.role
      }
      const type=NotificationType.BOOKING_CONFIRMATION
      const title="Booking Confirmed"
      const message= `Your ticket for ${bookingData.movieId.title} has been booked successfully.`
      const data = {
        bookingId: bookingData._id,
        movieDetails: {
          name: bookingData.movieId.title,
          image: bookingData.movieId.poster_path,
        },
        screenData: {
          screenName: bookingData.screenData?.screenName,
          screenType: bookingData.screenData?.screenType,
          tierName:bookingData.screenData?.tierName
        },
        // theatreDetails: {
        //   name: bookingData.theatreDetails?.name,
        //   address: bookingData.theatreDetails?.address,
        // },
        showDetails: {
          showtime: bookingData.showtime,
          showDate: bookingData.showDate,
        },
        selectedSeats: bookingData.selectedSeats,
        totalPrice: bookingData.totalPrice,
      };
  
      await this.notificationUsecase.newNotification({
        recipients,
        type,
        title,
        message,
        data,
      });
  const {userId,theatreId,selectedSeats}=bookingData
  console.log("booking Data for theatre notification");
  
     await this.notificationUsecase.newNotification({
      recipients:[{recipientId:theatreId,recipientRole:"theatre"}],
      type,
      title,
      message:`the tickets of your screen ${bookingData.screenData.screenName} for the movie ${bookingData.movieId.title} at the showtime ${bookingData.showtime} on ${bookingData.showDate} has been booked successfully by user ${bookingData.userId.name}`,
      data
    })
      socketService.sendNotification(theatreId, 'theatre-owner', 'booking-confirmed', {
        userId,
        selectedSeats,
        bookingId: bookingData._id,
    });
      
      res.status(200).json({message:"booking has been confirmed with the payment",success:true})
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
      const {userId,page,limit}=req.query
      const limits=parseInt(limit as string)
      const pageNumber=parseInt(page as string)
      const {bookings,total} = await this.bookingUseCase.bookingHistory(userId as string,limits,pageNumber)
      //console.log(bookingData,"booking data for user")
      
      res.status(200).json({message:"movie booking history of this user",bookingData:bookings,totalPages: Math.ceil(total / limits)})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching movie booking history' });
    }
  }

  async cancelTickets(req:Request,res:Response){
    
    try {
      console.log(req.query,"booking Id from frontend")
      const {bookingId}=req.query
      const {refundAmount}=req.body
      const type='Credit'
      const userId=req.user?.id!
      console.log(req.user,"req user");
      
      const description:string=`The movie you have booked with an id ${bookingId} has been cancelled and the amount Rs.${refundAmount} has been credited into your account`
         await this.userUseCases.updateUserWallet(userId,refundAmount,description,type)
      const cancelTicket = await this.bookingUseCase.cancelMovieTickets(bookingId as string)
      if(cancelTicket)
      {  
      const bookingData=await this.bookingUseCase.getBookingDetail(bookingId as string)
      //console.log(bookingData,"booking data in contorller")
      const data = {
        bookingId: bookingData?._id,
        movieDetails: {
          name: bookingData?.movieId?.title,
          image: bookingData?.movieId?.poster_path,
        },
        screenData: {
          screenName: bookingData.screenData?.screenName,
          screenType: bookingData.screenData?.screenType,
          tierName:bookingData.screenData?.tierName
        },
        // theatreDetails: {
        //   name: bookingData.theatreDetails?.name,
        //   address: bookingData.theatreDetails?.address,
        // },
        showDetails: {
          showtime: bookingData.showtime,
          showDate: bookingData.showDate,
        },
        selectedSeats: bookingData.selectedSeats,
        totalPrice: bookingData.totalPrice,
      };
      const notificationData = {
        recipients:[{recipientId:req.user?.id,recipientRole:req.user?.role!}],
        type: NotificationType.TICKET_CANCEL,
        title: 'Ticket Cancelled',
        message: `Your ticket with ID ${bookingId} has been cancelled successfully. Refund of Rs.${refundAmount} has been processed.`,
        data: { bookingId },
      };
      await this.notificationUsecase.newNotification(notificationData);
    }
      res.status(200).json({message:"tickets have been reserved for this seats on this showtime",success:cancelTicket})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching showtimes' });
    }
  }
  
  async postRating(req:Request,res:Response){
    
    try {
      console.log(req.query," user ud from frontend")
      const {userId}=req.query
      const {movieId,rating}=req.body
      
      const movieData = await this.userUseCases.ratingMovie(movieId,rating,userId as string)
      console.log(movieData,"booking data in contorller")
      
      res.status(200).json({message:"tickets have been reserved for this seats on this showtime",movieData})
    } catch (error:any) {
      console.log(error,"error");
      
      res.status(500).json({ error: 'Error fetching showtimes' });
    }
  }

  async userWallet(req: Request, res: Response) {
    //const {userId} = req.params

    try {
      const userId:string=req.user?.id!
      console.log(userId,req.params,"user with params")
      const wallet = await this.userUseCases.walletByUser(userId);
      res.status(200).json(wallet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch wallet data' });
    }
  }

  async updateWallet(req: Request, res: Response) {
    const { userId, amount, description, type } = req.body;

    try {
      await this.userUseCases.updateUserWallet(userId, amount, description, type);
      res.status(200).json({ message: 'Wallet updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update wallet' });
    }
  }
  
  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const { recipients, type, title, message, data } = req.body;

      await this.notificationUsecase.newNotification({
        recipients,
        type,
        title,
        message,
        data,
      });

      res.status(201).json({ message: "Notification created successfully" });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { recipientId, role } = req.params;

      const notifications = await this.notificationUsecase.userNotification(
        recipientId,
        role
      );

      res.status(200).json(notifications);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
  
}
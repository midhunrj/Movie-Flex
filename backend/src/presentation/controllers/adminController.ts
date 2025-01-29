import {Request,Response} from 'express'
import { AdminUseCase } from '../../application/usecases/admin';
import { BookingMovies } from '../../application/usecases/booking';
import { HttpStatusCodes } from '../../types/enums/httpStatusCode';

export class AdminController{
    constructor(private adminCase:AdminUseCase,private bookingUsecase:BookingMovies){}

    

    async login(req:Request,res:Response)
    {
        try{

            console.log(req.body,"jhbjh");
            
            const{email,password}=req.body
            
            const admin=await this.adminCase.login(email,password)
            console.log(admin,"ifhih adm");
            
            if (!admin) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: "Invalid credentials" });
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
                return res.status(HttpStatusCodes.OK).json(admin)
            }
            
        
        catch(error)
        {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({error:'failed to login'})
        }

    }

    async home(req:Request,res:Response)
    {
        res.status(HttpStatusCodes.OK).json({message:"welcome to the homepage"})
    }

    async userData(req:Request,res:Response)
    {
        try {
            console.log('errererer',req.cookies)
           const userData= await this.adminCase.fetchUserDetails()
           res.status(HttpStatusCodes.OK).json({message:"here all the user data available",userData})
        } catch (error) {
            
        }
    }

    async theatreData(req:Request,res:Response)
    {
        try {
            console.log("eeklmekle");
            
           const theatreData= await this.adminCase.fetchTheatreDetails()
           console.log(theatreData,"the data");
           
           res.status(HttpStatusCodes.OK).json({message:"here all the user data available",theatreData})
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
            
            res.status(HttpStatusCodes.OK).json({message:"the user has been blocked",user})
        }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to blcok user" });
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
            res.status(HttpStatusCodes.OK).json({message:"the user has been unblocked",user})
            }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to unblock user" });
        }
    }

    
    async blockTheatre(req:Request,res:Response)
    {
        try{
            console.log("eeklembi");
              let theatreId=req.params.theatreId
            const theatre=await this.adminCase.blockTheatre(theatreId)
            console.log("after block",theatre);
            
            res.status(HttpStatusCodes.OK).json({message:"the user has been blocked",theatre})
        }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message:"failed to blcok theatre" });
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
            res.status(HttpStatusCodes.OK).json({message:"the user has been unblocked",theatre})
            }
        catch(error)
        {
            console.error("Error blocking/unblocking user/theatre", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to unblock theatre" });
        }
    }

    async approveTheatre(req: Request, res: Response) {
        try {
            console.log("jdjkdj this is theatre");
            
            const theatreId = req.params.theatreId;
            const theatre = await this.adminCase.approveTheatre(theatreId);
            
            if (!theatre) {
                return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Theatre not found" });
            }
            return res.status(HttpStatusCodes.OK).json({ message: "Theatre approved successfully", theatre });
        } catch (error) {
            console.error("Error approving theatre", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to approve theatre" });
        }
    }

    async declineTheatre(req: Request, res: Response) {
        try {
            const theatreId = req.params.theatreId;
            const theatre = await this.adminCase.declineTheatre(theatreId);
            
            if (!theatre) {
                return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Theatre not found" });
            }
            return res.status(HttpStatusCodes.OK).json({ message: "Theatre declined successfully", theatre });
        } catch (error) {
            console.error("Error declining theatre", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to decline theatre" });
        }
    }
    
    async dashboardOverview(req: Request, res: Response) {
        try {
            const dashboardData=await this.bookingUsecase.overviewDashboarrd()
            return res.status(HttpStatusCodes.OK).json({ message: "here the below  details of bookings dashboard",dashboardData});
        } catch (error) {
            console.error("Error declining theatre", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to decline theatre" });
        }
    }
    async bookingTrends(req: Request, res: Response): Promise<Response> {
        try {
            const { interval } = req.query;
            if (!interval) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Interval is required" });
            }

            const bookingTrend = await this.bookingUsecase.fetchBookingTrends(interval as string);

            console.log(bookingTrend,"bookingTrend")
            
            return res.status(HttpStatusCodes.OK).json({ message: "Booking trends fetched successfully", bookingTrend });
        } catch (error) {
            console.error("Error fetching booking trends", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch booking trends" });
        }
    }

    async revenueTrends(req: Request, res: Response): Promise<Response> {
        try {
            const { interval } = req.query; 
            if (!interval) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Interval is required" });
            }

            const revenueTrend = await this.bookingUsecase.fetchRevenueTrends(interval as string);
            console.log(revenueTrend,"revenueTrend")
            
            return res.status(HttpStatusCodes.OK).json({ message: "Revenue trends fetched successfully", revenueTrend });
        } catch (error) {
            console.error("Error fetching revenue trends", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch revenue trends" });
        }
    }

    async getBookings(req: Request, res: Response): Promise<void> {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
    
          const { bookings, total } = await this.bookingUsecase.getbookingHistory(page, limit);
          res.status(HttpStatusCodes.OK).json({
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
          });
        } catch (error) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching bookings", error });
        }
      }

}
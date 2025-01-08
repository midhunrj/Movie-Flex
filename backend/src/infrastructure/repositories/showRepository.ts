import { Types } from "mongoose";
import { IShowRepository } from "../../application/repositories/iShowRepository";
import { Row, Showtime, TierData } from "../../Domain/entities/shows";
import { UserCoordinates } from "../../Domain/entities/user";
import { Screen, ScreenModel } from "../database/models/screenModel";
import showModel, { IRow, IShowtime, ITier } from "../database/models/showModel";
import { theatreModel } from "../database/models/theatreModel";
import { BookingModel, IBooking } from "../database/models/bookingModel";
import { userModel } from "../database/models/userModel";
import walletModel from "../database/models/walletModel";

import { NotificationType } from "../database/models/notficationModel";
import { NotificationRepository } from "./notficationRepository";
import { RefundService } from "../services/refundService";
import { WalletRepository } from "./walletRepository";
const walletRepo = new WalletRepository();
const notificationRepo = new NotificationRepository();
const refundService = new RefundService( notificationRepo,walletRepo)

export class ShowRepository implements IShowRepository {
  async createShowtimes(showData: any): Promise<void> {
    const { movieId, theatreId, screenId, showtime, startDate, totalSeats, endDate, seatLayout } = showData;
    
    console.log(seatLayout[0].rows[0].seats,"seatLyout in showtime creation");
    
    const oldshowtimes=await showModel.countDocuments({screenId,showtime})
    const start = new Date(startDate);
    const end = new Date(endDate);

    const showtimeDocs: IShowtime[] = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      if(oldshowtimes>0)
      {
        const deletingShowtimes=await showModel.find({screenId,showtime,date:new Date(d)})

        for(const showtime of deletingShowtimes)
        {
         await refundService.refundBookingCancellation(showtime._id as string)
        }

      await showModel.deleteMany({screenId,showtime,date:new Date(d)})
      }
      
      const newShowtime: IShowtime = new showModel({
        movieId,
        theatreId,
        screenId,
        showtime,
        date: new Date(d),
        totalSeats,
        seatLayout,
      });

      //console.log(showtimeDocs[0].seatLayout[0].rows[0].seats,"showtimeDocs");
      
      showtimeDocs.push(newShowtime);
    }
     console.log(endDate,"endDate",end)
     const screenData = await ScreenModel.findOne({ _id: screenId });


     if (screenData) {
      
      screenData.showtimes.forEach((show) => {
          if (show.time === showtime) {
            if (!show.expiryDate) {
              
              show.expiryDate = endDate;
                } 
             }
      });

      
      await screenData.save();
  }
    await showModel.insertMany(showtimeDocs);

  }

  async deleteExpiredShowtimes(currentDate: Date): Promise<void> {
    await showModel.deleteMany({ date: { $lt: currentDate } });
  }

  // async listShowtimes(
  //   movieId: Types.ObjectId,
  //   date: string,
  //   userCoords: UserCoordinates
  // ): Promise<IShowtime[]> {
  //   const targetDate = new Date(date);
  //   const currentDate = new Date();
  
  //   const radiusInKm = 25;
  //   const earthRadiusInKm = 6378.1;
  //   const radiusInRadians = radiusInKm / earthRadiusInKm;
  
  //   // Step 1: Find theatres within a 25 km radius
  //   console.log(userCoords,"usercooridnates in showrepository");
    
  //   const nearbyTheatres = await theatreModel.find({
  //     location: {
  //       $geoWithin: {
  //         $centerSphere: [[userCoords.longitude, userCoords.latitude], radiusInRadians],
  //       },
  //     },
  //   })
  //   .select('_id name address location')
  //   .lean();
  
  //   const nearbyTheatreIds = nearbyTheatres.map((theatre) => theatre._id);
  
    
  //   const screens = await ScreenModel.find({
  //     'enrolledMovies.movieId': movieId,
  //     'showtimes.time': { $exists: true },
  //     theatreId: { $in: nearbyTheatreIds },
  //   })
  //   .select('theatreId screenName screenType showtimes enrolledMovies seatLayout')
  //   .populate({
  //     path: 'theatreId',
  //     select: 'name address location',
  //   })
    
  //   // .populate({
  //   //   path: 'movieId',
  //   //   select: 'title genre duration releaseDate',
  //   // })
  //   .lean();
  
  //   const filteredShowtimes: IShowtime[] = screens.flatMap((screen) => {
  //     // Find the showtime in the screen's showtimes array where movieId matches the provided movieId
  //     const movieShowtime = screen.showtimes.find(
  //       (show) => show.movieId && show.movieId.includes(movieId.toString())
  //     );
    
  //     if (!movieShowtime) return []; // If no matching movieId is found in showtimes, skip this screen
    
  //     // Filter showtimes based on the target date and future showtimes
  //     const showtimesForDate = screen.showtimes.filter((show) => {
  //       const showDate = new Date(show.date);
  //       const showTime = new Date(`${show.date}T${show.time}`);
        
  //       // Ensure that show is on the target date and is a future showtime
  //       return (
  //         showDate.toDateString() === targetDate.toDateString() &&
  //         (targetDate.toDateString() !== currentDate.toDateString() ||
  //           showTime > new Date(currentDate.getTime() + 60 * 60 * 1000)) // Only future showtimes
  //       );
  //     });
    
  //     console.log(showtimesForDate,"showtimesfordate");
  //     return showtimesForDate.map((show) => new showModel({
  //       movieId: movieId,
  //       theatreId: screen.theatreId,
  //       screenId: screen._id,
  //       showtime: show.time,
  //       date: targetDate,
  //       totalSeats: calculateTotalSeats(screen),
  //       seatLayout: getSeatLayout(screen),
  //     }));
  //   });
    
    
  //    console.log(filteredShowtimes,"filtered shows");
     
  //   return filteredShowtimes;
  // }
  
  // Function to calculate total number of seats in a screen
  async listShowtimes(
    movieId: Types.ObjectId,
    date: string,
    userCoords: UserCoordinates,
    priceRange?: number,
    timeFilter?: string
  ): Promise<IShowtime[]> {
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    const currentTime = currentDate.toISOString();
    console.log(currentTime, "current timee");
  
    const radiusInKm = 25;
    const earthRadiusInKm = 6378.1;
    const radiusInRadians = radiusInKm / earthRadiusInKm;
          console.log(userCoords,"user coordinat");
          
    
    const nearbyTheatres = await theatreModel
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [[userCoords.longitude, userCoords.latitude], radiusInRadians],
          },
        },
      })
      .select('_id name address location')
      .lean()
  
      console.log(nearbyTheatres,"hghgfghfgffhgf");
      
    const nearbyTheatreIds = nearbyTheatres.map((theatre) => theatre._id);
  
    // Query for showtimes
    const showtimes = await showModel
      .find({
        movieId,
        theatreId: { $in: nearbyTheatreIds },
        date: new Date(date), // Match the selected date
      })
      .populate<{ screenId: Screen }>('screenId', 'screenName screenType tiers')
      .populate('theatreId', 'name address location')
      .lean();
    console.log(showtimes,"showtimes of date");
    
    
    const filteredShowtimes = showtimes.filter((show) => {
      if (date === today) {
        const [hour, minute] = show.showtime.split(':').map(Number);
        const showtimeDate = new Date(show.date); 
        showtimeDate.setHours(hour, minute, 0, 0); 
        return showtimeDate > currentDate; 
      }
      return true; 
    });
  
    
    const filteredByPrice = filteredShowtimes.filter((show) => {
      const screen = show.screenId as Screen; 
      if (!screen?.tiers) return false; 
      return screen.tiers.some((tier) => tier.ticketRate <= (priceRange || Infinity));
    });
  
    
    if (timeFilter && timeFilter !== 'all') {
      const filteredByTime = filteredByPrice.filter((show) => {
        const showHour = new Date(show.showtime).getHours();
        if (
          (timeFilter === 'morning' && (showHour < 6 || showHour >= 12)) ||
          (timeFilter === 'afternoon' && (showHour < 12 || showHour >= 16)) ||
          (timeFilter === 'evening' && (showHour < 16 || showHour >= 20)) ||
          (timeFilter === 'night' && (showHour < 20 || showHour >= 24))
        ) {
          return false;
        }
        return true;
      });
      return filteredByTime;
    }
  
    return filteredByPrice;
  }
  async removeShowtimes(showtime: string, screenId: string):Promise<void>{
      await showModel.deleteMany({screenId:screenId,showtime:showtime})
  }
   async listTheatreShowtimes(screenId: string,date:string): Promise<IShowtime[]> {
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    const currentTime = currentDate.toISOString();
    console.log(currentTime, "current timee");
    const showtimes = await showModel.find({ screenId,date: new Date(date) }).populate('movieId').populate('screenId').populate('theatreId');
    console.log(showtimes,"today showtimes");
    
    const filteredShowtimes = showtimes.filter((show) => {
      if (new Date(date).toISOString().split('T')[0]==today) {
        const [hour, minute] = show.showtime.split(':').map(Number);
        const showtimeDate = new Date(show.date); 
        showtimeDate.setHours(hour, minute, 0, 0); 
        return showtimeDate > currentDate; 
      }
      return true; 
    });
    console.log(filteredShowtimes,"filterred showtimes");
   
    return filteredShowtimes;
    
   }

   async getSeatlayout( showtimeId: string): Promise< ITier[]|null> {
    const showtime=await showModel.findById(showtimeId)
    if(showtime)
    {
    return showtime.seatLayout
    
    }
    return null
}

async resetSeatValues(showtimeId: Types.ObjectId,selectedSeats:string[]): Promise<IShowtime> {

  const showtime = await showModel.findById(showtimeId);
  if(showtime)
  {
  showtime.seatLayout.forEach((tier) => {
    tier.rows.forEach((row) => {
      row.seats.forEach((seat) => {
        if (selectedSeats.includes(seat.seatLabel!)) {
          
          seat.isReserved=false
           // Assuming the booking confirms directly
        }
      });
    });
  });

  await showtime?.save()
  }
  return showtime!
}

async updateShowtimes(prevTime: string, screenId: string, newTime: string) {
    const showtimes=await showModel.updateMany({screenId,showtime:prevTime},{$set:{showtime:newTime}})

    // for(const show of showtimes)
    // {
    //   show[prevTime]=newTime
    // }
    // await showtimes.save()
}
}
 
  // Function to calculate total number of seats in a screen
//  async function calculateTotalSeats(screenId:Types.ObjectId): Promise<number> {
//     try {
//       // Fetch the screen document by its ID
//       const screen = await ScreenModel.findById(screenId).lean();
  
//       if (!screen) {
//         throw new Error('Screen not found');
//       } 
//       console.log(screen,"screen da");
      
  
//       // Return the totalSeats value
//       return screen.totalSeats;
//     } catch (error) {
//       console.error(`Error calculating total seats: ${error.message}`);
//       throw error; // Rethrow the error for the calling function to handle
//       return 0
//     }
//   }
  
  // Function to extract seat layout from the screen object
  // function getSeatLayout(screen: any): ITier[] {
  //   return screen.tiers.map((tier: any) => ({
  //     tierName: tier.name,
  //     ticketRate: tier.ticketRate,
  //     rows: tier.rows.map((row: any) => ({
  //       seats: row.seats.map((seat: any) => ({
  //         seatLabel: seat.seatLabel,
  //         row: seat.row,
  //         col: seat.col,
  //         status: seat.status,
  //         userId: seat.userId,
  //         isPartition: seat.isPartition || false,
  //       })),
  //     })),
  //   }));
  

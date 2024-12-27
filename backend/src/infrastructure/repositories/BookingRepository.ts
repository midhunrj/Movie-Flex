import { Types } from "mongoose";
import { BookingRepository } from "../../application/repositories/iBookingRepsitory";
import { Booking } from "../../Domain/entities/booking";
import { Theatre } from "../../Domain/entities/theatre";
import { BookingModel, IBooking } from "../database/models/bookingModel";
import { Screen } from "../database/models/screenModel";
import showModel, { ISeatInfo } from "../database/models/showModel";
import mongoose from "mongoose";


export class MovieBookingRepository implements BookingRepository {
    async create(booking: Booking): Promise<Booking> {
        const showtime = await showModel
          .findById(booking.showtimeId)
          .populate('movieId')
          .populate('theatreId')
          .populate('screenId')
          .lean();
      const theatre=showtime?.theatreId as Theatre
      const screen=showtime?.screenId as Screen
        if (!showtime) {
          throw new Error("Showtime not found");
        }
    
        
        const generateBookingId = () => {
          const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase(); 
          return `BOOK-${randomPart}`;
        };
    
        const bookingId = generateBookingId();
    
        
        const theatreDetails = {
          name: theatre.name,
          address: theatre.address,
        };
    
        const screenData = {
          screenName: screen.screenName,
          screenType: screen.screenType,
          ticketRate: showtime.seatLayout[0].ticketRate, 
          tierName: showtime.seatLayout[0].tierName,    
        };
    
        // const movieDetails = {
        //   name: showtime.movieId.name,
        //   language: showtime.movieId.language,
        //   duration: showtime.movieId.duration,
        // };
    
        const selectedSeats = booking.selectedSeats;
        showtime.seatLayout.forEach((tier) => {
          tier.rows.forEach((row) => {
            row.seats.forEach((seat) => {
              if (selectedSeats.includes(seat.seatLabel!)) {
                seat.isReserved = true;
                if(booking.status=="Booked")
                {
                  seat.isBooked=true
                }
              }
            });
          });
        });
    
        await showModel.findByIdAndUpdate(showtime._id, showtime);
    
        
        const newBooking = await BookingModel.create({
          userId: booking.userId,
          theatreId: booking.theatreId,
          screenId: booking.screenId,
          movieId: booking.movieId,
          showtimeId: booking.showtimeId,
          showtime:showtime.showtime,
          showDate:showtime.date,
          bookingId,
          selectedSeats: booking.selectedSeats,
          totalPrice: booking.totalPrice,
          theatreDetails,
          screenData,
          createdAt: new Date(),
          expiresAt: booking.expiresAt,
          status: booking.status || "Reserved",
          paymentStatus: booking.paymentStatus || "Pending",
          cancellationPolicy: booking.cancellationPolicy,
        });
    
        return newBooking;
      }
    
  async isValid(id: string): Promise<Booking | null> {
    return await BookingModel.findById(id).lean();
  }
   async confirmBooking(booking: Booking): Promise<Partial<Booking | null>> {
    const showtime = await showModel.findById(booking.showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    const selectedSeats = booking.selectedSeats; 
    showtime.seatLayout.forEach((tier) => {
      tier.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (selectedSeats.includes(seat.seatLabel!)) {
            seat.isSelected=false
            seat.isBooked = true; 
          }
        });
      });
    });

    
    await showtime.save();
    return await BookingModel.findByIdAndUpdate(booking._id, booking, { new: true }).populate('movieId').populate('userId').lean();
 
   }
   async cancelTicket(bookingId: string): Promise<boolean> {
    try {
      console.log("gdgd");
      
      const booking = await BookingModel.findOne({_id: bookingId });
  
      if (!booking) {
        console.error(`Booking with ID ${bookingId} not found.`);
        return false; 
      }
  
    
      if (booking.status === 'Cancelled') {
        console.error(`Booking with ID ${bookingId} is already cancelled.`);
        return false; 
      }
  
      
  
    
      booking.status = 'Cancelled';
      booking.paymentStatus = 'Cancelled';
      booking.cancellationPolicy.cancellationTime = new Date();
            
      const showtime = await showModel.findById(booking.showtimeId);
      if (!showtime) {
        throw new Error("Showtime not found");
      }
      const selectedSeats = booking.selectedSeats; // Example: ["M2", "M3"]
    showtime.seatLayout.forEach((tier) => {
      tier.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (selectedSeats.includes(seat.seatLabel!)) {
            seat.isSelected=false
            seat.isBooked = false;
            seat.isReserved=false
          }
        });
      });
    });
       await showtime.save()
      await booking.save();
  
      console.log(booking,"duhuui");
      
      if (booking.cancellationPolicy.refundable) {
        const refundAmount = booking.cancellationPolicy.refundAmount;
        console.log(`Refunding ₹${refundAmount} to user ${booking.userId}.`);
  
      
        const refundSuccess = await processRefund(booking.userId, refundAmount);
        if (!refundSuccess) {
          console.error(`Refund for booking ID ${bookingId} failed.`);
          return false;
        }
  
        console.log(`Refund for booking ID ${bookingId} processed successfully.`);
      }
  
      return true; 
    } catch (error) {
      console.error(`Error cancelling booking with ID ${bookingId}:`, error);
      return false; 
    }
  }
  
  async update(booking: Booking): Promise<Booking|null> {
    return await BookingModel.findByIdAndUpdate(booking._id, booking, { new: true }).lean();
  }

  async delete(id: string | null): Promise<void> {
      await BookingModel.findByIdAndDelete(id)
  }
  async findExpiredBookings(): Promise<Booking[]> {
    console.log("kjgk for deleting");
    
    const now = new Date();
    const bookingData= await BookingModel.find({ status: "Reserved", expiresAt: { $lte: now } }).lean();

    
    return bookingData
  }

  async bookingOrderHistory(userId: string,limits:number,page:Number): Promise<{ bookings: Booking[]; total: number }> {
    const skip=(Number(page)-1)*limits
    console.log(skip,limits);
    
       const bookings=await BookingModel.find({userId:userId,paymentStatus:{$ne:"Pending"}}).populate("movieId").populate({path:"showtimeId",select:"_id showtime date"}).sort({createdAt:-1}).skip(skip).limit(limits)

       //console.log(bookingData,"bookingData for a user")
       const total = await BookingModel.countDocuments({userId:userId})
       return {bookings,total}
       
  }
  
//   async cancelBooking(id: string): Promise<void> {
//     await BookingModel.findByIdAndUpdate(id, { status: "Cancelled" });
//   }

async getBookingTrends(): Promise<{ date: string; count: number; }[]> {
     
  const trends=await BookingModel.aggregate([
    {$group:{_id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},count:{$sum:1}}},
    {$sort:{_id:1}}
  ])
  
  return trends.map((trend)=>({date:trend._id,count:trend.count}))
}

async getCancelledBookings(): Promise<number> {
    return await BookingModel.countDocuments({status:"Cancelled"})
 }

 async getActiveUsers(): Promise<number> {
     const activeUsers=await BookingModel.distinct("userId")
     return activeUsers.length
 }

 async getRevenueTrends(): Promise<{ date: string; total: number; }[]> {
    const trends=await BookingModel.aggregate([
      {$match:{paymentStatus:"Paid"}},
      {$group:{_id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},total:{$sum:"$totalPrice"}}},
        {$sort:{_id:1}}
    ]) 

    return trends.map((trend)=>({date:trend._id,total:trend.total}))
 }

 async getTotalBookings(): Promise<number> {
     return await BookingModel.countDocuments({})
 }

 async getTotalRevenue(): Promise<number> {
     const Revenue=await BookingModel.aggregate([{$match:{paymentStatus:"Paid"}},{$group:{_id:null,total:{$sum:"$totalPrice"}}}])
       return Revenue[0].total||0
    }


    async fetchBookingTrends(interval: string): Promise<any[]> {
      const groupBy: Record<string, any> = {
         Daily: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
         Weekly: { $concat: [{ $toString: { $year: "$createdAt" } }, "-", { $toString: { $week: "$createdAt" } }] },
         Monthly: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
         Yearly: { $toString: { $year: "$createdAt" } },
      };
   
      let dateFilter = {};
      const now = new Date();
      let startOfRange = new Date();
   
      if (interval === "Weekly") {
         startOfRange.setDate(now.getDate() - 35); 
      } else if (interval === "Monthly") {
         startOfRange.setMonth(now.getMonth() - 3); 
      } else if (interval === "Yearly") {
         startOfRange.setFullYear(now.getFullYear() - 3);
      } else if (interval === "Daily") {
         startOfRange.setDate(now.getDate() - 7); 
      }
   
      dateFilter = { createdAt: { $gte: startOfRange } };
   
      const bookingData = await BookingModel.aggregate([
         { $match: { status: "Booked",createdAt:{$gte:startOfRange} } },
         { $group: { _id: groupBy[interval], totalBookings: { $sum: 1 } } },
         { $sort: { _id: 1 } },
      ]);
   
      const fullRange: string[] = [];
      let currentDate = new Date(startOfRange);
   
      while (currentDate <= now) {
         let formattedDate;
         if (interval === "Weekly") {
            const year = currentDate.getFullYear();
            const week = Math.ceil(((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
            formattedDate = `${year}-${week}`;
            currentDate.setDate(currentDate.getDate() + 7);
         } else if (interval === "Daily") {
            formattedDate = currentDate.toISOString().split("T")[0];
            currentDate.setDate(currentDate.getDate() + 1);
         } else if (interval === "Monthly") {
            formattedDate = currentDate.toISOString().slice(0, 7);
            currentDate.setMonth(currentDate.getMonth() + 1);
         } else if (interval === "Yearly") {
            formattedDate = currentDate.getFullYear().toString();
            currentDate.setFullYear(currentDate.getFullYear() + 1);
         }
         fullRange.push(formattedDate!)
      }
   
      const bookingMap = new Map(bookingData.map((item) => [item._id, item.totalBookings]));
      const mergedBookinData = fullRange.map((date) => ({
         _id: date,
         totalBookings: bookingMap.get(date) || 0,
      }));
   
      return mergedBookinData;
   }
   
    

    async fetchRevenueTrends(interval: string): Promise<any[]> {
      const groupBy: Record<string, any> = {
        Daily: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        Weekly: { $concat: [{ $toString: { $year: "$createdAt" } }, "-", { $toString: { $week: "$createdAt" } }] },
        Monthly: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        Yearly: { $toString: { $year: "$createdAt" } },
     };
  

    

   
   const now=new Date()
   const startOfRange=new Date()

   if(interval=="Weekly")
   {
    startOfRange.setDate(now.getDate()-35)
   }
   else if(interval=="Monthly")
   {
    startOfRange.setMonth(now.getMonth()-4)
   }
   else if(interval=="Daily")
   {
    startOfRange.setDate(now.getDate()-7)
   }
   else
   {
    startOfRange.setFullYear(now.getFullYear()-3)
   }

   const RevenueData=await BookingModel.aggregate([
    {$match:{status:"Booked",createdAt:{$gte:startOfRange}}},
    {$group:{_id:groupBy[interval],totalRevenue:{$sum:"$totalPrice"}}},{
      $sort:{_id:1}}
  ])

const fullRage:string[]=[]
   
let currentDate=new Date(startOfRange)
  
while (currentDate <= now) {
  let formattedDate;
  if (interval === "Weekly") {
     const year = currentDate.getFullYear();
     const week = Math.ceil(((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
     formattedDate = `${year}-${week}`;
     currentDate.setDate(currentDate.getDate() + 7);
  } else if (interval === "Daily") {
     formattedDate = currentDate.toISOString().split("T")[0];
     currentDate.setDate(currentDate.getDate() + 1);
  } else if (interval === "Monthly") {
     formattedDate = currentDate.toISOString().slice(0, 7);
     currentDate.setMonth(currentDate.getMonth() + 1);
  } else if (interval === "Yearly") {
     formattedDate = currentDate.getFullYear().toString();
     currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  fullRage.push(formattedDate!)
}
  const revenueMap = new Map(RevenueData.map((item) => [item._id, item.totalRevenue]));
      const mergedRevenueData = fullRage.map((date) => ({
         _id: date,
         totalRevenue: revenueMap.get(date) || 0,
      }));
   
      return mergedRevenueData;


    
    


    }

    async getBookings(page: number, limit: number): Promise<{ bookings: IBooking[]; total: number }> {
      const skip = (page - 1) * limit;
      const bookings = await BookingModel.find().populate('userId')
      .populate('movieId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
      const total = await BookingModel.countDocuments();
      return { bookings, total };
    
}

async getTheatreBookings(page: number, limit: number, theatreId: string): Promise<{ bookings: Booking[]; total: number; }> {
    const skip=(page-1)*limit

    const bookings=await BookingModel.find({theatreId:theatreId}).populate('userId').populate('movieId')
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1})

    const total=await BookingModel.countDocuments({theatreId:theatreId})

    return {bookings,total}
}

// async getBookings(page: number, limit: number): Promise<{ bookings: IBooking[]; total: number }> {
//   const skip = (page - 1) * limit;
//   const bookings = await BookingModel.find()
//   .populate('movieId')
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 }).lean();

//     const populateBookings=await Promise.all(
//     bookings.map(async (booking)=>
//     {
//     let userData=await userModel.findById(booking.userId).lean()
//     if(!userData)
//     {
//       userData=await theatreModel.findById(booking.userId).lean()
//     }
//     return {
//       ...booking,
//       userData
//     }
//   })
// )
//   const total = await BookingModel.countDocuments();
//   return { bookings:populateBookings as IBooking[], total };

// }


async fetchBookingTrendsByTheatre(interval: string,theatreId:string): Promise<any[]> {

  console.log(theatreId,"theatreId");
  
  const groupBy: Record<string, any> = {
     Daily: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
     Weekly: { $concat: [{ $toString: { $year: "$createdAt" } }, "-", { $toString: { $week: "$createdAt" } }] },
     Monthly: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
     Yearly: { $toString: { $year: "$createdAt" } },
  };

  let dateFilter = {};
  const now = new Date();
  let startOfRange = new Date();

  if (interval === "Weekly") {
     startOfRange.setDate(now.getDate() - 35); // 5 weeks back
  } else if (interval === "Monthly") {
     startOfRange.setMonth(now.getMonth() - 3); // 3 months back
  } else if (interval === "Yearly") {
     startOfRange.setFullYear(now.getFullYear() - 3); // 3 years back
  } else if (interval === "Daily") {
     startOfRange.setDate(now.getDate() - 7); // 1 week back
  }

  dateFilter = { createdAt: { $gte: startOfRange } };

  const bookingData = await BookingModel.aggregate([
     { $match: { status: "Booked",createdAt:{$gte:startOfRange},theatreId: new mongoose.Types.ObjectId(theatreId) } },
     { $group: { _id: groupBy[interval], totalBookings: { $sum: 1 } } },
     { $sort: { _id: 1 } },
  ]);
console.log(bookingData,"booking datahhgfhggff");

  const fullRange: string[] = [];
  let currentDate = new Date(startOfRange);

  while (currentDate <= now) {
     let formattedDate;
     if (interval === "Weekly") {
        const year = currentDate.getFullYear();
        const week = Math.ceil(((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
        formattedDate = `${year}-${week}`;
        currentDate.setDate(currentDate.getDate() + 7);
     } else if (interval === "Daily") {
        formattedDate = currentDate.toISOString().split("T")[0];
        currentDate.setDate(currentDate.getDate() + 1);
     } else if (interval === "Monthly") {
        formattedDate = currentDate.toISOString().slice(0, 7);
        currentDate.setMonth(currentDate.getMonth() + 1);
     } else if (interval === "Yearly") {
        formattedDate = currentDate.getFullYear().toString();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
     }
     fullRange.push(formattedDate!)
  }

  const bookingMap = new Map(bookingData.map((item) => [item._id, item.totalBookings]));
  const mergedBookinData = fullRange.map((date) => ({
     _id: date,
     totalBookings: bookingMap.get(date) || 0,
  }));

  return mergedBookinData;
}



async fetchRevenueTrendsByTheatre(interval: string,theatreId:string): Promise<any[]> {
  const groupBy: Record<string, any> = {
    Daily: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    Weekly: { $concat: [{ $toString: { $year: "$createdAt" } }, "-", { $toString: { $week: "$createdAt" } }] },
    Monthly: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
    Yearly: { $toString: { $year: "$createdAt" } },
 };





const now=new Date()
const startOfRange=new Date()

if(interval=="Weekly")
{
startOfRange.setDate(now.getDate()-35)
}
else if(interval=="Monthly")
{
startOfRange.setMonth(now.getMonth()-4)
}
else if(interval=="Daily")
{
startOfRange.setDate(now.getDate()-7)
}
else
{
startOfRange.setFullYear(now.getFullYear()-3)
}

const RevenueData=await BookingModel.aggregate([
{$match:{status:"Booked",createdAt:{$gte:startOfRange},theatreId: new mongoose.Types.ObjectId(theatreId)}},
{$group:{_id:groupBy[interval],totalRevenue:{$sum:"$totalPrice"}}},{
  $sort:{_id:1}}
])

const fullRage:string[]=[]

let currentDate=new Date(startOfRange)

while (currentDate <= now) {
let formattedDate;
if (interval === "Weekly") {
 const year = currentDate.getFullYear();
 const week = Math.ceil(((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
 formattedDate = `${year}-${week}`;
 currentDate.setDate(currentDate.getDate() + 7);
} else if (interval === "Daily") {
 formattedDate = currentDate.toISOString().split("T")[0];
 currentDate.setDate(currentDate.getDate() + 1);
} else if (interval === "Monthly") {
 formattedDate = currentDate.toISOString().slice(0, 7);
 currentDate.setMonth(currentDate.getMonth() + 1);
} else if (interval === "Yearly") {
 formattedDate = currentDate.getFullYear().toString();
 currentDate.setFullYear(currentDate.getFullYear() + 1);
}
fullRage.push(formattedDate!)
}
const revenueMap = new Map(RevenueData.map((item) => [item._id, item.totalRevenue]));
  const mergedRevenueData = fullRage.map((date) => ({
     _id: date,
     totalRevenue: revenueMap.get(date) || 0,
  }));

  return mergedRevenueData;





}

async getByBookingId(id: string): Promise<Partial<Booking|null>> {
  return await BookingModel.findById(id).populate('movieId').lean()
}

}

async function processRefund(userId: Types.ObjectId, amount: number): Promise<boolean> {
  try {

    console.log(`Processing refund of ₹${amount} to user ${userId}`);
    return true; 
  } catch (error) {
    console.error(`Error processing refund for user ${userId}:`, error);
    return false; 
    }
}




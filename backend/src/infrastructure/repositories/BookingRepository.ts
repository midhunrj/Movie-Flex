import { Types } from "mongoose";
import { BookingRepository } from "../../application/repositories/iBookingRepsitory";
import { Booking } from "../../Domain/entities/booking";
import { Theatre } from "../../Domain/entities/theatre";
import { BookingModel, IBooking } from "../database/models/bookingModel";
import { Screen } from "../database/models/screenModel";
import showModel, { ISeatInfo } from "../database/models/showModel";


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
          const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase(); // Random mix of letters and numbers
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
    
        // Update seat layout for reserved seats
        const selectedSeats = booking.selectedSeats;
        showtime.seatLayout.forEach((tier) => {
          tier.rows.forEach((row) => {
            row.seats.forEach((seat) => {
              if (selectedSeats.includes(seat.seatLabel!)) {
                seat.isReserved = true;
              }
            });
          });
        });
    
        await showModel.findByIdAndUpdate(showtime._id, showtime);
    
        // Create booking
        const newBooking = await BookingModel.create({
          userId: booking.userId,
          theatreId: booking.theatreId,
          screenId: booking.screenId,
          movieId: booking.movieId,
          showtimeId: booking.showtimeId,
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
   async confirmBooking(booking: Booking): Promise<Booking | null> {
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
            seat.isBooked = true; // Assuming the booking confirms directly
          }
        });
      });
    });

    
    await showtime.save();
    return await BookingModel.findByIdAndUpdate(booking._id, booking, { new: true }).lean();
 
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

  async bookingOrderHistory(userId: string): Promise<Partial<Booking>[]> {
       const bookingData=await BookingModel.find({userId:userId,paymentStatus:{$ne:"Pending"}}).populate("movieId").populate({path:"showtimeId",select:"_id showtime"})

       console.log(bookingData,"bookingData for a user")
       return bookingData
       
  }
  
//   async cancelBooking(id: string): Promise<void> {
//     await BookingModel.findByIdAndUpdate(id, { status: "Cancelled" });
//   }
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


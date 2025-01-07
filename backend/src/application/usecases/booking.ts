import { Booking } from "../../Domain/entities/booking";
import { Payment } from "../../Domain/entities/payment";
import { ShowRepository } from "../../infrastructure/repositories/showRepository";
import { BookingRepository } from "../repositories/iBookingRepsitory";
import { IPaymentRepository } from "../repositories/iPaymentRepository";

export class BookingMovies {
  constructor(private bookingRepository: BookingRepository,private paymentRepo:IPaymentRepository,private showRepository:ShowRepository) {}

  async userSideBooking(bookingDetails: any): Promise<Booking> {
    // Ensure booking details are valid and include required fields
    const booking = {
      ...bookingDetails,
      status: "Reserved",
      paymentStatus: "Pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration to 15 minutes from now
    };

    return await this.bookingRepository.create(booking);
  }

  async createOrder(amount: number, currency: string, receipt: string,bookingId:string):Promise<Payment|null> {
    const booking = await this.bookingRepository.isValid(bookingId);
    if(!booking)
    {
        return null
    }
    console.log(booking,"booking payment");
    
    return await this.paymentRepo.createOrder( currency,amount, receipt);
  }

  verifyPayment(orderId: string, paymentId: string, signature: string) {
    return this.paymentRepo.verifyPayment(orderId, paymentId, signature);
  }
  async confirmMovieTickets(bookingId: string,totalCost:number): Promise<any> {
    const booking = await this.bookingRepository.isValid(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.paymentStatus === "Paid") {
      throw new Error("Payment already confirmed");
    }
     booking.totalPrice=totalCost
    booking.paymentStatus = "Paid";
    booking.status = "Booked";

    return await this.bookingRepository.confirmBooking(booking);
  }

  async sessionVerify(): Promise<void> {
    const expiredBookings = await this.bookingRepository.findExpiredBookings();
    for (const booking of expiredBookings) {
        console.log(booking,"booking details of expired data");
         await this.showRepository.resetSeatValues(booking.showtimeId,booking.selectedSeats)
      booking.status = "Expired";
      await this.bookingRepository.delete(booking._id??'');
    }
  }

  // async cancelBooking(bookingId: string, showtimeStartTime: Date): Promise<void> {
  //   const booking = await this.bookingRepository.isValid(bookingId);
  //   if (!booking) throw new Error("Booking not found");

  //   const twoHoursBeforeShowtime = new Date(showtimeStartTime.getTime() - 2 * 60 * 60 * 1000);
  //   if (new Date() > twoHoursBeforeShowtime) {
  //     throw new Error("Cancellation not allowed within 2 hours of the showtime");
  //   }

  //   booking.status = "Cancelled";
  //   await this.bookingRepository.cancelTicket(booking);
  // }

  async getBookingDetail(id:string):Promise<any>
  {
    return await this.bookingRepository.getByBookingId(id)
  }
  async bookingHistory(userId:string,limits:number,page:Number):Promise<{ bookings: Booking[]; total: number }>
  {
    return await this.bookingRepository.bookingOrderHistory(userId,limits,page)
  }

  async cancelMovieTickets(bookingId:string):Promise<boolean>
  {
  return await this.bookingRepository.cancelTicket(bookingId)
  }

  async overviewDashboarrd() {
    const totalBookings = await this.bookingRepository.getTotalBookings();
    const totalRevenue = await this.bookingRepository.getTotalRevenue();
    const cancelledBookings = await this.bookingRepository.getCancelledBookings();
    const activeUsers = await this.bookingRepository.getActiveUsers();

    return { totalBookings, totalRevenue, cancelledBookings, activeUsers };
  }


  async fetchBookingTrends(interval: string): Promise<any[]> {
    return await this.bookingRepository.fetchBookingTrends(interval);
}

async fetchRevenueTrends(interval: string): Promise<any[]> {
    return await this.bookingRepository.fetchRevenueTrends(interval);
}

async getbookingHistory(page: number, limit: number) {
  return this.bookingRepository.getBookings(page, limit);
}

async theatreRevenueTrends(interval:string,theatreId:string):Promise<any[]>
{
  return await this.bookingRepository.fetchRevenueTrendsByTheatre(interval,theatreId)
}

async theatreBookingTrends(interval:string,theatreId:string):Promise<any[]>
{
  return await this.bookingRepository.fetchBookingTrendsByTheatre(interval,theatreId)
}
async getTheatrebookingHistory(page: number, limit: number,theatreId:string) {
  return this.bookingRepository.getTheatreBookings(page, limit,theatreId);
}
async theatreSideBooking(bookingDetails: any): Promise<Booking> {
  // Ensure booking details are valid and include required fields
  const booking = {
    ...bookingDetails,
    status: "Booked",
    paymentStatus: "Paid",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration to 15 minutes from now
  };

  return await this.bookingRepository.create(booking);
}
}

import { Booking } from "../../Domain/entities/booking";
import { Payment } from "../../Domain/entities/payment";
import { ShowRepository } from "../../infrastructure/repositories/showRepository";
import { BookingRepository } from "../repositories/iBookingRepsitory";
import { IPaymentRepository } from "../repositories/iPaymentRepository";

export class BookingMovies {
  constructor(private bookingRepository: BookingRepository,private paymentRepo:IPaymentRepository,private showRepository:ShowRepository) {}

  async createBooking(bookingDetails: any): Promise<Booking> {
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

  async bookingHistory(userId:string):Promise<Partial<Booking>[]>
  {
    return await this.bookingRepository.bookingOrderHistory(userId)
  }

  async cancelMovieTickets(bookingId:string):Promise<boolean>
  {
  return await this.bookingRepository.cancelTicket(bookingId)
  }
}
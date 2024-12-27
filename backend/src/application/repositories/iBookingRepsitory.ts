// /src/domain/repositories/BookingRepository.ts
import { Booking } from "../../Domain/entities/booking";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  isValid(id: string): Promise<Booking | null>;
  update(booking: Booking): Promise<Booking|null>;
  getByBookingId(id:string):Promise<Partial<Booking|null>>
  confirmBooking(booking: Booking): Promise<Partial<Booking|null>>;
  delete(id:string|null):Promise<void>
  findExpiredBookings(): Promise<Booking[]>;
//   cancelBooking(id: string): Promise<void>;
cancelTicket(bookingId:string): Promise<boolean>;
  bookingOrderHistory(userId:string,limits:number,page:Number):Promise<{ bookings: Booking[]; total: number }>
  getTotalBookings(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getCancelledBookings(): Promise<number>;
  getActiveUsers(): Promise<number>;
  getBookingTrends(): Promise<{ date: string; count: number }[]>;
  getRevenueTrends(): Promise<{ date: string; total: number }[]>;
  fetchBookingTrends(interval:string):Promise<any[]>
  fetchRevenueTrends(interval:string):Promise<any[]>
  fetchRevenueTrendsByTheatre(interval:String,theatreId:string):Promise<any[]>
  fetchBookingTrendsByTheatre(interval:string,theatreId:string):Promise<any[]>
   getBookings(page: number, limit: number): Promise<{ bookings: Booking[]; total: number }>
   getTheatreBookings(page: number, limit: number,theatreId:string): Promise<{ bookings: Booking[]; total: number }>
}

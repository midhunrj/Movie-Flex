// /src/domain/repositories/BookingRepository.ts
import { Booking } from "../../Domain/entities/booking";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  isValid(id: string): Promise<Booking | null>;
  update(booking: Booking): Promise<Booking|null>;
  confirmBooking(booking: Booking): Promise<Booking|null>;
  delete(id:string|null):Promise<void>
  findExpiredBookings(): Promise<Booking[]>;
//   cancelBooking(id: string): Promise<void>;
cancelTicket(bookingId:string): Promise<boolean>;
  bookingOrderHistory(userId:string):Promise<Partial<Booking>[]>
}

import { Types } from "mongoose";
interface SeatInfo {
  seatLabel: string;
  row: number;
  col: number;
  status: string;
  userId: Types.ObjectId | null;
  isPartition?: boolean;
}


interface Row {
  seats: SeatInfo[];
}


interface TierData {
  tierName: string;
  ticketRate: number;
  rows: Row[];
}

export interface Showtime  {
  movieId: Types.ObjectId;
  theatreId: Types.ObjectId;
  showtime: string;
  screenId: Types.ObjectId;
  totalSeats: number;
  date: Date;
  seatLayout: TierData[];
}
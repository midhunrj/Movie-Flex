import { Types } from "mongoose";
import { Movie } from "./movies";
import { Theatre } from "./theatre";
import { Screen } from "./screens";
export interface SeatInfo {
  seatLabel: string;
  row: number;
  col: number;
  status: string;
  userId: Types.ObjectId | null;
  isPartition?: boolean;
  isSelected?:boolean;
  isBooked?:boolean;
  isReserved?:boolean;
}


export interface Row {
  seats: SeatInfo[];
}


export interface TierData {
  tierName: string;
  ticketRate: number;
  rows: Row[];
}

export interface Showtime  {
  movieId: Types.ObjectId|Movie;
  theatreId: Types.ObjectId|Theatre;
  showtime: string;
  screenId: Types.ObjectId|Screen;
  totalSeats: number;
  date: Date;
  seatLayout: TierData[];
}
// export class Screen {
//     constructor(

import { Types } from "mongoose";

      
//       public theatreId: string,
//       public screenName: string,
//       public screenType:string,
//       public speakers:[string],
//       public totalSeats: number,
//       public tiers: { tierName: string; ticketRate: number; availableSeats: number }[],
//       public moviePlaying: { movieId: string; showtimes: string[] }[],
//       public id?: string
//     ) {}
//   }

interface Speaker {
  type: string;
  count: number;
  location: string;
}

interface Seat {
  row: string;
  col: number;
  status: 'available' | 'booked'|'not available';
}

interface Tier {
  name: string;
  ticketRate: number;
  seats: number;
  rows: number;
  partition: number;
  seatLayout: Seat[];
}

interface EnrolledMovie {
  movieId: Types.ObjectId; 
  title: string;
  duration: number; 
  genre: string[];
  movie_id:string;
  language: string;
  rating: number;
  backdrop_path: string;  
  poster_path: string; 
  startDate?: Date; 
  cast: string[];  
  endDate?: Date;    
  valid?: boolean;
}

interface Showtime {
  movieId: string;
  time: string;
}

export interface Screen {
  id?: string; 
  theatreId: string;
  screenName: string;
  screenType: string;
  speakers: Speaker[];
  totalSeats: number;
  tiers: Tier[];
  enrolledMovies?: EnrolledMovie[]; 
  showtimes: Showtime[];
}

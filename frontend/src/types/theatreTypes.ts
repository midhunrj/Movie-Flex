
// import { Types } from "mongoose";

      
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
  location?: string;
}

export interface Seat {
  row: number;
  col: number;
  isFilled?: boolean;
  isPartition?: boolean;
  label?: string;
}

export interface Tier {
  _id?:string;
  name: string;
  ticketRate: number;
  seats: number;
  rows?: number;
  partition?: number;
  seatLayout?: Seat[][];
}

export interface EnrolledMovie {
  movieId: string; 
  title: string;
  duration: number; 
  genre: string[];
  movie_id:string;
  language: string;
  rating: number;
  releaseDate:Date;
  backdrop_path?: string;  
  poster_path?: string; 
  startDate?: Date; 
  cast: string[];  
  endDate?: Date;    
  valid?: boolean;
  _id?:string
}

export interface Showtime {
  movieId?: string;
  time: string;
}

export interface ScreenDatas {
  _id?:string;
  theatreId?: string;
  screenName: string;
  screenType: string;
  speakers: Speaker[];
  totalSeats: number;
  tiers: Tier[];
  enrolledMovies?: EnrolledMovie[]|[]; 
  showtimes: Showtime[];
}

export interface TheatreState {
  _id: string;
  isSuccess: boolean;
  isLoading: boolean;
}

export interface TheatreType{
  _id?:string,
  name:string,
  email:string,
  password:string,
  mobile:number,
  //     primary:number;
  //     alternate?:string;
  // }
  address?:Address;
  location?:Location;
  is_verified:boolean;
  is_blocked:boolean;
  is_approved:string;
  
  licenseImage?: string;

}

interface Location{
  type:string;
  coordinates:number[]
}

interface Address{
  place?:string;
  city?:string;
  housename?:string;
  primaryPhone:number;
  alternatenumber?:number;
  pincode?:number;
  district?:string;
  state?:string;
}
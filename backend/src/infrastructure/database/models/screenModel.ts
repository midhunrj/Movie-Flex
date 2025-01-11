import mongoose, { Schema, Document, Types } from 'mongoose';

export interface EnrolledMovie {
  movieId: Types.ObjectId; 
  title: string;
  duration: number; 
  genre: string[];
  movie_id:string;
  language: string;
  releaseDate:Date;
  rating: number;
  backdrop_path: string;  
  poster_path: string; 
  startDate?: Date; 
  cast: Array<{ name: string; character: string; image: string }>,   
  endDate?: Date;    
  valid?: boolean;   
}

export interface Screen extends Document {
  _id:string
  theatreId: Types.ObjectId;
  screenName: string;
  screenType: string;
  speakers: {
    type: string;
    count: number;
    location: string;
  }[];
  totalSeats: number;
  tiers: {
    name: string;
    ticketRate: number;
    seats: number;
    rows:number;
    partition:number;
    seatLayout:[]; 
  }[];
  enrolledMovies: EnrolledMovie[]; 
  showtimes: {
    _id: string; movieId: string|null; time: string;expiryDate?:Date|null; 
}[]
}



const speakerSchema = new Schema({
  type: { type: String, required: true }, 
  count: { type: Number, required: true },
  location: { type: String }
});

const tierSchema = new Schema({
  name: { type: String, required: true }, 
  ticketRate: { type: Number, required: true },
  seats: { type: Number, required: true },
  partition:{type:Number,default:0},
  rows:{type:Number,default:0},
  seatLayout:[]
});
const enrolledMovieSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: [String], required: true },
  movie_id:{type:String,required:true},
  language: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseDate:{type:Date,required:true},
  poster_path:{type:String,required:true},
  backdrop_path:{type:String,required:true},
  cast: Array<{ name: string; character: string; image: string }>,  
  startDate: { type: Date, required: false }, 
  endDate: { type: Date, required: false },   
  valid: { type: Boolean, default: true }     
});

const screenSchema = new Schema<Screen>({
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  screenName: { type: String, required: true },
  screenType: { type: String, required: true }, 
  speakers: [speakerSchema], 
  totalSeats: { type: Number, required: true },
  tiers: [tierSchema], 
  enrolledMovies: [enrolledMovieSchema],
  showtimes: [
    { movieId: { type: String, ref: 'Movie' }, time: { type: String, required: true },expiryDate:{type:Date} }
  ] 
});

export const ScreenModel = mongoose.model<Screen>('Screen', screenSchema);

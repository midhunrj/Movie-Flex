import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../../../Domain/entities/movies';
import { Screen } from './screenModel';
import { Theatre } from '../../../Domain/entities/theatre';

export interface ISeatInfo {
  seatLabel?: string;
  row: number;
  col: number;
  status: string;
  userId: mongoose.Types.ObjectId | null;
  isPartition?: boolean;
  isSelected?:boolean;
  isBooked?:boolean;
  isReserved?:boolean;
}


export interface IRow {
  seats: ISeatInfo[];
}


export interface ITier {
  tierName: string;
  ticketRate: number;
  rows: IRow[];
}

export interface IShowtime extends Document {
  movieId: mongoose.Types.ObjectId 
  theatreId: mongoose.Types.ObjectId|Theatre 
  showtime: string;
  screenId: mongoose.Types.ObjectId|Screen
  totalSeats: number;
  date: Date;
  seatLayout: ITier[];
}


const SeatSchema = new Schema<ISeatInfo>({
  seatLabel: { type: String},
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  status: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  isPartition: { type: Boolean, default: false },
  isSelected:{type:Boolean,default:false},
  isBooked:{type:Boolean,default:false},
  isReserved:{type:Boolean,default:false}
});


const RowSchema = new Schema<IRow>({
  seats: { type: [SeatSchema]},
});


const TierSchema = new Schema<ITier>({
  tierName: { type: String, required: true },
  ticketRate: { type: Number, required: true },
  rows: { type: [RowSchema], required: true },
});


const ShowtimeSchema = new Schema<IShowtime>({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  showtime: { type: String, required: true },
  screenId: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  seatLayout: { type: [TierSchema], required: true },
});


export default mongoose.model<IShowtime>('Showtime', ShowtimeSchema);

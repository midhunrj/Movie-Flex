import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../../../Domain/entities/movies';
import { Theatre } from '../../../Domain/entities/theatre';
import { Screen } from '../../../Domain/entities/screens';

interface ISeatInfo {
  seatLabel: string;
  row: number;
  col: number;
  status: string;
  userId: mongoose.Types.ObjectId | null;
  isPartition?: boolean;
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
  theatreId: mongoose.Types.ObjectId 
  showtime: string;
  screenId: mongoose.Types.ObjectId|Screen
  totalSeats: number;
  date: Date;
  seatLayout: ITier[];
}


const SeatSchema = new Schema<ISeatInfo>({
  seatLabel: { type: String, required: true },
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  status: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  isPartition: { type: Boolean, default: false },
});


const RowSchema = new Schema<IRow>({
  seats: { type: [SeatSchema], required: true },
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

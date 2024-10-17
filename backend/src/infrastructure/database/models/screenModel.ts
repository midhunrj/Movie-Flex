import mongoose, { Schema, Document } from 'mongoose';

export interface Screen extends Document {
  theatreId: string;
  screenNumber: number;
  totalSeats: number;
  tiers: {
    tierName: string;
    price: number;
    availableSeats: number;
  }[];
  moviePlaying: {
    movieId: string;
    showtimes: string[];
  }[];
}

const screenSchema = new Schema<Screen>({
  theatreId: { type: String, ref: 'Theatre', required: true },
  screenNumber: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  tiers: [
    {
      tierName: { type: String, required: true },
      price: { type: Number, required: true },
      availableSeats: { type: Number, required: true },
    },
  ],
  moviePlaying: [
    {
      movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
      showtimes: [{ type: String, required: true }],
    },
  ],
});

export const ScreenModel = mongoose.model<Screen>('Screen', screenSchema);

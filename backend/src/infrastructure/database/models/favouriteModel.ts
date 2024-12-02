import mongoose, { Schema, Document } from 'mongoose';

interface IFavoriteDocument extends Document {
  userId: string;
  movieId: string;
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  },
  { timestamps: true }
);

export const FavoriteModel = mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);

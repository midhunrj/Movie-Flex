import { Favorite } from "../../Domain/entities/favourite";

export interface IFavoriteRepository {
    addFavorite(userId: string, movieId: string): Promise<void>;
    removeFavorite(userId: string, movieId: string): Promise<void>;
    getFavoritesByUser(userId: string): Promise<Partial<Favorite>[]>;
  }
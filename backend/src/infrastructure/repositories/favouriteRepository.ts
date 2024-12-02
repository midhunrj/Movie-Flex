import mongoose, { Types } from "mongoose";
import { IFavoriteRepository } from "../../application/repositories/iFavouriteRepository";
import { Favorite } from "../../Domain/entities/favourite";
import { FavoriteModel } from "../database/models/favouriteModel";

export class FavoriteRepository implements IFavoriteRepository {
    async addFavorite(userId: string, movieId: string): Promise<void> {
        const isduplicate=await FavoriteModel.findOne({userId,movieId})
        if(isduplicate)
        {
            return
        }
      const favorite = new FavoriteModel({ userId, movieId });
      await favorite.save();
    }
  
    async removeFavorite(userId: string, movieId: string): Promise<void> {
      await FavoriteModel.findOneAndDelete({ userId, movieId });
    }
  
    async getFavoritesByUser(userId: string): Promise<Partial<Favorite>[]> {
        
        console.log(userId,"userid string details");
        
      const favorites = await FavoriteModel.find({ userId:userId }).populate("movieId");
      return favorites
    //   .map(
    //     (doc) => new Favorite(doc.userId, doc.movieId, doc.createdAt)
    //   );
    }
  }
  
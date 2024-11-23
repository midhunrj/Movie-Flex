import { Types } from "mongoose";
import { Showtime } from "../../Domain/entities/shows";
import { UserCoordinates } from "../../Domain/entities/user";
import { IShowtime } from "../../infrastructure/database/models/showModel";

export interface iShowRepository{
    createShowtimes(showData:any):Promise<void>
    deleteExpiredShowtimes(currentDate:Date):Promise<void>
     listShowtimes(
        movieId: Types.ObjectId,
        date: string,
        userCoords: UserCoordinates,
        priceRange?: number,
        timeFilter?: string
      ): Promise<IShowtime[]>  
      removeShowtimes(showtime:string,screenId:string):Promise<void>
      listTheatreShowtimes(theatreId:string,date:string):Promise<IShowtime[]>
}
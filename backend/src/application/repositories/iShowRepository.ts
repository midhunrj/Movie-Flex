import { Types } from "mongoose";
import { Showtime, TierData } from "../../Domain/entities/shows";
import { UserCoordinates } from "../../Domain/entities/user";
import { IShowtime } from "../../infrastructure/database/models/showModel";

export interface IShowRepository{
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
      listTheatreShowtimes(screenId:string,date:string):Promise<IShowtime[]>
      getSeatlayout(showtimeId:string):Promise<TierData[]|null>
      resetSeatValues(showtimeId:Types.ObjectId,selectedSeats:string[]):Promise<IShowtime>
      updateShowtimes(prevTime:string,screenId:string,newTime:string)
}
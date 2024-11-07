import { Showtime } from "../../Domain/entities/shows";

export interface iShowRepository{
    createShowtimes(showData:any):Promise<void>
    deleteExpiredShowtimes(currentDate:Date):Promise<void>
    
}
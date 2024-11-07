import { iShowRepository } from "../../application/repositories/iShowRepository";
import { Showtime } from "../../Domain/entities/shows";
import showModel, { IShowtime } from "../database/models/showModel";

export class ShowRepository implements iShowRepository{
    async createShowtimes(showData:any): Promise<void> {
        const { movieId, theatreId, screenId, showtime, startDate,totalSeats, endDate,seatLayout  } = showData;

      const start = new Date(startDate);
      const end = new Date(endDate);

      const showtimeDocs:IShowtime[] = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const newShowtime:IShowtime = new showModel({
          movieId,
          theatreId,
          screenId,
          showtime,
          date: new Date(d), 
          totalSeats,
          seatLayout,
        });
        showtimeDocs.push(newShowtime);
      }

      
      await showModel.insertMany(showtimeDocs);
    }

    async deleteExpiredShowtimes(currentDate: Date): Promise<void> {
        await showModel.deleteMany({date:{$lt:currentDate}})
    }
}
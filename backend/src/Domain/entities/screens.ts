export class Screen {
    constructor(
      
      public theatreId: string,
      public screenNumber: number,
      public totalSeats: number,
      public tiers: { tierName: string; price: number; availableSeats: number }[],
      public moviePlaying: { movieId: string; showtimes: string[] }[],
      public id?: string
    ) {}
  }
  
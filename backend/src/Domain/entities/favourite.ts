export class Favorite {
    constructor(
      public userId: string,
      public movieId: string,
      public createdAt?: Date
    ) {}
  }
  
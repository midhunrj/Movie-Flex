export class Movie {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public releaseDate: Date,
      public duration: number,
      public genre: string[],  
      public posterUrl: string,  
      public isApproved: boolean = false,  
      public movie_id: number,  
      public language: string,  
      public overview: string,  
      public popularity: number,  
      public rating: number,  
      public video_link: string,  
      public runtime: number,  
      public backdrop_path: string,  
      public poster_path: string, 
      
      public cast: Array<{ name: string; character: string; image: string }>, 
      public crew: Array<{ name: string; job: string; image: string }>,          
      public createdAt: Date ,
      public is_blocked:Boolean,
      public ratingCount?:number, 
      public ratings?:Array< 
      {
        userId: string, 
        rating: number
      }>

     ) {}
  }
  
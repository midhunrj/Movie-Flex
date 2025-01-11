
export interface MovieType {
       _id?: string,
       id?:string,
       title: string,
       description: string,
       releaseDate: Date,
       duration: number,
       genre: string[],  
       posterUrl?: string,  
       isApproved: boolean   
       movie_id:number,  
       language: string,  
       overview: string,  
       popularity: number,  
       rating: number,  
       video_link: string,  
       runtime: number,  
       backdrop_path: string,  
       poster_path: string,  
       cast: Array<{ name: string; character: string; image: string }>, 
       crew: Array<{ name: string; job: string; image: string }>,  
       createdAt: Date ,
       is_blocked:boolean ,
       vote_average:Float32Array,
       ratingCount?:number,
       ratings?:Array< 
    {
      userId: string, 
      rating: number
    }>
     
  }
  export interface MovieTMdb {
    _id?: string,
    id?:string,
    title: string,
    description: string,
    release_date: string,
    duration: number,
    genre: string[],  
    posterUrl?: string,  
    isApproved: boolean   
    movie_id: string,  
    language: string,  
    overview: string,  
    popularity: number,  
    rating: number,  
    video_link: string,  
    runtime: number,  
    backdrop_path: string,  
    poster_path: string,  
    cast: string[],  
    crew: Record<string, string>,   
    createdAt: Date ,
    is_blocked:boolean ,
    vote_average:Float32Array
  
}

  type ObjectId=string
  export interface EnrolledMovie {
    movieId: ObjectId; 
    title: string;
    duration: number; 
    genre: string[];
    movie_id:number;
    language: string;
    rating: number;
    releaseDate:Date;
    backdrop_path: string;  
    poster_path: string; 
    startDate?: Date; 
    cast: Array<{ name: string; character: string; image: string }>, 
    endDate?: Date;    
    valid?: boolean;   
  }
  
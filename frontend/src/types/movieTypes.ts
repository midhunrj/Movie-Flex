
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
    movie_id:string;
    language: string;
    rating: number;
    backdrop_path: string;  
    poster_path: string; 
    startDate?: Date; 
    cast: string[];  
    endDate?: Date;    
    valid?: boolean;   
  }
  
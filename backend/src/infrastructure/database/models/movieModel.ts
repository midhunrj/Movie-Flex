// import mongoose, { Schema, Document } from 'mongoose';

// const MovieSchema: Schema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   releaseDate: { type: Date, required: true },
//   duration: { type: Number, required: true },
//   genre: [{ type: String, required: true }],
//   posterUrl: { type: String, required: true },
//   isApproved: { type: Boolean, default: false }, // Admin approval flag
// });


// export interface IMovie extends Document {
//   title: string;
//   description: string;
//   releaseDate: Date;
//   duration: number;
//   genre: string[];
//   posterUrl: string;
//   isApproved: boolean;
// }

// // Export the model
// export const MovieModel = mongoose.model<IMovie>('Movie', MovieSchema);

import mongoose, { Schema, Document } from 'mongoose';


const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  genre: [{ type: String, required: true }],      
  posterUrl: { type: String, required: true },    
  isApproved: { type: Boolean, default: false },  
  movie_id: { type: String, required: true },     
  language: { type: String, required: true },     
  overview: { type: String, required: true },     
  popularity: { type: Number, required: true },   
  rating: { type: Number, required: true }, 
  ratingCount:{type:Number},      
  video_link: { type: String, required: false },  
  runtime: { type: Number, required: true },      
  backdrop_path: { type: String, required: true },    
  poster_path: { type: String, required: true },      
  cast: Array<{ name: string; character: string; image: string }>, 
  crew: Array<{ name: string; job: string; image: string }>,      
  createdAt: { type: Date, default: Date.now } ,
  ratings: [
    {
      userId: { type: String, required: true }, 
      rating: { type: Number, required: true }, 
    },
  ],
  is_blocked:{type:Boolean,default:false}         
});


export interface IMovie extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  duration: number;
  genre: string[];         
  posterUrl: string;      
  isApproved: boolean;    
  movie_id: string;       
  language: string;       
  overview: string;       
  popularity: number;     
  rating: number; 
  ratingCount:number;        
  video_link?: string;    
  runtime: number;        
  backdrop_path: string;  
  poster_path: string;    
  cast: Array<{ name: string; character: string; image: string }>, 
  crew: Array<{ name: string; job: string; image: string }>,       
  createdAt: Date; 
  is_blocked:Boolean; 
  ratings:Array< 
    {
      userId: string, 
      rating: number
    }>, 
          
}


export const MovieModel = mongoose.model<IMovie>('Movie', MovieSchema);

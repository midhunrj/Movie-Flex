// import { MovieModel,IMovie } from '../database/models/movieModel';
// import { MovieRepository } from '../../application/repositories/iMovieRepository';
// import { Movie } from '../../Domain/entities/movies';


// export class MongoMovieRepository implements MovieRepository {
  
//   async createMovie(movie: Movie): Promise<Movie> {
//     const movieDocument = new MovieModel(movie); // Using the MovieModel
//     const savedMovie = await movieDocument.save(); // Save to MongoDB
//     return savedMovie.toObject(); // Convert MongoDB document to plain JS object
//   }

//   async approveMovie(movieId: string): Promise<Movie|null> {
//     const movie = await MovieModel.findByIdAndUpdate(
//       movieId, 
//       { isApproved: true }, 
//       { new: true }
//     );
//     return movie?.toObject(): null;
//   }

//   async blockMovie(movieId: string): Promise<Movie> {
//     const movie = await MovieModel.findByIdAndUpdate(
//       movieId, 
//       { isApproved: false }, 
//       { new: true }
//     );
//     return movie?.toObject() || null;
//   }

//   async getMovies(): Promise<Movie[]> {
//     const movies = await MovieModel.find({ isApproved: true });
//     return movies.map((movie: IMovie) => movie.toObject());
//   }

//   async getMovieById(movieId: string): Promise<Movie> {
//     const movie = await MovieModel.findById(movieId);
//     return movie?.toObject() || null;
//   }
// }

// import { MovieModel, IMovie } from '../database/models/movieModel';
// import { MovieRepository } from '../../application/repositories/iMovieRepository';
// import { Movie } from '../../Domain/entities/movies';

// export class MongoMovieRepository implements MovieRepository {

//   private mapToMovie(movieDocument: IMovie): Movie {
//     return new Movie(
//       movieDocument.id.toString(),
//       movieDocument.title,
//       movieDocument.description,
//       movieDocument.releaseDate,
//       movieDocument.duration,
//       movieDocument.genre,
//       movieDocument.posterUrl,
//       movieDocument.isApproved
//     );
//   }

//   async createMovie(movie: Movie): Promise<Movie> {
//     const movieDocument = new MovieModel(movie); // Using the MovieModel
//     const savedMovie = await movieDocument.save(); // Save to MongoDB
//     return this.mapToMovie(savedMovie); // Map MongoDB document to Movie class
//   }

//   async approveMovie(movieId: string): Promise<Movie | null> {
//     const movie = await MovieModel.findByIdAndUpdate(
//       movieId,
//       { isApproved: true },
//       { new: true }
//     );
//     return movie ? this.mapToMovie(movie) : null; // Map if found
//   }

//   async blockMovie(movieId: string): Promise<Movie | null> {
//     const movie = await MovieModel.findByIdAndUpdate(
//       movieId,
//       { isApproved: false },
//       { new: true }
//     );
//     return movie ? this.mapToMovie(movie) : null; // Map if found
//   }

//   async getMovies(): Promise<Movie[]> {
//     const movies = await MovieModel.find({ isApproved: true });
//     return movies.map((movie: IMovie) => this.mapToMovie(movie)); // Map each movie
//   }

//   async getMovieById(movieId: string): Promise<Movie | null> {
//     const movie = await MovieModel.findById(movieId);
//     return movie ? this.mapToMovie(movie) : null; // Map if found
//   }
// }
import { MovieRepository } from "../../application/repositories/iMovieRepository";
import { Movie } from "../../Domain/entities/movies";
import { IMovie, MovieModel } from "../database/models/movieModel";

export class MongoMovieRepository implements MovieRepository {

    private mapToMovie(movieDocument: IMovie): Movie {
        return new Movie(
          movieDocument.id.toString(),                   
          movieDocument.title,                           
          movieDocument.description,                     
          movieDocument.releaseDate,                     
          movieDocument.duration,                        
          movieDocument.genre,                           
          movieDocument.posterUrl,                       
          movieDocument.isApproved,                      
          movieDocument.movie_id,                        
          movieDocument.language,                        
          movieDocument.overview,                        
          movieDocument.popularity,                      
          movieDocument.rating,                          
          movieDocument.video_link || '',                
          movieDocument.runtime,                         
          movieDocument.backdrop_path,                   
          movieDocument.poster_path,                     
          movieDocument.cast,                            
          movieDocument.crew,                            
          movieDocument.createdAt,
          movieDocument.is_blocked, 
          movieDocument.ratingCount                       
        );
      }
    
    async createMovie(movie: Movie): Promise<Movie> {
      const existingMovie = await MovieModel.findOne({ movie_id: movie.movie_id });
  
       console.log(movie.rating,"movie rating");
       
       const currentDate = new Date();
       currentDate.setHours(0, 0, 0, 0); 
       const movieReleaseDate = new Date(movie.releaseDate);
       movieReleaseDate.setHours(0, 0, 0, 0);

         const ratingCount=movieReleaseDate<currentDate?1:0
      if (existingMovie) {
         
         existingMovie.ratingCount=ratingCount
        existingMovie.rating = movie.rating;
        existingMovie.cast = movie.cast;
        existingMovie.crew = movie.crew;
        existingMovie.popularity = movie.popularity;
        existingMovie.video_link = movie.video_link;
        existingMovie.runtime = movie.runtime;
        existingMovie.backdrop_path = movie.backdrop_path;
        existingMovie.poster_path = movie.poster_path;
        existingMovie.posterUrl=movie.posterUrl
        existingMovie.language=movie.language
        
        console.log(existingMovie.language,"existing /n",movie.language,"invader",);
        
        
        const updatedMovie = await existingMovie.save();
        return this.mapToMovie(updatedMovie);
      } else {
        
        const movieDocument = new MovieModel({...movie,ratingCount});
        const savedMovie = await movieDocument.save();
        return this.mapToMovie(savedMovie);
      }
    
    }

    async getMovies(): Promise<Movie[]|null> {
        const movieDatas=await MovieModel.find({}).exec()
        return movieDatas.map(this.mapToMovie); // Mapping the documents to Movie entities
    }

    async deleteMovieDetails(movieid: string): Promise<Movie[] | null> {
        const deletedata=await MovieModel.findByIdAndDelete(movieid)
        const movieDatas=await MovieModel.find({}).exec()
        return movieDatas.map(this.mapToMovie);
    }

    async blockUnblockMovieData(movieId: string,isBlocked:string): Promise<Movie[] | null> {
      console.log("before block statsu change",isBlocked);
      
      let blockStatus=isBlocked?false:true
        return await MovieModel.findOneAndUpdate({movie_id:movieId},{is_blocked:blockStatus},{new:true})
    }
  }
  


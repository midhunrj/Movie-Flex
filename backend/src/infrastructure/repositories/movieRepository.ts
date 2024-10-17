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
        );
      }
    
    async createMovie(movie: Movie): Promise<Movie> {
      const movieDocument = new MovieModel(movie);
      const savedMovie = await movieDocument.save();
      return this.mapToMovie(savedMovie);
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
  


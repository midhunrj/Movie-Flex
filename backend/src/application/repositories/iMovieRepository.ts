import { Movie } from "../../Domain/entities/movies";

export interface MovieRepository {
  createMovie(movie: Movie): Promise<Movie>;
  getMovies():Promise<Movie[]|null>
  deleteMovieDetails(movieid:string):Promise<Movie[]|null>
  blockUnblockMovieData(movieId:string,isBlocked:string):Promise<Movie[]|null>
//   approveMovie(movieId: string): Promise<Movie | null>;
//   blockMovie(movieId: string): Promise<Movie | null>;
//   getMovies(): Promise<Movie[]>;
//   getMovieById(movieId: string): Promise<Movie | null>;
}

  
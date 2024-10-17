import { MovieRepository } from "../repositories/iMovieRepository";
import { Movie } from '../../Domain/entities/movies';

export class ManageMovies {
  constructor(private movieRepo: MovieRepository) {}

  async createMovie(movie: Movie): Promise<Movie> {
    return await this.movieRepo.createMovie(movie);
  }

  async fetchMovieDetails():Promise<Movie[]|null>{
    return await this.movieRepo.getMovies()
  }

  async deleteMovieCase(movieid:string):Promise<Movie[]|null>
  {
    return await this.movieRepo.deleteMovieDetails(movieid)
  }

  async blockUnblockCase(movieId:string,isBlocked:string):Promise<Movie[]|null>
  {
    return await this.movieRepo.blockUnblockMovieData(movieId,isBlocked)
  }
//   async approveMovie(movieId: string): Promise<Movie|null> {
//     return await this.movieRepo.approveMovie(movieId);
//   }

//   async blockMovie(movieId: string): Promise<Movie|null> {
//     return await this.movieRepo.blockMovie(movieId);
//   }

//   async getMovies(): Promise<Movie[]> {
//     return await this.movieRepo.getMovies();
//   }
}

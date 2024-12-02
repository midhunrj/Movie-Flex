import { MovieRepository } from "../repositories/iMovieRepository";
import { Movie } from '../../Domain/entities/movies';
import { IFavoriteRepository } from "../repositories/iFavouriteRepository";
import { Favorite } from "../../Domain/entities/favourite";

export class ManageMovies {
  constructor(private movieRepo: MovieRepository,private favouriteRepository:IFavoriteRepository) {}

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


async addToFavourites(userId: string, movieId: string): Promise<void> {
  await this.favouriteRepository.addFavorite(userId, movieId);
}

async removeFromFavourites(userId: string, movieId: string): Promise<void> {
  await this.favouriteRepository.removeFavorite(userId, movieId);
}

async getFavouritesByUser(userId: string): Promise<Partial<Favorite>[]> {
  return await this.favouriteRepository.getFavoritesByUser(userId);
}
}

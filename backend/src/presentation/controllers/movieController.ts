
import { Request, Response } from 'express';
import { ManageMovies } from '../../application/usecases/movies'; 
import { Movie } from '../../Domain/entities/movies';
import { HttpStatusCodes } from '../../types/enums/httpStatusCode';

export class MovieController {
  constructor(private manageMovies: ManageMovies) {}

//   async createMovie(req: Request, res: Response) {
//     const { title, description, releaseDate, duration, genre, posterUrl } = req.body;
//     const newMovie = new Movie(
//       Date.now().toString(), // Generate an ID
//       title,
//       description,
//       new Date(releaseDate),
//       duration,
//       genre,
//       posterUrl
//     );
//     const movie = await this.manageMovies.createMovie(newMovie);
//     res.status(HttpStatusCodes.CREATED).json(movie);
//   }

//   async approveMovie(req: Request, res: Response) {
//     const { movieId } = req.params;
//     const movie = await this.manageMovies.approveMovie(movieId);
//     res.status(HttpStatusCodes.OK).json(movie);
//   }

//   async blockMovie(req: Request, res: Response) {
//     const { movieId } = req.params;
//     const movie = await this.manageMovies.blockMovie(movieId);
//     res.status(HttpStatusCodes.OK).json(movie);
//   }

//   async getMovies(req: Request, res: Response) {
//     const movies = await this.manageMovies.getMovies();
//     res.status(HttpStatusCodes.OK).json(movies);
//   }
// }

async createMovie(req: Request, res: Response) {

    try{
    // const {
    //   title, description, releaseDate, duration, genre, posterUrl,
    //   movie_id, language, overview, popularity, rating, video_link,
    //   runtime, backdrop_path, poster_path, cast, crew, createdAt
    // } = req.body;
  
    // const newMovie = new Movie(
    //   Date.now().toString(), // Generate an ID
    //   title,
    //   description,
    //   new Date(releaseDate),
    //   duration,
    //   genre,
    //   posterUrl,
    //   false, // isApproved
    //   movie_id,
    //   language,
    //   overview,
    //   popularity,
    //   rating,
    //   video_link,
    //   runtime,
    //   backdrop_path,
    //   poster_path,
    //   cast,
    //   crew,
    //   new Date(createdAt)
    // );
    const {
      title, language, overview, releaseDate, popularity, rating, genre,
      movie_id, video_link, runtime, backdrop_path, poster_path, cast, crew, createdAt,is_blocked
    } = req.body.movieData;
    
   
    // const releaseData = releaseDate ? new Date(releaseDate) : null;
    const createdDate = createdAt ? new Date(createdAt) : new Date();
       console.log(releaseDate,"release date");
       
    if (!title || !overview || !releaseDate  || !genre || !poster_path || !movie_id || !language  || !backdrop_path || !cast ) {
       console.log(req.body,"input fields");
        
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
    }
    
    const newMovie = new Movie(
      Date.now().toString(),
      title,
      overview,
      releaseDate,
      runtime,
      genre,
      poster_path,
      false,
      movie_id,
      language,
      overview,
      popularity,
      rating,
      video_link,
      runtime,
      backdrop_path,
      poster_path,
      cast,
      crew,
      createdDate,
      is_blocked
    );
    
    const movie = await this.manageMovies.createMovie(newMovie);
    res.status(HttpStatusCodes.CREATED).json(movie);
    
  }
  catch(error)
  {
    console.error("failed to upload movie", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to upload movie" });
  }
}

async fetchMovies(req:Request,res:Response){
  try {
    const movieData=await this.manageMovies.fetchMovieDetails()
    console.log(movieData,"database movieData details");
    
    res.status(HttpStatusCodes.OK).json({message:"here all the movies available in the theatre",movieData})
  } catch (error) {
    console.error("failed to fetch movie details", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to fetch moviedatas" });
  }
}
async deleteMovie(req: Request, res: Response) {
  try {
    const movieid = req.params.movieid;
    const movieData = await this.manageMovies.deleteMovieCase(movieid); // Call service to delete the movie
    res.status(HttpStatusCodes.OK).json({
      message: "Movie deleted successfully",
      movieData,
    });
  } catch (error) {
    console.error("Failed to delete movie", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete movie" });
  }
}


async blockMovie(req: Request, res: Response) {
  try {
    // const movieid = req.params.movieid;
    // const blockStatus = req.body.isBlocked; 

    const {movieId,isBlocked}=req.body

    console.log(req.body,"fss req body");
    
    const movieData = await this.manageMovies.blockUnblockCase(movieId,isBlocked); // Call service to block/unblock the movie
    res.status(HttpStatusCodes.OK).json({
      message:isBlocked ? "Movie blocked successfully" : "Movie unblocked successfully",
      movieData,
    });
  } catch (error) {
    console.error("Failed to block/unblock movie", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to block/unblock movie" });
  }
}

async addFavorite(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId } = req.body;
    await this.manageMovies.addToFavourites(userId, movieId);
    res.status(HttpStatusCodes.CREATED).json({ message: 'Movie added to favorites successfully' });
  } catch (error) {
    console.error("Failed to add movie to favourites", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to add movie to favourites" });
  }
}

async removeFavorite(req: Request, res: Response): Promise<void> {
  try {
    const { userId, movieId } = req.body;
    console.log(req.body,"body req");
    
    await this.manageMovies.removeFromFavourites(userId, movieId);
    res.status(HttpStatusCodes.OK).json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error("Failed to delete movies from favourites", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete movies from favourites" });
  }
}

async getFavorites(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.query;
    console.log("fgfgf",userId);
    
    const favorites = await this.manageMovies.getFavouritesByUser(userId as string);
    console.log(favorites,"return movies of favorites");
    
    res.status(HttpStatusCodes.OK).json(favorites);
  } catch (error) {
    console.error("Failed to fetch movie favourites of user", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch movie favourites of user" });
  }    
  }

  
}




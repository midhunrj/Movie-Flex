import { IuserRepository } from "../../application/repositories/Iuserrepository";
import { Movie } from "../../Domain/entities/movies";
import { TierData } from "../../Domain/entities/shows";
import { User } from "../../Domain/entities/user";
import { IMovie, MovieModel } from "../database/models/movieModel";
import showModel from "../database/models/showModel";
import { userModel } from "../database/models/userModel";
import moment from "moment";
export class UserRepository implements IuserRepository {
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
      movieDocument.video_link || "",
      movieDocument.runtime,
      movieDocument.backdrop_path,
      movieDocument.poster_path,
      movieDocument.cast,
      movieDocument.crew,
      movieDocument.createdAt,
      movieDocument.is_blocked
    );
  }
  async findByEmail(email: string): Promise<User | null> {
    return userModel.findOne({ email }).exec();
  }

  async createUser(user: User|Omit<User,'password'|'mobile'>&{uid:string}): Promise<User> {
    const newUser = new userModel(user);
    return newUser.save();
  }

  // async verifyOtp(otp: string): Promise<any> {
  //     const
  // }

  async updatePassword(email: string, password: string): Promise<any> {
    console.log("after hash", password);

    return await userModel.updateOne({ email }, { password });
  }

  async findById(id: string): Promise<User | null> {
    return await userModel.findById(id).exec();
  }

  async updateUser(user:User): Promise<User | null> {
    console.log(user,"user before updating");
    let userId=user.id
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password:user.password
      
  }, {
      new: true,
      runValidators: true, 
    }); 
    console.log("updatedUser details",updatedUser);
    
    return updatedUser;
  }

  // async ComingSoon(): Promise<Movie[] | null> {
  //   const readyForReRelease = moment().subtract(2, "years");
  //   const movieData = await MovieModel.find({
  //     $or: [
  //       { releaseDate: { $lt: readyForReRelease } },
  //       { releaseDate: { $gt: new Date() } },
  //     ],
  //   });
  //   return movieData.map(this.mapToMovie);
  // }

  // async RollingNow(): Promise<Movie[] | null> {
  //   const sixMonthsAgo = moment().subtract(6, "months");
  //   const movieData = await MovieModel.find({
  //     $and: [
  //       { releaseDate: { $lt: new Date() } },
  //       { releaseDate: { $gt: sixMonthsAgo } },
  //     ],
  //   });
  //   return movieData.map(this.mapToMovie);
  // }

  
    // Existing methods...
  
    async ComingSoon(filters: any, page: number, limit: number,sortOptions:string): Promise<Movie[]> {
      const readyForReRelease = moment().subtract(2, "years");
  
      const query: any = {
        $or: [
          { releaseDate: { $lt: readyForReRelease } },
          { releaseDate: { $gt: new Date() } }
        ]
      };
  
      if (filters.search) {
        query.title = { $regex: filters.search, $options: 'i' }; // Case-insensitive search on title
      }
  
      if (filters.genre) {
        query.genre = filters.genre; // Filter by genre
      }
  
      if (filters.language) {
        query.language = filters.language; // Filter by language
      }
  
      const movieData=await MovieModel.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)  // Pagination
        .limit(limit);  // Limit per page

        return movieData.map(this.mapToMovie)
    }
  
    async RollingNow(filters: any, page: number, limit: number,sortOptions:string): Promise<Movie[]> {
      const sixMonthsAgo = moment().subtract(6, "months");
    console.log(sortOptions,"sortOptions");
    
      const query: any = {
        $and: [
          { releaseDate: { $lt: new Date() } },
          { releaseDate: { $gt: sixMonthsAgo } }
        ]
      };
  
      if (filters.search) {
        query.title = { $regex: filters.search, $options: 'i' }; 
      }
  
      if (filters.genre) {
        query.genre = filters.genre; // Filter by genre
      }
  
      if (filters.language) {
        query.language = filters.language; // Filter by language
      }
      console.log(filters,"filter search ",page);
      
      console.log(query,"for search query");
      
      if(isNaN(page)){
        const movieData= await MovieModel.find(query)
        .sort(sortOptions||{releaseDate:-1})

        return movieData.map(this.mapToMovie)
      }
      else {
        const movieData= await MovieModel.find(query)
        .sort(sortOptions||{releaseDate:-1})
        .skip((page - 1) * limit)  
        .limit(limit);  
//console.log(movieData,"returning after pagination");
      
        return movieData.map(this.mapToMovie)
      }
    }
  
    async getComingSoonCount(filters: any): Promise<number> {
      const readyForReRelease = moment().subtract(2, "years");
  
      const query: any = {
        $or: [
          { releaseDate: { $lt: readyForReRelease } },
          { releaseDate: { $gt: new Date() } }
        ]
      };
  
      if (filters.search) {
        query.title = { $regex: filters.search, $options: 'i' };
      }
  
      if (filters.genre) {
        query.genre = filters.genre;
      }
  
      if (filters.language) {
        query.language = filters.language;
      }
  
      return await MovieModel.countDocuments(query);  // Return total count
    }
  
    async getRollingNowCount(filters: any): Promise<number> {
      const sixMonthsAgo = moment().subtract(6, "months");
  
      const query: any = {
        $and: [
          { releaseDate: { $lt: new Date() } },
          { releaseDate: { $gt: sixMonthsAgo } }
        ]
      };
  
      if (filters.search) {
        query.title = { $regex: filters.search, $options: 'i' };
      }
  
      if (filters.genre) {
        query.genre = filters.genre;
      }
  
      if (filters.language) {
        query.language = filters.language;
      }
  
      return await MovieModel.countDocuments(query);  // Return total count
    }

  //   async newRating(movieId: string, rating: number,userId:string): Promise<Movie|null> {
        
      
  //     const movieData=await MovieModel.findById(movieId)


  //     const existingRating = movieData?.ratings?movieData.ratings.find((r) => r.userId === userId):null;

  
  // if (existingRating) {
  //   // If user already rated, calculate the new average by replacing the old rating
  //   const totalRating = 
  //     movieData?.rating! * movieData?.ratingCount! - existingRating.rating + rating;
  //   const newRating = totalRating / movieData?.ratingCount!;


  //   await MovieModel.updateOne({_id:movieId,'ratings.userId': userId},{$set:{rating:newRating,'ratings.$.rating': rating},})

  // } else {
  //   // If new rating, add to the ratings array
  //   movieData?.ratings.push({ userId, rating });

  
  //   const totalRating = movieData?.rating! * movieData?.ratingCount! + rating;
  //   const count=(movieData?.ratingCount!)+1;
  //   //movieData?.ratingCount +=1
  //   const newRating = totalRating /count;
  

  //     await MovieModel.updateOne({_id:movieId},{$set:{rating:newRating},$push:{ratings:{userId,rating}},$inc:{ratingCount:1}})

  //   }

  //   return await MovieModel.findById(movieId)
  
  //   }

  async newRating(movieId: string, rating: number, userId: string): Promise<Movie | null> {
    const MovRate=await MovieModel.findById(movieId)
    if(MovRate?.rating==0)
    {
      MovRate.ratingCount=0
    }
    if(!MovRate)
    {
      throw new Error("movie error")
    }
    await MovRate.save()
    const movieData = await MovieModel.findById(movieId);
  
    if (!movieData) {
      throw new Error('Movie not found');
    }
  
    const existingRating = movieData.ratings
      ? movieData.ratings.find((r) => r.userId === userId)
      : null;
  
    if (existingRating) {
      // If user already rated, calculate the new average by replacing the old rating
      const totalRating =
        movieData.rating * movieData.ratingCount - existingRating.rating + rating;
      const newRating = totalRating / movieData.ratingCount;
  
      await MovieModel.updateOne(
        { _id: movieId, 'ratings.userId': userId },
        { $set: { rating: newRating, 'ratings.$.rating': rating } }
      );
    } else {
      // If new rating, add to the ratings array
      const isFirstRating = movieData.rating === 0 && movieData.ratingCount === 0;
  
      const totalRating = isFirstRating
        ? rating // Start the total rating with the first rating
        : movieData.rating * movieData.ratingCount + rating;
  
      const count = isFirstRating
        ? 1 // Start count from 1 for the first rating
        : movieData.ratingCount + 1;
  
      const newRating = totalRating / count;
  
      await MovieModel.updateOne(
        { _id: movieId },
        {
          $set: { rating: newRating },
          $push: { ratings: { userId, rating } },
          $inc: { ratingCount: 1 },
        }
      );
    }
  
    return await MovieModel.findById(movieId);
  }
  
}

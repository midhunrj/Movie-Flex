import { EnrolledMovie, ScreenModel } from "../database/models/screenModel";
import { Screen } from '../../Domain/entities/screens';
import { iScreenRepository } from "../../application/repositories/iScreenRepository";

export class ScreenRepository implements iScreenRepository{
  async create(screen: Screen): Promise<Screen> {
    console.log(screen,"screen in repository")
    
    const newScreen = new ScreenModel(screen);
    console.log(newScreen,"newScreen before save");
    
    return await newScreen.save();
  }

  async findById(screenId: string): Promise<Screen | null> {
    return await ScreenModel.findById(screenId).populate('movies.movieId').lean(); 
  }
  
  async findByTheatre(theatreId: string): Promise<Screen[]|null> {
    console.log(theatreId,"theatreId");
    
    const listdata= await ScreenModel.find({theatreId: theatreId }) 
    console.log(listdata,"screens data");
    
    return listdata
   }
  

  async update(screenId: string, screenData: Partial<Screen>): Promise<Screen | null> {
    return await ScreenModel.findByIdAndUpdate(screenId, screenData, { new: true });
  }

  async delete(screenId: string): Promise<void> {
    await ScreenModel.findByIdAndDelete(screenId);
  }

  async updateTierData(screenId: string, tierId: string, tierData:any): Promise<Screen | null> {
    return await ScreenModel.findOneAndUpdate(
        { _id: screenId, "tiers._id": tierId },  
        {
            $set: {
                "tiers.$.name": tierData.name,
                "tiers.$.ticketRate": tierData.ticketRate,
                "tiers.$.seats": tierData.seats,
                "tiers.$.rows": tierData.rows,
                "tiers.$.partition": tierData.partition,
                "tiers.$.seatLayout": tierData.seatLayout
            }
        },
        { new: true }  // Return the updated document
    );
}

async findMoviesInScreen(screenId:string,movieId:string):Promise<boolean>
{
  const movieExists=await ScreenModel.findOne({_id:screenId,"enrolledMovies.movie_id":movieId})
  return movieExists?true:false
}
async enrollMovieData(screenId:string,movie:any):Promise<Screen|null>
{
  // await ScreenModel.updateOne(
  //   { _id: screenId },
  //   { $pull: { enrolledMovies: { movieId: movie.movieId } } }
  // );
  let a=Object.keys(movie).map((elem)=>elem==" ")
  console.log(a,"keys in movie");
  
  movie.movieId=movie["id"]
  console.log(movie,"movie data in controller")
  
  const screenData = await ScreenModel.findByIdAndUpdate(
    screenId,
    { $addToSet: { enrolledMovies: movie } },
    { new: true }
  );
  return screenData
}
 async updateScreenData(screenId:string,screenData:Screen):Promise<Screen|null>
 {
   return await ScreenModel.findByIdAndUpdate(screenId,screenData,{new:true})
 }
 async RollinMoviesToShow(screenId: string, movieId: string, showtime: string): Promise<Screen | null> {
     
  return await ScreenModel.findOneAndUpdate({_id:screenId,"showtimes.time":showtime},{$push:{"showtimes.$.movieId":movieId}})
 }
}

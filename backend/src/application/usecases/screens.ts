import { iScreenRepository } from "../repositories/iScreenRepository";
import { Screen } from '../../Domain/entities/screens';
import { iShowRepository } from "../repositories/iShowRepository";

export class ScreenUseCase {
  constructor(private screenRepository: iScreenRepository,private showRepository:iShowRepository) {}

  async addNewScreen(screenData: Screen): Promise<Screen> {
    return await this.screenRepository.create(screenData);
  }


  async findScreensByTheatre(theatreId: string): Promise<Screen[]|null> {
    return await this.screenRepository.findByTheatre(theatreId);
  }

  async updateTier(screenId:string,tierId:string,tierData:any):Promise<Screen|null>{
    try {
      const screenData= await this.screenRepository.updateTierData(screenId,tierId,tierData)
      return screenData
    } catch (error) {
      console.log(error,"error");
      
    }
   return null
  }
  
  async addMoviesViaScreen(screenId:string,movie:any):Promise<{success:boolean,screenData:Screen|null}>{
    try {
      const movieExists=await this.screenRepository.findMoviesInScreen(screenId,movie.movie_id)
      if(movieExists)
      {
        return {success:false,screenData:null}
      }
      const screenData= await this.screenRepository.enrollMovieData(screenId,movie)
      return {success:true,screenData:screenData}
    } catch (error) {
      console.log(error,"error");
      return {success:false,screenData:null}
    }
   
  }

  async updateScreen(screenId:string,screenData:Screen):Promise<Screen|null>{
    try {
      const screen= await this.screenRepository.updateScreenData(screenId,screenData)
      return screen
    } catch (error) {
      console.log(error,"error");
      
    }
   return null
  }

  async addMoviesToShow(showData:any):Promise<Screen|null>{
    try {
      const showtimeDatas=await this.showRepository.createShowtimes(showData)
      let {screenId,movieId,showtime}=showData
      const screenData= await this.screenRepository.RollinMoviesToShow(screenId,movieId,showtime)
      return screenData
    } catch (error) {
      console.log(error,"error");
      return null
    }
   
  }
}

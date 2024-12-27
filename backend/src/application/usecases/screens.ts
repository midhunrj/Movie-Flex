import { IScreenRepository } from "../repositories/iScreenRepository";
import { Screen } from '../../Domain/entities/screens';
import { IShowRepository } from "../repositories/iShowRepository";
import { UserCoordinates } from "../../Domain/entities/user";

export class ScreenUseCase {
  constructor(private screenRepository: IScreenRepository,private showRepository:IShowRepository) {}

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
      console.log(screen,"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

      return screen
    } catch (error) {
      console.log(error,"error");
      
    }
   return null
  }

  async addMoviesToShow(showData:any):Promise<Screen|null>{
    try {
      console.log(showData,"in usecase");
      
      const showtimeDatas=await this.showRepository.createShowtimes(showData)
      let {screenId,movieId,showtime}=showData
      const screenData= await this.screenRepository.RollinMoviesToShow(screenId,movieId,showtime)
      return screenData
    } catch (error) {
      console.log(error,"error");
      return null
    }
  }

  async removeShowFromScreen(showtimeId:string,screenId:string):Promise<Screen|null>{
    try {
      // console.log(showData,"in usecase");
      const showtime= await this.screenRepository.getShowtime(screenId,showtimeId)
      const showtimeDatas=await this.showRepository.removeShowtimes(showtime,screenId)
   
      const screenData=await this.screenRepository.removeShowFromScreen(showtimeId,screenId)
      
      return screenData
    } catch (error) {
      console.log(error,"error");
      return null
    }
  }

  async updateShowtimeFromScreen(screenId:string,prevTime:string,newTime:string):Promise<Screen|null>{
    try {
      // console.log(showData,"in usecase");
      // const showtime= await this.screenRepository.getShowtime(screenId,showtimeId)
      //console.log(screenDeta,"in usecase");

      const showtimeDatas=await this.showRepository.updateShowtimes(prevTime,screenId,newTime)
   
      const screenData=await this.screenRepository.updateShowFromScreen(screenId,prevTime,newTime)
      
      return screenData
    } catch (error) {
      console.log(error,"error");
      return null
    }
  }
  async getTheatresWithScreens(userCoords:UserCoordinates) {
    // Call the repository to fetch data
    const theatres = await this.screenRepository.fetchTheatresWithScreens(userCoords);
    return theatres;
  }
  async removeMovieFromEnroll(movieId:string,screenId:string){
    const screenData=await this.screenRepository.removeMovieFromScreen(movieId,screenId)
    return screenData
  }
}

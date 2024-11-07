import { Screen } from "../../Domain/entities/screens"
export interface iScreenRepository{
     create(screen:Screen):Promise<Screen>
     findById(screenId:string):Promise<Screen|null>
     findByTheatre(theatreId:string):Promise<Screen[]|null>
     update(screenId: string, screenData: Partial<Screen>): Promise<Screen | null> 
    updateTierData(screenId:string,tierId:string,tierData:any):Promise<Screen|null>
       delete(screenId: string): Promise<void> 
       findMoviesInScreen(screenId:string,movieId:string):Promise<boolean>
       enrollMovieData(screenId:string,movie:any):Promise<Screen|null>
       updateScreenData(screenId:string,screenData:Screen):Promise<Screen|null>
       RollinMoviesToShow(screenId:string,movieId:string,showtime:string):Promise<Screen|null>
}
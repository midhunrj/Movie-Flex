import { Screen } from "../../Domain/entities/screens"
export interface iScreenRepository{
     create(screen:Screen):Promise<Screen>
     findById(screenId:string):Promise<Screen|null>
     findByTheatre(theatreId:string):Promise<Screen[]>
     update(screenId: string, screenData: Partial<Screen>): Promise<Screen | null> 
    
       delete(screenId: string): Promise<void> 
}
import { Theatre } from "../../Domain/entities/theatre"
export interface ITheatreRepository{
    findByEmail(email:string):Promise<Theatre|null>
    createTheatre(theatre:Theatre):Promise<Theatre>
    updatePassword(email:string,password:string):Promise<any>
    findById(id: string): Promise<Theatre | null>
    updateProfile(theatreId: string|undefined, profileData: Partial<Theatre>): Promise<Theatre|null>;

}
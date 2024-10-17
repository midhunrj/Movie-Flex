import { Admin } from "../../Domain/entities/admin";
import { Theatre } from "../../Domain/entities/theatre";
import { User } from "../../Domain/entities/user";
export interface IAdminRepository{
     AdminLogin(email:string):Promise<Boolean|null>
     listUsers():Promise<User[]|null>
     listTheatres():Promise<Theatre[]|null>
     blockUser(userId:string):Promise<User|null>
     unblockUser(userId:string):Promise<User|null>
     blockTheatre(theatreId:string):Promise<Theatre|null>
     unblockTheatre(theatreId:string):Promise<Theatre|null>
     findById(email:string):Promise<Boolean|null>
     approveTheatre(theatreId: string): Promise<Theatre | null>;
    declineTheatre(theatreId: string): Promise<Theatre | null>;
     
}
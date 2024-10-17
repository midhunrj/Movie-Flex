import { Movie } from "../../Domain/entities/movies"
import { User } from "../../Domain/entities/user"

export interface IuserRepository{
    findByEmail(email:string):Promise<User|null>
    createUser(user:User):Promise<User>
    //verifyOtp(otp:string):Promise<any>
    updatePassword(email:string,password:string):Promise<any>
    findById(id:string):Promise<User|null>
    updateUser(user:User):Promise<User|null>
    ComingSoon():Promise<Movie[]|null>
    RollingNow():Promise<Movie[]|null>
}
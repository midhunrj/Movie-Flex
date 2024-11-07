import { Movie } from "../../Domain/entities/movies"
import { User } from "../../Domain/entities/user"

export interface IuserRepository{
    findByEmail(email:string):Promise<User|null>
    createUser(user:User):Promise<User>
    //verifyOtp(otp:string):Promise<any>
    updatePassword(email:string,password:string):Promise<any>
    findById(id:string):Promise<User|null>
    updateUser(user:User):Promise<User|null>
    ComingSoon(filters:any,page:number,limit:number):Promise<Movie[]|null>
    RollingNow(filters:any,page:number,limit:number):Promise<Movie[]|null>
    getComingSoonCount(filters:any):Promise<number>
    getRollingNowCount(filters:any):Promise<number>
}
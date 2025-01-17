import { promises } from "dns"
import { Movie } from "../../Domain/entities/movies"
import { User } from "../../Domain/entities/user"
import { TierData } from "../../Domain/entities/shows"

export interface IuserRepository{
    findByEmail(email:string):Promise<User|null>
    createUser(user:User):Promise<User>
    //verifyOtp(otp:string):Promise<any>
    updatePassword(email:string,password:string):Promise<any>
    findById(id:string):Promise<User|null>
    updateUser(user:User):Promise<User|null>
    ComingSoon(filters:any,page:number,limit:number,sortOptions:string):Promise<Movie[]|null>
    RollingNow(filters:any,page:number,limit:number,sortOptions:string):Promise<Movie[]|null>
    getComingSoonCount(filters:any):Promise<number>
    getRollingNowCount(filters:any):Promise<number>
     newRating(movieId:string,rating:number,userId:string):Promise<Movie|null>

}
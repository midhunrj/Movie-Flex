import { IuserRepository } from "../repositories/Iuserrepository";
import { User, UserCoordinates } from "../../Domain/entities/user";
 import { MailService } from "../../infrastructure/services/mailService";
 import { OtpService } from "../../infrastructure/services/otpService";
 import { HashService } from "../../infrastructure/services/hashService";
import { JWTService } from "../../infrastructure/services/jwtService";
import { Movie } from "../../Domain/entities/movies";
import { IShowtime, ITier } from "../../infrastructure/database/models/showModel";
import { IShowRepository } from "../repositories/iShowRepository";
import { Types } from "mongoose";
import { TierData } from "../../Domain/entities/shows";
import { IWalletRepository } from "../repositories/iWalletRepository";
import { WalletTransaction } from "../../Domain/entities/wallet";
export class UserUseCases{
    constructor(private userRepository:IuserRepository,private showRepository:IShowRepository,private walletRepo:IWalletRepository, private hashservice:HashService,private otpservice:OtpService,private mailService:MailService,private jwtService:JWTService,private verifyToken:string="",private verifyMail:string="", ){}
async register(user:User):Promise<String>
{
    console.log(user.password,"before hash");
    const verify=await this.userRepository.findByEmail(user.email)
    if(verify)
    {
       let status='403'
        return status
    }
    user.password=await this.hashservice.hash(user.password)
    const otp=await this.otpservice.generateOtp()
    const token=await this.otpservice.generateToken(user.email,user,otp)
     await this.mailService.sendMail(user.name,user.email,otp)
    //return this.userRepository.createUser(user)
    return token
}

async login(email:string,password:string):Promise<{user:User,role:string,accessToken:string,refreshToken:string}|null>
{
    const user=await this.userRepository.findByEmail(email)
    if(!user)
    {
        return null
    }
    // if(user.is_blocked)
    // {
    //     return {status:403,message:"Your Account has been Blocked"}
    // }
    if(user&& await this.hashservice.compare(password,user.password))
    {
        let role='user'
        const payload={userId:user.id,role:'user'}
        const accessToken = this.jwtService.signAccessToken(payload);
        const refreshToken = this.jwtService.signRefreshToken(payload);
  
            return { user,role, accessToken, refreshToken };
    }

    return null
}


async sendOtp(email:string):Promise<void>
{
    console.log(email,"email fro otp");
    
    const user=await this.userRepository.findByEmail(email)
    if(user)
    {
        const otp=this.otpservice.generateOtp()
      
        await this.mailService.sendMail(user.name,email,otp)
       const token= await this.otpservice.saveTempUserData(email,user,otp)
       this.verifyToken=token
       this.verifyMail=email
        
    }
}

async verifyUser(token: string, otp: string): Promise<boolean> {

    try {
        
   
    const { isValid, data } = this.otpservice.verifyToken(token);
       console.log("isverify otp",isValid,data);
       
    if (isValid && data.otp === otp) {
        console.log("janwar");
        
        const user: User = data.user;
        user.is_verified = true;
        console.log("jhony yes papa");
        
        const use=await this.userRepository.createUser(user);
        console.log(use);
        
         console.log("mehnwar");
         
        return true;
    }
    else
    {
        console.log("otp verification failed");
        
    return false;
    }
} catch (error) {
    console.log("error in verifying otp",error);
      return false  
}
}

async verifyOtp( otp: string): Promise<boolean> {
    let token=this.verifyToken
    const { isValid, data } = this.otpservice.verifyToken(token);

    return isValid && data.otp === otp;
}


async resetPassword(newPassword:string):Promise<void>
{
    let email=this.verifyMail
    console.log(newPassword,"newpassword before hash");
    
    const hashedPassword=await this.hashservice.hash(newPassword)
      await this.userRepository.updatePassword(email,hashedPassword)
}

async resendOtp(token:string):Promise<String|null>
{
    const { isValid, data } = this.otpservice.verifyToken(token);
    console.log(isValid,data,"before resend otp confirming");
    
        if (isValid) {
            const newOtp = this.otpservice.generateOtp(); 
            const newToken = this.otpservice.generateToken(data.email, data.user, newOtp); 
            await this.mailService.sendMail(data.user.name,data.email,newOtp)
            return newToken; 
        } else {
            return null; 
        }
}


async updateProfile(userId: string | undefined, profileData: any): Promise<User | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!profileData) {
      throw new Error("No profile data provided");
    }

    // Fetch user from repository
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { name, email, mobile, oldPassword, newPassword } = profileData;

    // If newPassword is provided, the user is trying to change their password
    if (newPassword) {
      if (!oldPassword) {
        throw new Error("Old password is required to change password");
      }

      // Verify old password
      const isPasswordValid = await this.hashservice.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new Error("Incorrect old password");
      }

      // Hash the new password
      const hashedPassword = await this.hashservice.hash(newPassword);

      // Update password in the user entity
      user.password = hashedPassword;
    }

    // Update profile fields if provided
    if (name){ user.name = name;}
    if (email){ user.email = email;}
    if (mobile){ user.mobile = mobile;}

    // Save the updated user entity back to the repository
    const updatedUser = await this.userRepository.updateUser(user);

    return updatedUser;
  }

    // async upcomingMovies():Promise<Movie[]|null>{
    //     const upcomingMovieData=await this.userRepository.ComingSoon()
    //     return upcomingMovieData
    // }
    // async nowShowingMovies():Promise<Movie[]|null>
    // {
    //    const nowShowingMovieData=await this.userRepository.RollingNow()
    //    return nowShowingMovieData
    // }

    async upcomingMovies(filters: any, page: number, limit: number,sortOptions:string): Promise<Movie[] | null> {
        return await this.userRepository.ComingSoon(filters, page, limit,sortOptions);
      }
    
      async nowShowingMovies(filters: any, page: number, limit: number,sortOptions:string): Promise<Movie[] | null> {
        return await this.userRepository.RollingNow(filters, page, limit,sortOptions);
      }
    
      async upcomingMoviesCount(filters: any): Promise<number> {
        return await this.userRepository.getComingSoonCount(filters);
      }
    
      async nowShowingMoviesCount(filters: any): Promise<number> {
        return await this.userRepository.getRollingNowCount(filters);
      }

      async getShowtimes(movieId:Types.ObjectId,date:string,userCoords:UserCoordinates):Promise<IShowtime[]>
      {
        console.log(userCoords,"usercoordinates in usecase");
        
        return await this.showRepository.listShowtimes(movieId,date,userCoords)
      }

      async getTheatreShowtimes(screenId:string,date:string):Promise<IShowtime[]>
      {
        return await this.showRepository.listTheatreShowtimes(screenId,date)
      }

      async showtimeSeats(showtimeId:string):Promise<ITier[]|null>
      {
        return await this.showRepository.getSeatlayout(showtimeId)
      }

      async ratingMovie(movieId:string,rating:number,userId:string):Promise<Movie|null>
      {
         return await this.userRepository.newRating(movieId,rating,userId)
      }

      async walletByUser(userId: string) {
        const wallet = await this.walletRepo.getWalletByUserId(userId);
        // if (!wallet) {
        //   return { balance: 0, transactions: [] };
        // }
        return wallet;
      }
      async updateUserWallet(userId: string, amount: number, description: string, type: 'Credit' | 'Debit') {
        const transaction: WalletTransaction = {
          userId,
          type,
          amount,
          date: new Date(),
          description,
        };
        console.log(transaction,"transaction here")
        
      
        await this.walletRepo.updateWallet(userId, amount, transaction);
      }

      async WalletTransaction(userId:string,page:number,limit:number)
      {
        const wallet = await this.walletRepo.getWalletByUser(userId,page,limit);
        // if (!wallet) {
        //   return { balance: 0, transactions: [] };
        // }
        return wallet;
      }
}


// async verifyUser(email:string,otp:string):Promise<boolean>
// {
//     const tempUserData=await this.otpservice.verifyToken(email)

//     if(tempUserData &&await this.otpservice.verifyOtp(email,otp))
//     {
//         const user:User=tempUserData.user
//         user.is_verified=true
//         await this.userRepository.createUser(user)
//         await this.otpservice.deleteTempUserData(email)
//         return true
//     }

//     return false
//     //return await this.otpservice.verifyOtp(email,otp)
//       //return savedOtp===otp
// }

// async verifyOtp(email:string,otp:string):Promise<boolean>
// {
//     return await this.otpservice.verifyOtp(email,otp)
//       //return savedOtp===otp
// }

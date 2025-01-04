import { TierData } from "../../Domain/entities/shows";
import { Theatre } from "../../Domain/entities/theatre";
import { IShowtime, ITier } from "../../infrastructure/database/models/showModel";
import { ShowRepository } from "../../infrastructure/repositories/showRepository";
import { HashService } from "../../infrastructure/services/hashService";
import { JWTService } from "../../infrastructure/services/jwtService";
import { LocationService } from "../../infrastructure/services/locationService";
import { MailService } from "../../infrastructure/services/mailService";
import { OtpService } from "../../infrastructure/services/otpService";
import { ITheatreRepository } from "../repositories/iTheatreRepository";

export class TheatreUseCase{
    constructor (private theatreRepository:ITheatreRepository,private showRepository:ShowRepository, private hashService:HashService,private otpService:OtpService,private mailService:MailService,private jwtService:JWTService,private locationService:LocationService)
    {}

    async register(theatre:Theatre, theatreLicensePath: string):Promise<String>
{
    console.log(theatre,"jfskjfjdskf");

    const verify=await this.theatreRepository.findByEmail(theatre.email)
    if(verify)
    {
       let status='403'
        return status
    }
    
    theatre.password=await this.hashService.hash(theatre.password)
    
    theatre.licenseImage = theatreLicensePath
    theatre.address={
        ...theatre.address,
        primaryPhone:theatre.mobile
    }
    //return this.theatreRepository.createTheatre(theatre)
    const otp=await this.otpService.generateOtp()
   const token=await this.otpService.generateThetre(theatre.email,theatre,otp)
     await this.mailService.sendMail(theatre.name,theatre.email,otp)
     console.log("majumbak dum dum");
     
     return token
}

async login(email:string,password:string):Promise<{theatre:Theatre,role:string,accessToken:string,refreshToken:string}|null>
{
    console.log("gjhi");
    
    const theatre=await this.theatreRepository.findByEmail(email)
    if(!theatre)
    {
        return null
    }
    // if(user.is_blocked)
    // {
    //     return {status:403,message:"Your Account has been Blocked"}
    // }
    if(theatre&& await this.hashService.compare(password,theatre.password))
    {
        let role='theatre'
        const payload={userId:theatre._id,role:'theatre'}
        const accessToken = this.jwtService.signAccessToken(payload);
        const refreshToken = this.jwtService.signRefreshToken(payload);
  
            return { theatre,role, accessToken, refreshToken };
    }

    return null
}



async sendOtp(email:string):Promise<void>
{
    const theatre=await this.theatreRepository.findByEmail(email)
    if(theatre)
    {
        const otp=this.otpService.generateOtp()

        await this.mailService.sendMail(theatre.name,email,otp)
        await this.otpService.saveTempTheatreData(email,theatre,otp)
    }
}


// async verifytheatre(email:string,otp:string):Promise<boolean>
// {
//     const temptheatreData=await this.otpService.verifyToken(email)

//     if(temptheatreData &&await this.otpService.verifyOtp(email,otp))
//     {
//         const theatre:Theatre=temptheatreData.theatre
//         theatre.is_verified=true
//         await this.theatreRepository.createTheatre(theatre)
        
//         return true
//     }

//     return false
//     //return await this.otpservice.verifyOtp(email,otp)
//       //return savedOtp===otp
// }

async verifyTheatre(token: string, otp: string): Promise<boolean> {
    try {
        
   
        const { isValid, data } = this.otpService.verifyToken(token);
           console.log("isverify otp",isValid,data);
           
        if (isValid && data.otp === otp) {
            console.log("janwar");
            
            const theatre: Theatre = data.theatre;
            theatre.is_verified= true;
            console.log("jhony yes papa");
            if(theatre.address)
            {
                theatre.address.primaryPhone=theatre.mobile
            }
            const theatreData=await this.theatreRepository.createTheatre(theatre);
            console.log("thed",theatreData);
            
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


async verifyOtp(email:string,otp:string):Promise<boolean>
{
    return await this.otpService.verifyOtp(email,otp)
      //return savedOtp===otp
}


async resetPassword(email:string,newPassword:string):Promise<void>
{
    const hashedPassword=await this.hashService.hash(newPassword)
      await this.theatreRepository.updatePassword(email,hashedPassword)
}

async resendOtp(token:string):Promise<String|null>
{
    const { isValid, data } = this.otpService.verifyToken(token);
    console.log(isValid,data,"before resend otp confirming");
    
        if (isValid) {
            const newOtp = this.otpService.generateOtp(); 
            const newToken = this.otpService.generateThetre(data.email, data.theatre, newOtp); 
            await this.mailService.sendMail(data.theatre.name,data.email,newOtp)
            return newToken; 
        } else {
            return null; 
        }
}

async completeTheatreprofile(theatreId: string|undefined, addressData: any): Promise<any> {
    // Fetch coordinates based on the address
    const coordinates = await this.locationService.getCoordinatesFromAddress(addressData);
     console.log("gatuu");
     
    const location = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
    };
    console.log(location,"in coordinates location");
    

    // Update the theatre profile
    const updatedProfile = await this.theatreRepository.updateProfile(theatreId, {
        address: addressData,
        location,
    });

    return updatedProfile;
}
async getTheatreShowtimes(screenId:string,date:string):Promise<IShowtime[]>
      {
        return await this.showRepository.listTheatreShowtimes(screenId,date)
      }
      async showtimeSeats(showtimeId:string):Promise<ITier[]|null>
      {
        return await this.showRepository.getSeatlayout(showtimeId)
      }
}
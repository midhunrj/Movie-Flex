import { IAdminRepository } from "../repositories/iAdminRepository"; 
import { Admin } from "../../Domain/entities/admin"; 
import { User } from "../../Domain/entities/user";
import { Theatre } from "../../Domain/entities/theatre";
import { JWTService } from "../../infrastructure/services/jwtService";
import { MailService } from "../../infrastructure/services/mailService";

export class AdminUseCase{
    constructor(private adminRepository:IAdminRepository,private hashservice:any,private jwtService:JWTService,private mailService: MailService){}


async login(email:string,password:string):Promise<{adminLog:Admin,role:string,accessToken:string,refreshToken:string}|null>
{
    let adminHashPass=await this.hashservice.hash(process.env.Admin_Pass)
    const admin=await this.adminRepository.AdminLogin(email)
    let adminLog={email,password}
    if(admin&& await this.hashservice.compare(password,adminHashPass))
    {
        let role='admin'
        const payload={userId:email,role:'admin'}
        const accessToken = this.jwtService.signAccessToken(payload);
        const refreshToken = this.jwtService.signRefreshToken(payload);
  
            return {adminLog,role, accessToken, refreshToken };
    }

    return null

}

async fetchUserDetails():Promise<User[]|null>
{
    return await this.adminRepository.listUsers()
}

async fetchTheatreDetails():Promise<Theatre[]|null>
{
    return await this.adminRepository.listTheatres()
}

async blockUser(userId:string):Promise<User|null>
{
    return await this.adminRepository.blockUser(userId)
}


async unblockUser(userId:string):Promise<User|null>
{
    return await this.adminRepository.unblockUser(userId)
}

async blockTheatre(theatreId:string):Promise<Theatre|null>
{
    return await this.adminRepository.blockTheatre(theatreId)
}


async unblockTheatre(theatreId:string):Promise<Theatre|null>
{
    return await this.adminRepository.unblockTheatre(theatreId)
}

async approveTheatre(theatreId: string): Promise<Theatre | null> {
    const theatre = await this.adminRepository.approveTheatre(theatreId);
    if (theatre) {
         this.mailService.sendApprovalMail(theatre.name, theatre.email)
    }
    return theatre;
}


async declineTheatre(theatreId: string): Promise<Theatre | null> {
    const theatre = await this.adminRepository.declineTheatre(theatreId);
    if (theatre) {
        this.mailService.sendDeclineMail(theatre.name, theatre.email)
    }
    return theatre;
}
}
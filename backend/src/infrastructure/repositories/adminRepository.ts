
//import { Theatre } from "../../Domain/entities/theatre";
//import { theatreModel } from "../database/models/theatreModel";

import { IAdminRepository } from "../../application/repositories/iAdminRepository";
import { Admin } from "../../Domain/entities/admin";
import { Theatre } from "../../Domain/entities/theatre";
import { User } from "../../Domain/entities/user";
import { theatreModel } from "../database/models/theatreModel";
import { userModel } from "../database/models/userModel";

export class AdminRepository implements IAdminRepository{
   
    async AdminLogin(email: string): Promise<Boolean | null> {
        let adminEmail=process.env.Admin_Email
        return adminEmail===email
    }

    async listUsers(): Promise<User[] | null> {
        return userModel.find({}).exec()
    }

    async listTheatres(): Promise<Theatre[] | null> {
        return theatreModel.find({is_approved:{$ne:"Declined"}}).exec()
    }
    async blockUser(userId: string): Promise<User | null> {
       return await userModel.findByIdAndUpdate(userId,{is_blocked:true},{new:true})
    //    if(user)
    //    {
    //     return true
    //    }
    //    else
    //    {
    //     return null
    //    }
        

    }
    async unblockUser(userId: string): Promise<User | null> {
        return await userModel.findByIdAndUpdate(userId,{is_blocked:false},{new:true})
        // if(user)
        // {
        //  return true
        // }
        // else
        // {
        //  return null
        // } 
    }

    async blockTheatre(theatreId: string): Promise<Theatre | null> {
        return await theatreModel.findByIdAndUpdate(theatreId,{is_blocked:true},{new:true})
    //    if(theatre)
    //    {
    //     return true
    //    }
    //    else
    //    {
    //     return null
    //    }
       
    }

    async unblockTheatre(theatreId: string): Promise<Theatre | null> {
        return await theatreModel.findByIdAndUpdate(theatreId,{is_blocked:false},{new:true})
    //    if(theatre)
    //    {
    //     return true
    //    }
    //    else
    //    {
    //     return null
    //    }
       
    }

    async findById(email: string): Promise<Boolean | null> {
        let adminEmail=process.env.Admin_Email
        return adminEmail===email
    }

    async approveTheatre(theatreId: string): Promise<Theatre | null> {

        console.log("approveTheatre id",theatreId);
        
        const theatre = await theatreModel.findById(theatreId);
        if (!theatre) return null;

        theatre.is_approved = "Approved";  // Set the status as 'approved'
        await theatre.save();

        return theatre;
    }

    async declineTheatre(theatreId: string): Promise<Theatre | null> {
        const theatre = await theatreModel.findById(theatreId);
        if (!theatre) return null;

        theatre.is_approved="Declined";  // Set the status as 'declined'
        await theatre.save();

        return theatre;
    }
}

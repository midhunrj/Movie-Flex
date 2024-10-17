import { ITheatreRepository } from "../../application/repositories/iTheatreRepository";
import { Theatre } from "../../Domain/entities/theatre";
import { theatreModel } from "../database/models/theatreModel";

export class TheatreRepository implements ITheatreRepository{
   
    async findByEmail(email: string): Promise<Theatre | null> {
        return theatreModel.findOne({ email }).exec();
    }

    async createTheatre(theatre: Theatre): Promise<Theatre> {
        const newTheatre = new theatreModel(theatre);
        return newTheatre.save();
    }

    async updatePassword(email:string,password: string): Promise<any> {
        await theatreModel.updateOne({email},{password})
    }

    async findById(id: string): Promise<Theatre | null> {
        return await theatreModel.findById(id).exec()
    }

    async updateProfile(theatreId: string, profileData: Partial<Theatre>): Promise<Theatre|null> {
        return await theatreModel.findByIdAndUpdate(theatreId, profileData, { new: true });
    }
}
import { ScreenModel } from "../database/models/screenModel";
import { Screen } from '../../Domain/entities/screens';

export class ScreenRepository {
  async create(screen: Screen): Promise<Screen> {
    const newScreen = new ScreenModel(screen);
    return await newScreen.save();
  }

  async findById(screenId: string): Promise<Screen | null> {
    return await ScreenModel.findById(screenId).populate('movies.movieId');
  }

  async findByTheatre(theatreId: string): Promise<Screen[]> {
    return await ScreenModel.find({ theatreId }).populate('movies.movieId');
  }

  async update(screenId: string, screenData: Partial<Screen>): Promise<Screen | null> {
    return await ScreenModel.findByIdAndUpdate(screenId, screenData, { new: true });
  }

  async delete(screenId: string): Promise<void> {
    await ScreenModel.findByIdAndDelete(screenId);
  }
}

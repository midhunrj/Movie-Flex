import { Request, Response } from 'express';
import { CreateScreenUseCase } from '../../application/usecases/screens';
import { GetScreensByTheatreUseCase } from '../../application/usecases/screens';

export class ScreenController {
  constructor(
    private createScreenUseCase: CreateScreenUseCase,
    private getScreensByTheatreUseCase: GetScreensByTheatreUseCase
  ) {}

  async createScreen(req: Request, res: Response): Promise<void> {
    try {
      const screenData = req.body;
      const newScreen = await this.createScreenUseCase.execute(screenData);
      res.status(201).json(newScreen);
    } catch (error) {
      res.status(500).json({ message: "failed to create Screen" });
    }
  }

  async getScreensByTheatre(req: Request, res: Response): Promise<void> {
    try {
      const { theatreId } = req.params;
      const screens = await this.getScreensByTheatreUseCase.execute(theatreId);
      res.status(200).json(screens);
    } catch (error) {
      res.status(500).json({ message: "failed to get screen by theatre"});
    }
  }
}

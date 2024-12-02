import { Request, Response } from 'express';
import { ScreenUseCase } from '../../application/usecases/screens';
import { NextFunction } from 'express-serve-static-core';
import { log } from 'node:console';
import { UserCoordinates } from '../../Domain/entities/user';

export class ScreenController {
  constructor(
    private screenUseCase: ScreenUseCase,
   
  ) {}

  async createScreen(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const screenData = req.body;
      console.log(screenData,"screenData")
      
      const newScreen = await this.screenUseCase.addNewScreen(screenData.screenData)
      res.status(201).json(newScreen);
    } catch (error) {
      console.log(error,"error");
      
      res.status(500).json({ message: "failed to create Screen" });
    }
  }

  async getScreensByTheatre(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query,"query values");
      
      const  theatreId  = req.query.theatreId as string
      console.log(theatreId,"theatreid in controller");
      
      const screens = await this.screenUseCase.findScreensByTheatre(theatreId);
      res.status(200).json({message:'screens listed in theatre',screenData:screens});
    } catch (error) {
      res.status(500).json({ message: "failed to get screen by theatre"});
    }
  }

  async updateTier(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query,"query values");
      console.log(req.body,"body");
      
      const {tierData}  = req.body
      const screenId=req.body.screenId
      
      console.log(tierData,"tierData in controller");
      console.log(screenId,"screei id");
      
      const tierId=tierData._id
      const screens = await this.screenUseCase.updateTier(screenId,tierId,tierData);
      res.status(200).json({message:'screens listed in theatre',screenData:screens});
    } catch (error) {
      res.status(500).json({ message: "failed to get screen by theatre"});
    }
  }

  async addMoviesToScreen(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query,"query values");
      console.log(req.body,"body");
      
      const {movie}  = req.body
      const screenId=req.body.screenId
      
      console.log(movie,"movieData going to add in screen");
      console.log(screenId,"screei id");
      
      //const tierId=tierData._id
      const {success,screenData} = await this.screenUseCase.addMoviesViaScreen(screenId,movie)
      if(!success)
      {
        res.status(400).json({message:'movie has already been added to the theatre'})
      }
      else{
      res.status(200).json({message:'movie has been added to the theatre',screenData:screenData});
      }
    } catch (error) {
      res.status(500).json({ message: "failed to add movies to screen "});
    }
  }
  async updateScreen(req: Request, res: Response): Promise<void> {
    try {
    
      console.log(req.body,"body in update screen");
      
      const {screenData}  = req.body
      const screenId=req.body.screenData._id
      
      
      console.log(screenId,"screei id");
      
      
      const screens = await this.screenUseCase.updateScreen(screenId,screenData);
      res.status(200).json({message:'screens listed in theatre',screenData:screens});
    } catch (error) {
      res.status(500).json({ message: "failed to get screen by theatre"});
    }
  }

  async addMoviesToShowtime(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query,"query values");
      console.log(req.body,"body");
      
      const {showtimeData}  = req.body
      
      
      
      //const tierId=tierData._id
      const showTimeData = await this.screenUseCase.addMoviesToShow(showtimeData)
      
      console.log(showTimeData,"showdata after movie added to showtime");
      
      res.status(200).json({message:'movie has been added to the show',screenData:showTimeData});
      
    } catch (error) {
      res.status(500).json({ message: "failed to add movies to screen "});
    }
  }
  async removeShowtime(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query,"query values");
      console.log(req.body,"body");
      
      const {showtimeId,screenId}  = req.query
      
      
      
      //const tierId=tierData._id
      const screenData = await this.screenUseCase.removeShowFromScreen(showtimeId as string,screenId as string)
      
      
      res.status(200).json({message:'show has been removed from the screen',screenData});
      
    } catch (error) {
      res.status(500).json({ message: "failed to remove showtime "});
    }
  }

  async fetchUserTheatres(req:Request,res:Response,next:NextFunction){
    try {
        const { latitude, longitude } = req.query
    
        if (!latitude || !longitude) {
          return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }
        const userCoords: UserCoordinates = {
            latitude: parseFloat(req.query.latitude as string),
            longitude: parseFloat(req.query.longitude as string),
          };
        const theatres = await this.screenUseCase.getTheatresWithScreens(userCoords)
    
        return res.status(200).json({ theatres });
      } catch (error) {
        console.error('Error in getting theatres with screens:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}

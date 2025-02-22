 import { Request, Response, NextFunction } from 'express';



import { JWTService } from '../../../infrastructure/services/jwtService';
import { UserRepository } from '../../../infrastructure/repositories/userRepository';
import { AdminRepository } from '../../../infrastructure/repositories/adminRepository';
import { TheatreRepository } from '../../../infrastructure/repositories/theatreRepository';

class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}



declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
            theatre?:{
                id:string,
                role:string,
            }
            ratingCount?:number
        }
    }
}

export class AuthHandler {

    constructor(
        private jwtService: JWTService, 
        private userRepository: UserRepository, 
        private adminRepository: AdminRepository, 
        private theatreRepository: TheatreRepository
    ) { console.log("JWTService in AuthHandler:", this.jwtService);}

    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.query,"ggs")
            const token = req.headers?.["authorization"]?.split(' ')[1];
            if (!token) {
                throw new HttpError("No access token found", 403);
            }
   
            const decodeToken = await this.jwtService.verifyAccessToken(token);
            if (!decodeToken) {
                throw new HttpError("Token is not valid", 401);
            }

            if (decodeToken.role !== 'user') {
                throw new HttpError("This route is not authorized for your role", 403);
            }
            req.user = {
                id: decodeToken.userId, 
                role: decodeToken.role 
            }  
            
            const isUserValid = await this.userRepository.findById(decodeToken.userId);
            if (!isUserValid || isUserValid.is_blocked) {
                throw new HttpError("Not Authorized the user has been blocked temporarily", 403);
            }
              // req.user=decodeToken
            next();
        } catch (error) {
            next(error);
        }
    }

    async adminLogin(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("okfj");
            
            const token = req.headers?.["authorization"]?.split(' ')[1];
            if (!token) {
                throw new HttpError("No access token found", 403);
            }

            const decodeToken = await this.jwtService.verifyAccessToken(token);
            if (!decodeToken) {
                throw new HttpError("Token is not valid", 401);
            }

            if (decodeToken.role !== 'admin') {
                throw new HttpError("This route is not authorized for your role", 403);
            }
             
            const isAdminValid = await this.adminRepository.AdminLogin(decodeToken.email);
            // if (!isAdminValid || isAdminValid.is_blocked) {
            //     throw new HttpError("Not Authorized", 403);
            // }
            console.log("jiko");
            
            next();
        } catch (error) {
            next(error); 
        }
    }

    async theatreLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers?.["authorization"]?.split(' ')[1];
            if (!token) {
                throw new HttpError("No access token found", 403);
            }

            const decodeToken = await this.jwtService.verifyAccessToken(token);
            if (!decodeToken) {
                throw new HttpError("Token is not valid", 401);
            }

            if (decodeToken.role !== 'theatre') {
                throw new HttpError("This route is not authorized for your role", 403);
            }
            console.log(decodeToken,"decodetoken in theatre");
            req.theatre={
                id:decodeToken.userId,
                role:decodeToken.role
            }
            const isTheatreValid = await this.theatreRepository.findById(decodeToken.userId);
            if (!isTheatreValid || isTheatreValid.is_blocked) {
                throw new HttpError("Not Authorized", 403);
            }

            next();
        } catch (error) {
            next(error); 
        }
    }
}


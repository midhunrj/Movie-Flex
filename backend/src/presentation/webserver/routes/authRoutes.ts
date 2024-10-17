// import {Router} from 'express'

// import { googleLoginController } from '../../controllers/authController'

// const router=Router()

// router.post('/google',googleLoginController)

// export default router


import { Router } from 'express';
import { AuthController } from '../../controllers/authController';
import { AuthService } from '../../../application/services/authService';
import { AuthRepository } from '../../../infrastructure/repositories/googleAuthRepository';
import { AuthUseCase } from '../../../application/usecases/googleAuth'; 
import { JWTService } from '../../../infrastructure/services/jwtService';
import { UserRepository } from '../../../infrastructure/repositories/userRepository';
const router = Router();

const authRepo = new AuthRepository();
const jwtService=new JWTService()
const userRepo=new UserRepository()
const googleLoginUseCase = new AuthUseCase(authRepo,userRepo,jwtService);
const authService = new AuthService(googleLoginUseCase,);
const authController = new AuthController(authService);
console.log("disco disco");
router.post('/google', authController.googleLogin);
router.get('/refreshToken',authController.refreshAccessToken)
router.get('/theatre/refreshToken',authController.theatreRefreshAccessToken)
router.get('/admin/refreshToken',authController.adminRefreshAccessToken)

export default router;

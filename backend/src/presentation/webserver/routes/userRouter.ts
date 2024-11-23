import {Router} from 'express'
import { UserController } from '../../controllers/userController'
import { UserRepository } from '../../../infrastructure/repositories/userRepository'
import { UserUseCases } from '../../../application/usecases/user'
import { HashService } from '../../../infrastructure/services/hashService'
import { OtpService } from '../../../infrastructure/services/otpService'
import { MailService } from '../../../infrastructure/services/mailService'
import { JWTService } from '../../../infrastructure/services/jwtService'
import { AuthHandler } from '../middlewares/userRoleMiddleware'
import { AdminRepository } from '../../../infrastructure/repositories/adminRepository'
import { TheatreRepository } from '../../../infrastructure/repositories/theatreRepository'
import { ShowRepository } from '../../../infrastructure/repositories/showRepository'
import { ScreenController } from '../../controllers/screenController'
import { ScreenUseCase } from '../../../application/usecases/screens'
import { ScreenRepository } from '../../../infrastructure/repositories/screenRepository'


const userRoute=Router()
const userRepository=new UserRepository()
const showRepository=new ShowRepository()
const hashService=new HashService()
const otpService=new OtpService()
const mailService=new MailService()
const jwtService=new JWTService()
const adminRepository=new AdminRepository()
const screenRepository=new ScreenRepository()

const theatreRepository=new TheatreRepository()
const authHandler=new AuthHandler(jwtService,userRepository,adminRepository,theatreRepository)
const userUseCase=new UserUseCases(userRepository,showRepository,hashService,otpService,mailService,jwtService)
const userController=new UserController(userUseCase)
const screenuseCase=new ScreenUseCase(screenRepository,showRepository)
const screenController=new ScreenController(screenuseCase)

userRoute.post('/register',(req,res)=>userController.register(req,res))
userRoute.post('/verify-user',(req,res)=>userController.verifyUser(req,res))
userRoute.post('/login',(req,res)=>userController.login(req,res))
userRoute.get('/home',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.home(req,res,next))
userRoute.post('/forgot-password',(req,res)=>userController.forgotPassword(req,res))
userRoute.post('/verify-otp',(req,res)=>userController.verifyOtp(req,res))
userRoute.post('/reset-password',(req,res)=>userController.resetPassword(req,res))
userRoute.post('/resend-otp',(req,res)=>userController.resendOtp(req,res))
userRoute.put('/userprofile',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.updateUserProfile(req,res,next)) 
userRoute.get('/fetchUpcomingMovies',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.upcomingMovies(req,res,next))
userRoute.get('/fetchNowShowingMovies',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.nowShowingMovies(req,res,next))
userRoute.get('/showtimes',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.listShowtimes(req,res,next)) 
userRoute.get('/theatres',authHandler.userLogin.bind(authHandler),(req,res,next)=>screenController.fetchUserTheatres(req,res,next)) 
userRoute.get('/theatre-showtimes',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.listTheatreShowtimes(req,res,next)) 
export default userRoute
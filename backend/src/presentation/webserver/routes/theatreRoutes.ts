import {Router} from 'express'
import multer from 'multer'
import { TheatreController } from '../../controllers/theatreController'
import { TheatreRepository } from '../../../infrastructure/repositories/theatreRepository' 
import { TheatreUseCase } from '../../../application/usecases/theatre'
import { HashService } from '../../../infrastructure/services/hashService'
import { OtpService } from '../../../infrastructure/services/otpService'
import { MailService } from '../../../infrastructure/services/mailService'
import { JWTService } from '../../../infrastructure/services/jwtService'
import { AdminRepository } from '../../../infrastructure/repositories/adminRepository'
import { UserRepository } from '../../../infrastructure/repositories/userRepository'
import { AuthHandler } from '../middlewares/userRoleMiddleware'
import { FileUploadService } from '../../../infrastructure/services/fileService'
import { LocationService } from '../../../infrastructure/services/locationService'
import { ScreenController } from '../../controllers/screenController'
import { ScreenUseCase } from '../../../application/usecases/screens'
import { ScreenRepository } from '../../../infrastructure/repositories/screenRepository'
import { MovieController } from '../../controllers/movieController'
import { MongoMovieRepository } from '../../../infrastructure/repositories/movieRepository'
import { ManageMovies } from '../../../application/usecases/movies'
import { CloudinaryService } from '../../../infrastructure/services/cloudinaryService'
import { ShowRepository } from '../../../infrastructure/repositories/showRepository'


const theatreRoute=Router()
const theatreRepository=new TheatreRepository()
const hashService=new HashService()
const otpService=new OtpService()
const mailService=new MailService()
const jwtService=new JWTService()
const adminRepository=new AdminRepository()
const userRepository=new UserRepository()
const screenRepository=new ScreenRepository()
const showRepository=new ShowRepository()
const locationService=new LocationService(process.env.geocoding_Apikey||"")
const authHandler=new AuthHandler(jwtService,userRepository,adminRepository,theatreRepository)
const theatreCase=new TheatreUseCase(theatreRepository,hashService,otpService,mailService,jwtService,locationService)
const screenuseCase=new ScreenUseCase(screenRepository,showRepository)
const fileService=new FileUploadService()
const cloudinaryService=new CloudinaryService()
const theatreController=new TheatreController(theatreCase,fileService,cloudinaryService)
const screenController=new ScreenController(screenuseCase)
const movieRepo=new MongoMovieRepository()
const manageMovies=new ManageMovies(movieRepo)
const movieController=new MovieController(manageMovies)

const upload = multer({ storage: multer.memoryStorage() });
theatreRoute.post('/register',upload.single('file'),(req,res)=>theatreController.register(req,res))
theatreRoute.post('/login',(req,res)=>theatreController.login(req,res))
theatreRoute.get('/home',(req,res)=>theatreController.home(req,res))
theatreRoute.post('/verify-theatre',(req,res)=>theatreController.verifytheatre(req,res))
theatreRoute.post('/forgot-password',(req,res)=>theatreController.forgotPassword(req,res))
theatreRoute.post('/verify-otp',(req,res)=>theatreController.verifyOtp(req,res))
theatreRoute.post('/reset-password',(req,res)=>theatreController.resetPassword(req,res))
theatreRoute.post('/resend-otp',(req,res)=>theatreController.resendOtp(req,res))
theatreRoute.post('/AddScreen',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>screenController.createScreen(req,res,next))
theatreRoute.get('/showscreens',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.getScreensByTheatre(req,res))
theatreRoute.post('/completeProfile',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>theatreController.completeProfile(req,res,next))
theatreRoute.get('/RollingMovies',authHandler.theatreLogin.bind(authHandler),(req,res)=>movieController.fetchMovies(req,res))
theatreRoute.post('/update-tier',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.updateTier(req,res))
theatreRoute.post('/add-movies-screen',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.addMoviesToScreen(req,res))
theatreRoute.put('/update-screen',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.updateScreen(req,res))
theatreRoute.post('/shows-rollin-movies',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.addMoviesToShowtime(req,res))
export default theatreRoute
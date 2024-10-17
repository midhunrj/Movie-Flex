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


const theatreRoute=Router()
const theatreRepository=new TheatreRepository()
const hashService=new HashService()
const otpService=new OtpService()
const mailService=new MailService()
const jwtService=new JWTService()
const adminRepository=new AdminRepository()
const userRepository=new UserRepository()
const locationService=new LocationService(process.env.geocoding_Apikey||"")
const authHandler=new AuthHandler(jwtService,userRepository,adminRepository,theatreRepository)
const theatreCase=new TheatreUseCase(theatreRepository,hashService,otpService,mailService,jwtService,locationService)
const fileService=new FileUploadService()
const theatreController=new TheatreController(theatreCase,fileService)

const upload = multer({ storage: multer.memoryStorage() });
theatreRoute.post('/register',upload.single('file'),(req,res)=>theatreController.register(req,res))
theatreRoute.post('/login',(req,res)=>theatreController.login(req,res))
theatreRoute.get('/home',(req,res)=>theatreController.home(req,res))
theatreRoute.post('/verify-theatre',(req,res)=>theatreController.verifytheatre(req,res))
theatreRoute.post('/forgot-password',(req,res)=>theatreController.forgotPassword(req,res))
theatreRoute.post('/verify-otp',(req,res)=>theatreController.verifyOtp(req,res))
theatreRoute.post('/reset-password',(req,res)=>theatreController.resetPassword(req,res))
theatreRoute.post('/resend-otp',(req,res)=>theatreController.resendOtp(req,res))

theatreRoute.post('/completeProfile',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>theatreController.completeProfile(req,res,next))

export default theatreRoute
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
import { FavoriteRepository } from '../../../infrastructure/repositories/favouriteRepository'
import { BookingMovies } from '../../../application/usecases/booking'
import { MovieBookingRepository } from '../../../infrastructure/repositories/BookingRepository'
import { PaymentRepository } from '../../../infrastructure/repositories/paymentRepository'
import { NotificationRepository } from '../../../infrastructure/repositories/notficationRepository'
import { Notification } from '../../../application/usecases/notification'


const theatreRoute=Router()
const theatreRepository=new TheatreRepository()
const hashService=new HashService()
const otpService=new OtpService()
const mailService=new MailService()
const jwtService=new JWTService()
const adminRepository=new AdminRepository()
const userRepository=new UserRepository()
const notificationRepo=new NotificationRepository()
const notification=new Notification(notificationRepo)
const screenRepository=new ScreenRepository(notification)
const showRepository=new ShowRepository()
const locationService=new LocationService(process.env.geocoding_Apikey||"")
const authHandler=new AuthHandler(jwtService,userRepository,adminRepository,theatreRepository)
const showRepo=new ShowRepository()
const theatreCase=new TheatreUseCase(theatreRepository,showRepo,hashService,otpService,mailService,jwtService,locationService)
const screenuseCase=new ScreenUseCase(screenRepository,showRepository)
const fileService=new FileUploadService()
const cloudinaryService=new CloudinaryService()
const bookingRepo=new MovieBookingRepository()
const paymentRepo=new PaymentRepository()
const bookingUseCase=new BookingMovies(bookingRepo,paymentRepo,showRepository)
const theatreController=new TheatreController(theatreCase,fileService,cloudinaryService,bookingUseCase)
const screenController=new ScreenController(screenuseCase)
const movieRepo=new MongoMovieRepository()
const favouriteRepository=new FavoriteRepository()
const manageMovies=new ManageMovies(movieRepo,favouriteRepository)
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
theatreRoute.delete('/remove-shows',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.removeShowtime(req,res))
theatreRoute.get('/booking-trends',authHandler.theatreLogin.bind(authHandler),(req,res)=>theatreController.bookingTrends(req,res))
theatreRoute.get('/revenue-trends',authHandler.theatreLogin.bind(authHandler),(req,res)=>theatreController.revenueTrends(req,res))
theatreRoute.delete('/remove-enroll_movie',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.removeMovieFromScreen(req,res))
theatreRoute.get('/showtimes',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>theatreController.listTheatreShowtimes(req,res,next))
theatreRoute.get('/screen-layout/:showtimeId',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>theatreController.showtimeSeatLayout(req,res))
theatreRoute.post('/book-tickets',authHandler.theatreLogin.bind(authHandler),(req,res,next)=>theatreController.bookMovieTickets(req,res))
theatreRoute.get('/bookings',authHandler.theatreLogin.bind(authHandler),(req,res)=>theatreController.getBookings(req,res))
theatreRoute.put('/update-showtime',authHandler.theatreLogin.bind(authHandler),(req,res)=>screenController.updateShowtime(req,res))
export default theatreRoute
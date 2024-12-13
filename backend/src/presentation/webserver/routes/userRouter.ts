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
import { MovieController } from '../../controllers/movieController'
import { MongoMovieRepository } from '../../../infrastructure/repositories/movieRepository'
import { FavoriteRepository } from '../../../infrastructure/repositories/favouriteRepository'
import { ManageMovies } from '../../../application/usecases/movies'
import { BookingMovies } from '../../../application/usecases/booking'
import { MovieBookingRepository } from '../../../infrastructure/repositories/BookingRepository'
import { PaymentRepository } from '../../../infrastructure/repositories/paymentRepository'
import { WalletRepository } from '../../../infrastructure/repositories/walletRepository'
import { Notification } from '../../../application/usecases/notification'
import { NotificationRepository } from '../../../infrastructure/repositories/notficationRepository'


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
const walletRepo=new WalletRepository()
const userUseCase=new UserUseCases(userRepository,showRepository,walletRepo,hashService,otpService,mailService,jwtService)
const bookingRepository=new MovieBookingRepository()
const paymentRepository=new PaymentRepository()
const bookingUseCase=new BookingMovies(bookingRepository,paymentRepository,showRepository)
const notifyRepo=new NotificationRepository()
const notifyCase=new Notification(notifyRepo)
const userController=new UserController(userUseCase,bookingUseCase,notifyCase)
const screenuseCase=new ScreenUseCase(screenRepository,showRepository)
const screenController=new ScreenController(screenuseCase)
const movieRepo=new MongoMovieRepository()
const favouriteRepository=new FavoriteRepository()
const manageMovies=new ManageMovies(movieRepo,favouriteRepository)
const movieController=new MovieController(manageMovies)
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
userRoute.put('/add-favourite',authHandler.userLogin.bind(authHandler),(req,res,next)=>movieController.addFavorite(req,res)) 
userRoute.delete('/remove-favourite',authHandler.userLogin.bind(authHandler),(req,res,next)=>movieController.removeFavorite(req,res)) 
userRoute.get('/favourites',authHandler.userLogin.bind(authHandler),(req,res,next)=>movieController.getFavorites(req,res)) 
userRoute.post('/book-tickets',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.bookMovieTickets(req,res))
//userRoute.post('/confirm-payment',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.confirmMovieTickets(req,res)) 
userRoute.post('/create-order',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.initiateOrder(req,res))
userRoute.post('/verify-payment',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.verifyPayment(req,res))
userRoute.get('/screen-layout',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.showtimeSeatLayout(req,res))
userRoute.get('/bookings-history',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.bookingOrders(req,res)) 
userRoute.put('/cancel-booking',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.cancelTickets(req,res)) 
userRoute.put('/add-rating',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.postRating(req,res)) 
userRoute.get('/wallet',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.userWallet(req,res)) 
userRoute.put('/update-wallet',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.updateWallet(req,res)) 
userRoute.get('/Notification',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.getNotifications(req,res)) 
userRoute.post('/wallet-payment',authHandler.userLogin.bind(authHandler),(req,res,next)=>userController.updateWallet(req,res)) 

export default userRoute
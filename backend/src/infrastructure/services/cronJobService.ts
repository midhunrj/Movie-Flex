import cron from 'node-cron'
import { ShowRepository } from '../repositories/showRepository'
import { MovieBookingRepository } from '../repositories/BookingRepository'
import { BookingMovies } from '../../application/usecases/booking'
import { PaymentRepository } from '../repositories/paymentRepository'
import { ScreenModel } from '../database/models/screenModel'
import { ScreenRepository } from '../repositories/screenRepository'
import { BookingModel } from '../database/models/bookingModel'
import { NotificationRepository } from '../repositories/notficationRepository'
import { Notification } from '../../application/usecases/notification'
import { NotificationType } from '../database/models/notficationModel'
import { MovieModel } from '../database/models/movieModel'

const showRepository=new ShowRepository()
const notificationRepo=new NotificationRepository()
const notification=new Notification(notificationRepo)
 const screenRepository=new ScreenRepository(notification)
 const notificationRepository=new NotificationRepository()
const bookingService=new BookingMovies(new MovieBookingRepository,new PaymentRepository,new ShowRepository)
const notificationService=new Notification(new NotificationRepository)

cron.schedule('* * * * *', () => {
    console.log('Cron job executed at:', new Date());
  });


cron.schedule('0 0 0 * * * *', async ()=>{
    try{
    const currentDate=new Date()
    const yesterday = new Date(currentDate);
    yesterday.setUTCDate(currentDate.getUTCDate() - 1); // Subtract 1 day in UTC
    yesterday.setUTCHours(0, 0, 0, 0); 
//yesterday.setHours(0,0,0,0)
console.log(`Running cleanup job. Current Date: ${currentDate.toISOString()}, Yesterday:${yesterday}  ${yesterday.toISOString()}`);

   await showRepository.deleteExpiredShowtimes(yesterday)

   await screenRepository.updateExpiredMovieFromScreen()
   console.log(`showtimes of yesterday ${yesterday.toDateString()} has been deleted successfully`);
   
    }
    catch(error:any)
    {
        console.log(error,"error in deleting yesterday showtimes from database");
        
    }
},
{
  scheduled: true,
  timezone: "Asia/Kolkata" 
})
 

cron.schedule('* * * * *', async () => {
    try {
      console.log("Running session verification...");
      await bookingService.sessionVerify()
      console.log("Expired sessions updated successfully.");
    } catch (error:any) {
      console.error("Error during session verification:", error);
    }
console.log("dfss");

console.log(new Date(new Date().getTime()+60*60*1000),"ne date one hour")
const utcTime = new Date(); 
const localTime = new Date(utcTime.getTime() - utcTime.getTimezoneOffset() * 60000);
const currentTime = new Date();
console.log("Current Time (Local):", currentTime.toLocaleString());

const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
// const formattedTime = oneHourLater.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//console.log("Formatted Time:", formattedTime); 
console.log("One Hour Later (Local):", oneHourLater)
// console.log("UTC Time:", utcTime.toISOString());
// console.log("Local Time:", localTime.toLocaleString())
const startOfDay=new Date().setHours(0,0,0,0)
const endOfDay=new Date().setHours(23,59,59,999)
   const upcomingBookings= await BookingModel.find({$and:[{showDate:{$gte:startOfDay,$lte:endOfDay}},{showtime:{$eq:oneHourLater}}]})
   console.log(upcomingBookings,"upcomingBookings ");
//console.log(upcomingBookings.showtime);

  upcomingBookings.forEach(async(upcoming) => {
console.log(new Date(upcoming.showtime).toLocaleString);

    const movieName=await MovieModel.findById(upcoming.movieId,{title:1,_id:0})
console.log(movieName,"movie");

    const data = {
      bookingId: upcoming._id,
      movieDetails: {
        name: movieName?.title!,
        image: movieName?.poster_path!,
      },
      screenData: {
        screenName: upcoming.screenData?.screenName,
        screenType: upcoming.screenData?.screenType,
        tierName:upcoming.screenData?.tierName
      },
      // theatreDetails: {
      //   name: bookingData.theatreDetails?.name,
      //   address: bookingData.theatreDetails?.address,
      // },
      showDetails: {
        showtime: upcoming.showtime,
        showDate: upcoming.showDate,
      },
      selectedSeats: upcoming.selectedSeats,
      totalPrice: upcoming.totalPrice,
    };

    const notificationData = {
      recipients:[{recipientId:upcoming.userId,recipientRole:"user"}],
      type: NotificationType.REMINDER_ALERT,
      title: 'Ticket Reminder',
      message: `🎬 Reminder: Your movie ${movieName?.title} starts at ${upcoming.showtime}. Be there in 1 hour! Enjoy the show! ✨"`,
      data,
    };
    console.log(notificationData,"kmklj");
    
       await notificationService.newNotification(notificationData)
   });
   
  });



  
import cron from 'node-cron'
import { ShowRepository } from '../repositories/showRepository'
import { MovieBookingRepository } from '../repositories/BookingRepository'
import { BookingMovies } from '../../application/usecases/booking'
import { PaymentRepository } from '../repositories/paymentRepository'

const showRepository=new ShowRepository()
 
const bookingService=new BookingMovies(new MovieBookingRepository,new PaymentRepository,new ShowRepository)

cron.schedule('* * * * *', () => {
    console.log('Cron job executed at:', new Date());
  });


cron.schedule('0 0 * * *', async ()=>{
    try{
    const currentDate=new Date()
    const yesterday = new Date(currentDate);
yesterday.setDate(currentDate.getDate() - 1);

   await showRepository.deleteExpiredShowtimes(currentDate)
   console.log(`showtimes of yesterday ${yesterday.toDateString()} has been deleted successfully`);
   
    }
    catch(error:any)
    {
        console.log(error,"error in deleting yesterday showtimes from database");
        
    }
})
 

cron.schedule('* * * * *', async () => {
    try {
      console.log("Running session verification...");
      await bookingService.sessionVerify()
      console.log("Expired sessions updated successfully.");
    } catch (error:any) {
      console.error("Error during session verification:", error);
    }
  });
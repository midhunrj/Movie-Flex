import cron from 'node-cron'
import { ShowRepository } from '../repositories/showRepository'

const showRepository=new ShowRepository()

cron.schedule('0 0 * * *', async ()=>{
    try{
    const currentDate=new Date()
    const yesterday = new Date(currentDate);
yesterday.setDate(currentDate.getDate() - 1);

   await showRepository.deleteExpiredShowtimes(currentDate)
   console.log(`showtimes of yesterday ${yesterday.toDateString()} has been deleted successfully`);
   
    }
    catch(error)
    {
        console.log(error,"error in deleting yesterday showtimes from database");
        
    }
})
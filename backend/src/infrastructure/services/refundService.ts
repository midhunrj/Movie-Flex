import { WalletTransaction } from "../../Domain/entities/wallet"
import { BookingModel, IBooking } from "../database/models/bookingModel"
import { NotificationType } from "../database/models/notficationModel"
import walletModel from "../database/models/walletModel"
import { NotificationRepository } from "../repositories/notficationRepository"
import { WalletRepository } from "../repositories/walletRepository"
export class RefundService{
    private walletRepo:WalletRepository
    private notificationRepo:NotificationRepository
    constructor(notificationRepo:NotificationRepository,walletRepo:WalletRepository){
        this.walletRepo=walletRepo,
        this.notificationRepo=notificationRepo
    }

async refundBookingCancellation(showtimeId:string):Promise<void>{
    
    const bookings=await BookingModel.find({showtimeId}) as IBooking[]
    for(const booking of bookings)
    {
    const {userId,totalPrice}=booking
    const user=await walletModel.find({userId:booking.userId})
    if(user)
    {
      
     
      const type='Credit'
      
      
      
      const description:string=`The movie you have booked with an id ${booking._id!} has been cancelled from the theatre side  and the amount Rs.${totalPrice} has been credited into your account`

      const transaction: WalletTransaction = {
        userId:userId.toString(),
        type,
        amount:totalPrice!,
        date: new Date(),
        description,
      };
         await this.walletRepo.updateWallet(userId.toString(),totalPrice!,transaction)
      
      //console.log(bookingData,"booking data in contorller")
      
      const notificationData = {
        recipients:[{recipientId:userId,recipientRole:"user"}],
        type: NotificationType.TICKET_CANCEL,
        title: 'Ticket Cancelled',
        message: `Your ticket with ID ${booking._id} has been cancelled successfully. Refund of Rs.${totalPrice} has been processed.`,
        data: { bookingId:booking._id!}
      };
      await this.notificationRepo.createNotification(notificationData);
    }

    await BookingModel.deleteOne({_id:booking._id})
  }
  }
}
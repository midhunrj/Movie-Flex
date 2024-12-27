import { EnrolledMovie, ScreenModel } from "../database/models/screenModel";
import { Screen } from '../../Domain/entities/screens';
import { IScreenRepository } from "../../application/repositories/iScreenRepository";
import { UserCoordinates } from "../../Domain/entities/user";
import { theatreModel } from "../database/models/theatreModel";
import showModel from "../database/models/showModel";
import { BookingModel } from "../database/models/bookingModel";
import { MovieModel } from "../database/models/movieModel";
import { NotificationType } from "../database/models/notficationModel";
import { Notification } from "../../application/usecases/notification";
//const notification=new Notification
export class ScreenRepository implements IScreenRepository{
  private notificationService:Notification
  constructor(notificationService: Notification) {
    this.notificationService = notificationService;
  }
  async create(screen: Screen): Promise<Screen> {
    console.log(screen,"screen in repository")
    
    const newScreen = new ScreenModel(screen);
    console.log(newScreen,"newScreen before save");
    
    return await newScreen.save();
  }

  async findById(screenId: string): Promise<Screen | null> {
    return await ScreenModel.findById(screenId).populate('movies.movieId').lean(); 
  }
  
  async findByTheatre(theatreId: string): Promise<Screen[]|null> {
    console.log(theatreId,"theatreId");
    
    const listdata= await ScreenModel.find({theatreId: theatreId }) 
    console.log(listdata,"screens data");
    
    return listdata
   }
  

  async update(screenId: string, screenData: Partial<Screen>): Promise<Screen | null> {
    return await ScreenModel.findByIdAndUpdate(screenId, screenData, { new: true });
  }

  async delete(screenId: string): Promise<void> {
    await ScreenModel.findByIdAndDelete(screenId);
  }

  async updateTierData(screenId: string, tierId: string, tierData:any): Promise<Screen | null> {
    return await ScreenModel.findOneAndUpdate(
        { _id: screenId, "tiers._id": tierId },  
        {
            $set: {
                "tiers.$.name": tierData.name,
                "tiers.$.ticketRate": tierData.ticketRate,
                "tiers.$.seats": tierData.seats,
                "tiers.$.rows": tierData.rows,
                "tiers.$.partition": tierData.partition,
                "tiers.$.seatLayout": tierData.seatLayout
            }
        },
        { new: true }  // Return the updated document
    );
}

async findMoviesInScreen(screenId:string,movieId:string):Promise<boolean>
{
  const movieExists=await ScreenModel.findOne({_id:screenId,"enrolledMovies.movie_id":movieId})
  return movieExists?true:false
}
async enrollMovieData(screenId:string,movie:any):Promise<Screen|null>
{
  // await ScreenModel.updateOne(
  //   { _id: screenId },
  //   { $pull: { enrolledMovies: { movieId: movie.movieId } } }
  // );
  let a=Object.keys(movie).map((elem)=>elem==" ")
  console.log(a,"keys in movie");
  
  movie.movieId=movie["id"]
  console.log(movie,"movie data in controller")
  
  const screenData = await ScreenModel.findByIdAndUpdate(
    screenId,
    { $addToSet: { enrolledMovies: movie } },
    { new: true }
  );
  return screenData
}
 async updateScreenData(screenId:string,screenData:Screen):Promise<Screen|null>
 {
   return await ScreenModel.findByIdAndUpdate(screenId,screenData,{new:true})
 }
 async RollinMoviesToShow(screenId: string, movieId: string, showtime: string): Promise<Screen | null> {
     
  return await ScreenModel.findOneAndUpdate({_id:screenId,"showtimes.time":showtime},{"showtimes.$.movieId":movieId},{new:true})
 }
 async getShowtime(showtimeId: string, screenId: string): Promise<string> {
     const screen= await ScreenModel.findById(screenId)

    let show=screen?.showtimes.find((show)=>show._id==showtimeId)
    return show?.time??''
 }

 async removeShowFromScreen(showtimeId: string, screenId: string): Promise<Screen | null> {
  const updatedScreen = await ScreenModel.findByIdAndUpdate(
    screenId,
    {
      $pull: { showtimes: { _id: showtimeId } },
    },
    { new: true }
  );

  return updatedScreen;
 }

 async fetchTheatresWithScreens(userCoords: UserCoordinates) {
  const { longitude, latitude } = userCoords;
console.log('coordinatesssss',longitude,latitude);

  if (longitude === undefined || latitude === undefined) {
    throw new Error('Longitude and Latitude must be defined');
  }

  const theatres = await theatreModel.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        maxDistance: 25000, // Maximum distance in meters
        spherical: true,
      },
    },
    {
      $lookup: {
        from: 'screens',
        localField: '_id',
        foreignField: 'theatreId',
        as: 'screens',
      },
    },
    { $unwind: '$screens' },
  ]);


  console.log(theatres,"theatre s");
  
  return theatres;
}

async updateExpiredMovieFromScreen() {
    const screens=await ScreenModel.find()

    for(const screen of screens)
    {
      const movieIds=screen.enrolledMovies.map((item)=>item.movieId.toString())
      const validShowtimes = screen.showtimes.filter(
        (showtime) =>
            movieIds.includes(showtime.movieId!) && showtime?.expiryDate! > new Date()
    );
      const movieWithShowtimes=new Set(validShowtimes.map(showtime=>showtime.movieId))

      screen.enrolledMovies=screen.enrolledMovies.filter((movie)=>movieWithShowtimes.has(movie.movieId.toString()))
      
       screen.showtimes=screen.showtimes.map((show)=>{if(show.expiryDate!< new Date())
       {
        return{
          ...show,
          movieId:null,
          expiryDate:null

        }
       }
       return show
       })
      await screen.save()
    }
}

async removeMovieFromScreen(movieId: string, screenId: string): Promise<Screen | null> {
  try{  
    
  const screenData=await ScreenModel.findByIdAndUpdate(screenId,{$pull:{'enrolledMovies':{movieId:movieId}}},{new:true})
  console.log(screenData,"after return from deleting enroll Movie");
  
  return screenData
  }
  catch(error:any)
  {
    console.error("error removing movie From screen",error)
    return null
  }

}

async updateShowFromScreen(screenId: string, prevTime: string, newTime: string): Promise<Screen | null> {
  console.log("kk");
  
    const screenData=await ScreenModel.findById(screenId)
    if(!screenData||!Array.isArray(screenData?.showtimes!))
      {
        console.log("fdsfnsdk");
        
        return null
      } 
    const Showtimes=[...screenData?.showtimes!]
     const updatedShowtimes=Showtimes.map((show)=>{
      if(show.time==prevTime)
      {
        
        show.time=newTime
      }
      return show
     })
     console.log(updatedShowtimes,"updatedShowtimes");
     screenData.showtimes=updatedShowtimes
     await screenData?.save()
   const bookingDatas=await BookingModel.find({$and:[{showDate:{$lte:new Date()}},{showtime:{$eq:prevTime}},{screenId:screenId}]})
     
   for(const booking of bookingDatas){
    
    
      booking.showtime=newTime
   
   await booking.save()
   const movieName=await MovieModel.findById(booking.movieId,{title:1,_id:0})
   
   const data = {
    bookingId: booking._id,
    movieDetails: {
      name: movieName?.title!,
      image: movieName?.poster_path!,
    },
    screenData: {
      screenName: booking.screenData?.screenName,
      screenType: booking.screenData?.screenType,
      tierName:booking.screenData?.tierName
    },
    // theatreDetails: {
    //   name: bookingData.theatreDetails?.name,
    //   address: bookingData.theatreDetails?.address,
    // },
    showDetails: {
      showtime: booking.showtime,
      showDate: booking.showDate,
    },
    selectedSeats: booking.selectedSeats,
    totalPrice: booking.totalPrice,
  };

  const notificationData = {
    recipients:[{recipientId:booking.userId,recipientRole:"user"}],
    type: NotificationType.SYSTEM_ALERT,
    title: 'Showtime has been Rescheduled',
    message: `🎬 Reminder: Your movie ${movieName?.title} starts at ${prevTime} on ${booking.showDate} has been rescheduled to ${newTime}. Be there in time! Enjoy the show! ✨"`,
    data,
  };
  console.log(notificationData,"kmklj");
  
     await this.notificationService.newNotification(notificationData)
   }
    return screenData
}

 }

//  class ManageShowtimesUseCase {
//   constructor(
//       private showRepository: ShowRepository,
//       private bookingRepository: BookingRepository,
//       private refundService: RefundService,
//       private notificationService: NotificationService
//   ) {}

//   async addShow(newShowData) {
//       const today = new Date();
//       const tomorrow = new Date(today.setDate(today.getDate() + 1));

//       if (newShowData.date < tomorrow) {
//           throw new Error("Showtime can only be scheduled from tomorrow or later.");
//       }

//       // Detect conflicts
//       const conflictingShows = await this.showRepository.findConflicts(newShowData.date);

//       if (conflictingShows.length > 0) {
//           // Refund and notify users
//           const affectedBookings = await this.bookingRepository.findByShowIds(
//               conflictingShows.map(show => show.id)
//           );

//           await Promise.all(
//               affectedBookings.map(async (booking) => {
//                   await this.refundService.processRefund(booking.id, booking.amount);
//                   await this.notificationService.send({
//                       userId: booking.userId,
//                       message: `Your booking for ${booking.showTitle} on ${booking.date} has been canceled. Refund processed.`,
//                   });
//               })
//           );

//           // Delete conflicting shows
//           await this.showRepository.deleteByIds(conflictingShows.map(show => show.id));
//       }

//       // Add new show
//       await this.showRepository.add(newShowData);
//   }
// }


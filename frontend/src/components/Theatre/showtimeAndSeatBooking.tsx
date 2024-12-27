import React, { useState, useMemo, useEffect } from 'react';
import { Clock, MapPin, CalendarDays } from 'lucide-react';
import { theatreAuthenticate } from '@/utils/axios/theatreInterceptor';
import { generateDates } from '@/utils/dateUtils';
import { toast } from 'sonner'; // Assuming you're using react-hot-toast for notifications
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Modal } from '@mui/material';
import { motion } from 'framer-motion';

interface IMovie {
    _id: string;
    title: string;
    posterUrl?: string;
    duration: number;
  }
  
  interface IShowtime {
    _id: string;
    movieId: IMovie;
    screenId: {
      _id: string;
      name: string;
    };
    showtime: string;
    date: Date;
    totalSeats: number;
    seatLayout: ITier[];
  }
  
  interface ISeatInfo {
    seatLabel?: string;
    row: number;
    col: number;
    status: string;
    isPartition?: boolean;
    isBooked?: boolean;
    isSelected?: boolean;

  }
  
  interface IRow {
    seats: ISeatInfo[];
  }
  
  interface ITier {
    tierName: string;
    ticketRate: number;
    rows: IRow[];
  }
  
const ShowtimeAndSeatBooking: React.FC<{ screenId: string }> = ({ screenId }) => {
  // State management
  const{theatre}=useSelector((state:RootState)=>state.theatre)
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [seatNames,setSeatNames]=useState<string[]>([])
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<IShowtime | null>(null);
  const [seatLayout,setSeatLayout]=useState<ITier[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const [currentBoat,setCurrentBoat]=useState<string>('movies')
  const [showconfirmModal, setShowConfirmModal] = useState<boolean>(false);
  // Date-related states
  const [dates] = useState<string[]>(generateDates()); // Assuming this generates next 7 days
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  const [dateIndex, setDateIndex] = useState(0);
  const datesToShow = dates.slice(dateIndex, dateIndex + 3);
 console.log(selectedSeats,"selected Seats");
 

 const slideUpVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };
  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  // Fetch showtimes based on screen and date
  const fetchShowtimes = async () => {
    try {
      setIsLoading(true);
      const response = await theatreAuthenticate.get('/showtimes', {
        params: { 
          screenId: screenId, 
          date: selectedDate 
        }

      });
      
      if (response.data && response.data.showtimes.length > 0) {
        setShowtimes(response.data.showtimes);
        setError(null);
      } else {
        setShowtimes([]);
        setError('No showtimes available for selected date');
      }
    } catch (err) {
      setError('Failed to fetch showtimes');
      toast.error('Unable to load showtimes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch seat layout for a specific showtime
  const fetchSeatLayout = async (showtimeId: string) => {
    try {
      setIsLoading(true);
      const response = await theatreAuthenticate.get(`/screen-layout/${showtimeId}`);
      console.log(response.data,"response data");
      
      setSeatLayout(response.data.seatData)
    } catch (err) {
      if(currentBoat=="seats")toast.error('Failed to fetch seat layout');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await theatreAuthenticate.get('/movies', {
        params: { 
          screenId: screenId, 
          date: selectedDate 
        }
      });
      setMovies(response.data);
    } catch (err) {
      toast.error('Failed to fetch movies');
      console.error(err);
    }
  };
  useEffect(()=>{
  const fetchSeatData=async()=>{
    await fetchSeatLayout(selectedShowtime?._id!)
  }
  fetchSeatData()
  },[selectedShowtime])
  // Fetch data when date or screen changes
  useEffect(() => {
    fetchShowtimes();
    //fetchMovies();
    // Reset selections when date changes
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats(0);
    setSeatNames([])
  }, [ selectedDate]);

  // Memoized unique movies
  const uniqueMovies = useMemo(() => {
    const movieMap = new Map<string, IMovie>();
    showtimes.forEach(showtime => {
      if (!movieMap.has(showtime.movieId._id)) {
        movieMap.set(showtime.movieId._id, showtime.movieId);
      }
    });
    return Array.from(movieMap.values());
  }, [showtimes]);

  // Filtered showtimes for selected movie
  const movieShowtimes = useMemo(() => {
    return showtimes.filter(
      (showtime) => !selectedMovie || showtime.movieId._id === selectedMovie._id
    );
  }, [showtimes, selectedMovie]);

  const handleSeatSelection = (
    tierIndex: number,
    rowIndex: number,
    seatIndex: number
  ) => {
    // const originalTierIndex = seatLayout.length - 1 - tierIndex;
    // const originalRowIndex = seatLayout[originalTierIndex].seatLayout.length - 1 - rowIndex;
 
    const updatedLayout = [...seatLayout];
    const seat = updatedLayout[tierIndex].rows[rowIndex].seats[seatIndex];

    if (!seat?.isBooked) {
      if(seat.isSelected)
      {
        console.log('jumbo');
        
        seat.isSelected=false
        setSeatNames((prev)=>prev.filter((name)=>name!=seat.seatLabel))
        setSelectedSeats(prev=>prev-1)
      }
      else if (selectedSeats<10) {
        console.log("sumbo");
        
        seat.isSelected=true
        setSeatNames((prev)=>[...prev,seat.seatLabel!])
        setSelectedSeats(prev=>prev+1)
      }
      else{
        console.log("vdfvdf");
        
        let clear = false;
        for (let tier of updatedLayout) {
          for (let row of tier.rows) {
            for (let s of row.seats) {
              if (s.isSelected) {
                s.isSelected = false;
                console.log("jokr");
                
                setSelectedSeats(prev=>prev-1)
                setSeatNames((prev)=>prev.filter((name)=>name!=s.seatLabel))
                clear = true;
                break;
              }
            }
            if (clear) {
              break;
            }
          }
          if (clear) {
            true;
          }
        }
        console.log("fsd");
        
        seat.isSelected=true
        setSeatNames((prev)=>[...prev,seat.seatLabel!])
        setSelectedSeats(prev=>prev+1)
      }
      
      setSeatLayout(updatedLayout);

    
    }
  };

  

  // Calculate total price
  const calculateTotalPrice = () => {
    //if (!selectedShowtime) return 0;
    return seatLayout.reduce((total, tier:ITier) => {
        const selectedSeatsInTier = tier.rows
          .flatMap((row)=>row.seats)
          .filter((seat: ISeatInfo) => seat.isSelected);
        return total + selectedSeatsInTier.length * tier.ticketRate;
      }, 0);
  };

  // Proceed to booking
  const handleProceedToBooking = async () => {
    try {
      if (!selectedShowtime || selectedSeats === 0) {
        toast.error('Please select a showtime and seats');
        return;
      }

    //   const bookingResponse = await theatreAuthenticate.post('/bookings', {
    //     showtimeId: selectedShowtime._id,
    //     seats:seatNames,
    //     // Add any additional booking details
    //   });

    const bookingResponse = await theatreAuthenticate.post('/book-tickets', {
        movieId:selectedMovie?._id,
        theatreId:theatre?._id,
        screenId:selectedShowtime.screenId,
        showtimeId:selectedShowtime._id,
        selectedSeats: seatNames,
        totalPrice: calculateTotalPrice(),
        userId: theatre?._id,
      });
  

      toast.success('Tickets booked successfully');
      // Reset selections or navigate to confirmation
      setSelectedSeats(0);
      setSelectedShowtime(null);
    } catch (err) {
      toast.error('Booking failed');
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Date Selection Tabs */}
      <div className="mt-4 w-fit ">
      <div className=" flex  justify-center items-center  mb-4 p-2 rounded-lg bg-gray-300">
      <button
          disabled={dateIndex === 0}
          onClick={() => setDateIndex(dateIndex - 1)}
        >
          {'<'}
        </button>
        {datesToShow.map(date => (
          <button
            key={date}
            onClick={() =>{ setSelectedDate(date);
                if (currentBoat === "showtimes" || currentBoat === "seats") {
                setCurrentBoat("movies");
              }}}
            className={`
              flex flex-col mx-1 min-h-12 min-w-fit p-2 rounded-lg 
              ${selectedDate === date 
                ? 'bg-amber-500 text-gray-900' 
                : 'bg-gray-700 hover:bg-gray-600'}
            `}
          >
            <CalendarDays className="mr-2 inline-block" />
            {new Date(date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </button>
        ))}
        <button
          disabled={dateIndex + 3 >= dates.length}
          onClick={() => setDateIndex(dateIndex + 1)}
        >
          {'>'}
        </button>
      </div>
</div>
      {/* Main Booking Layout */}

      <div className="grid md:grid-cols-1 grid-cols-4 sm:grid-cols-1 gap-4 p-4">
        {/* Movie Selection Column */}
        {currentBoat=='movies' &&
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Select Movie</h2>
          {isLoading ? (
            <div className="text-center">Loading movies...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {uniqueMovies.map(movie => (
                <div 
                  key={movie._id}
                  onClick={() =>{ setSelectedMovie(movie), setCurrentBoat('showtimes')}}
                  className={`
                    cursor-pointer p-2 rounded-lg transition-all duration-300 
                    ${selectedMovie?._id === movie._id 
                      ? 'bg-amber-500 text-gray-900' 
                      : 'bg-gray-800 hover:bg-gray-700'}
                  `}
                >
                  {movie.posterUrl ? (
                    <img 
                      src={`${TMDB_IMAGE_BASE_URL}/${movie.posterUrl}`} 
                      alt={movie.title} 
                      className="w-full h-72 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-700 rounded-md mb-2 flex items-center justify-center">
                      No Poster
                    </div>
                  )}
                  <h3 className="text-center font-semibold">{movie.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      }
            {currentBoat=='showtimes' &&
        <div className="space-y-4 ">
        <h2 className="text-2xl font-bold mb-4">Select Showtime</h2>
        {selectedMovie ? (
          <div className="space-y-3  flex flex-col justify-between items-center  gap-8 w-fit m-10">
            {movieShowtimes.map(showtime => (
              <div
                key={showtime._id}
                onClick={() => {
                  setSelectedShowtime(showtime);
                 // setSelectedSeats([]); 
                  setCurrentBoat('seats')
                }}
                className={`flex items-center w-full p-3 rounded-lg gap-6 cursor-pointer transition-all duration-300 ${
                  selectedShowtime?._id === showtime._id
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-white hover:bg-gray-200 text-slate-950'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5" />
                  <span>{showtime.showtime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{showtime.screenId.name}</span>
                </div>
                <span className="text-sm">
                  {showtime.totalSeats} seats available
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Please select a movie first
          </p>
        )}
      </div>
}
{currentBoat=='seats' &&
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
        {selectedShowtime ? (
          <div>
            {seatLayout.map((tier,tierIndex) => (
              <div key={tierIndex} className="mb-4">
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                  {tier.tierName} - ₹{tier.ticketRate}
                </h3>
                {tier.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1 mb-1">
                    {row.seats.map((seat,seatIndex) => (
                      <button
                        key={`${seatIndex}`}
                        onClick={() => handleSeatSelection(tierIndex, rowIndex,seatIndex)}
                        disabled={seat.isBooked || seat.isPartition}
                        className={`
                          w-8 h-8 rounded-md text-xs text-indigo-950 flex items-center justify-center
                          ${
                            seat.isPartition 
                              ? 'bg-transparent border-none' 
                              : seat.isBooked
                              ? 'bg-red-600 cursor-not-allowed' 
                              :seat.isSelected
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-200 hover:bg-gray-500 hover:text-white'
                          }
                        `}
                      >
                        {!seat.isPartition && seat.seatLabel}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {selectedSeats>0?( <motion.div
    className="mt-4 bg-gray-800 p-4 rounded-lg"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={slideUpVariants}
  >
    <div className="flex justify-between mb-2">
      <span>Selected Seats:</span>
      <span>{seatNames.join(", ")}</span>
    </div>
    <div className="flex justify-between font-bold">
      <span>Total Price:</span>
      <span>₹{calculateTotalPrice()}</span>
    </div>
    <div className="flex justify-center">
      <button
        className="w-fit mt-4 p-4 bg-amber-500 min-h-8 text-gray-900 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        onClick={() => setShowConfirmModal(true)}
      >
        Proceed to Payment
      </button>
    </div>
  </motion.div>
):<></>}
            <Modal open={showconfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="p-6 bg-white rounded shadow-md w-96 mx-auto mt-24">
          <h2 className="text-lg font-bold mb-4">Confirm Booking</h2>
          <p>Selected Seats: {selectedSeats}</p>
          <p>Total Price: ₹{calculateTotalPrice()}</p>
          <button
            onClick={handleProceedToBooking}
            className="mt-4 bg-green-600 text-white min-h-8 py-2 px-4 rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </Modal>
          </div>
          
        ) : (
          <p className="text-gray-500 text-center">
            Please select a showtime first
          </p>
        )}
      </div>
}
      </div>
    </div>
  );
};

export default ShowtimeAndSeatBooking;


//  <div
//     className={`mt-4 bg-gray-800 p-4 transition-transform duration-500 ease-in-out translate-y-10 opacity-0 rounded-lg ${
//       selectedSeats> 0 ? "translate-y-0 opacity-100" : ""
//     }`}
//   ></div>
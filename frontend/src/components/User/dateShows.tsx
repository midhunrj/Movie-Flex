import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { generateDates } from '@/utils/dateUtils';
import { Modal } from '@mui/material'; // For modal implementation
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Tier } from '@/types/theatreTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { MovieType } from '@/types/movieTypes';
import { FaAngleLeft } from 'react-icons/fa';
import Header from './header';

interface IShowtime {
    movieId:string
    _id?: string;
    theatreId: { _id: string; name: string };
    screenId: { _id: string; screenName: string; screenType: string,tiers:Tier[] };
    showtime: string;
    totalSeats: number;
    date: string;
    seatLayout:Tier[]
}
const DateShows: React.FC = () => {
  const location = useLocation();
  const [movieId, setMovieId] = useState<string | null>(() => {
    return location.state?.movieId ||  null;
  });
 console.log(movieId,"movieID",typeof(movieId));
 
  
  const [dates] = useState<string[]>(generateDates());
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [movieDetails,setMovieDetails]=useState<MovieType|null>(null)
  const [showModal, setShowModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  // State for filters
  const [priceRange, setPriceRange] = useState<number>(500);
  const [timeFilter, setTimeFilter] = useState('all');
  
  const {upcomingMovies,nowShowingMovies,userCoordinates}=useSelector((state:RootState)=>state.user)
 
  const languageMap: { [key: string]: string } = {
    hi: 'Hindi',
    ma: 'Malayalam',
    ta: 'Tamil',   
    te: 'Telugu',
  };
  const [dateIndex, setDateIndex] = useState(0);
  const datesToShow = dates.slice(dateIndex, dateIndex + 3);
 
  // Fetch showtimes when the selected date changes
  useEffect(() => {
    setLoading(true);
    
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       setUserCoords({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //     },
    //     (error) => {
    //       console.error("Error getting location:", error);
    //     }
    //   );
    // }
    if(userCoordinates?.latitude&&userCoordinates.longitude)
{
    setUserCoords({latitude:userCoordinates?.latitude,longitude:userCoordinates?.longitude})
}   
   //console.log(userCoordinates?.latitude,userCoordinates?.longitude,"usercoord and longi");
  }, []);

//   useEffect(() => {
//     if (movieId) {
//       localStorage.setItem('movieId', movieId);
//     }
//   }, [movieId]);

   
const fetchShowtimes = async () => {
  setLoading(true);
  try {
    const response = await userAuthenticate.get('/showtimes', {
      params: { movieId, date: selectedDate, latitude: userCoords?.latitude,
          longitude: userCoords?.longitude, },

    });
    console.log(response.data,"response data")
    
    setShowtimes(response.data.showtimes);
    
      setMovieId(response.data.showtimes[0].movieId);
    
    console.log(showtimes,"showtimes after setting");
    
  } catch (error) {
    console.error('Error fetching showtimes:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (selectedDate && userCoords) {
      fetchShowtimes();
    }
    console.log(userCoordinates?.latitude,userCoordinates?.longitude,"usercoord and longi");
  }, [selectedDate, priceRange, timeFilter, userCoords]);

  

  useEffect(() => {
    
    // if (movieId || (showtimes.length > 0 && showtimes[0].movieId)) {
    //     console.log(showtimes[0]?.movieId,"showtimes here");
          console.log(nowShowingMovies,"nowshowing movies");
          
      const details = nowShowingMovies.find(
        (mov: any) => mov.id === movieId
      );
      setMovieDetails(details || null);
    //}
  }, [movieId, nowShowingMovies]);
  
  if (!movieId) {
    return <p>Error: No movie selected.</p>;
  }

  // Group showtimes by theatre
  const filteredShowtimes = showtimes.filter(show => 
    show.seatLayout.some(seat => seat.ticketRate <= priceRange)
  );
  const groupedShowtimes = filteredShowtimes.reduce((acc: Record<string, any>, showtime) => {
    const { theatreId, screenId, showtime: time } = showtime;
    
    
    const key = `${theatreId._id}_${screenId._id}`;
  
    const timeHour = parseInt(time.split(':')[0]);
    if (
      (timeFilter === 'morning' && (timeHour < 6 || timeHour >= 12)) ||
      (timeFilter === 'afternoon' && (timeHour < 12 || timeHour >= 16)) ||
      (timeFilter === 'evening' && (timeHour < 16 || timeHour >= 20)) ||
      (timeFilter === 'night' && (timeHour < 20 || timeHour >= 24))
    ) {
      return acc;
    }
  
    if (!acc[key]) {
      acc[key] = {
        theatreName: theatreId.name,
        screenName: screenId.screenName,
        screenType: screenId.screenType,
        tiers: screenId.tiers,
        times: [],
      };
    }
    acc[key].times.push(time);
    return acc;
  }, {});
  const movieView = filteredShowtimes[0]?.screenId?.screenType || "2D";
  const handleScreenInfo = (screen: any) => {
    setSelectedScreen(screen);
    setShowModal(true);
  };
  const navigate=useNavigate()
  const handleShowtimeClick = (show: IShowtime,time:string) => {
    console.log(show,"show details");
    
    navigate('/seat-booking', {
      state: {
        movieId,
        movieName:movieDetails?.title,
        showtimeId:show._id,
      theatreId: show.theatreId._id,
      theatreName: show.theatreId.name,
      screenId: show.screenId,
      screenName: show.screenId.screenName,
      screenType:show.screenId.screenType,
      showtime: time,
      date: selectedDate,
      seatLayout: show.seatLayout, 
      totalSeats: show.totalSeats, 
      },
    });
  };
  return (
    <>
    <Header searchQuery="" setSearchQuery={()=>{}}/>
    <div className="p-4">
      
      {/* Date Tabs */}
      <div className="absolute top-25 left-4 z-50">
        <button className="bg-opacity-40 min-h-8 text-opacity-100 text-slate-800 w-fit hover:text-black hover:bg-transparent rounded-md" onClick={() => navigate(-1)}>
          <FaAngleLeft size={30} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4 ml-12">
        <h3 className="text-3xl font-bold text-slate-950 ">{movieDetails?.title}{' - '}{movieDetails?.language??"N/A"}</h3>
      
      </div>

      {/* Certificate and Genres */}
      <div className="flex flex-wrap items-center gap-4">
        <span className=" p-2 text-sm font-semibold text-green-500 bg-blue-100 rounded-full">
           'U/A'
        </span>
        {movieDetails?.genre?.map((genr: string) => (
          <button
            key={genr}
            className="px-3 py-1 text-sm min-h-8 font-medium text-red-700 bg-yellow-100 rounded-lg hover:bg-blue-200"
          >
            {genr}
          </button>
        ))}
      </div>
<hr className='mt-4 text-2xl'></hr>
      <div className="flex justify-between items-center mb-6 space-x-4 mt-8">
      <div className="flex items-center mb-6 space-x-4 ">
        <button
          disabled={dateIndex === 0}
          onClick={() => setDateIndex(dateIndex - 1)}
        >
          {'<'}
        </button>
        {datesToShow.map((date) => {
          const dateObj = new Date(date);
          return (
            <button
              key={date}
              className={`flex flex-col items-center w-fit min-h-12 p-2 py-3 rounded-lg min-w-[80px] ${
                date === selectedDate ? 'bg-gray-800 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="font-bold">
                {dateObj.toLocaleDateString('en-US', { weekday: 'short' , day: 'numeric', month: 'short' })}
              </span>
              {/* <span className="text-sm">
                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
              </span> */}
            </button>
          );
        })}
        <button
          disabled={dateIndex + 3 >= dates.length}
          onClick={() => setDateIndex(dateIndex + 1)}
        >
          {'>'}
        </button>
      </div>

      {/* Filters */}
      
       
      <div className="mb-6 flex space-x-4">
        <span className='px-4 py-2 text-lg font-medium text-slate-950  shadow-lg border-collapse border-gray-600 w-fit bg-white rounded-sm'>
            {movieDetails?.language??"N/A"} {movieView!='3D'?'2D':'3D'}
        </span>
      <label className="text-slate-950 font-medium mt-3">Price: ₹{priceRange}</label>

        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="morning">Morning (6 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
          <option value="evening">Evening (4 PM - 8 PM)</option>
          <option value="night">Night (8 PM - 12 AM)</option>
        </select>
      </div>
      </div>
 
      {userCoordinates?.latitude==undefined?(<p>No showtimes available for this Location. Kindly please look on another location</p>):loading ? (
  <p>Loading showtimes...</p>
) : Object.keys(groupedShowtimes).length > 0 ? (
  Object.entries(groupedShowtimes).map(([key, details]) => (
    <div key={key} className="border p-4 my-2 rounded-lg gap-4 shadow-md bg-white">
      <div className=" flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-blue-800">{details.theatreName}</h3>
          <p className="text-sm text-gray-500">{details.screenName} ({details.screenType})</p>
        </div>
        <button
          className="text-sm text-gray-600 underline"
          onClick={() => handleScreenInfo(details)}
        >
          View Details
        </button>
      </div>
      <div className="flex flex-wrap gap-5">
        {details.times.map((time: string) => (
          <button key={time} className="border border-black  transition min-h-8 text-slate-800 border-separate rounded-sm px-3 py-1 hover:bg-slate-900 hover:text-white" 
          onClick={()=>{
            const selectedShow = showtimes?.find((show) => show.showtime === time);
  if (selectedShow) {
    handleShowtimeClick(selectedShow, time);
  }
          }}>
            {time}
          </button>
        ))}
      </div>
    </div>
  ))
) : (
  <p>No showtimes available for the selected date.</p>
)}


      {selectedScreen && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold">{selectedScreen?.screenName}</h2>
          <p>Type: {selectedScreen?.screenType}</p>
          {selectedScreen?.tiers?.map((tier: any) => (
            <div key={tier.name} className="my-2">
              <h3 className="font-semibold">{tier.name}</h3>
              <p>Price: {tier.ticketRate}</p>
              <p>Seats Available: {tier.seats}</p>
            </div>
          ))}
        </div>
      </Modal>
      
      )}
    </div>
    </>
  );
};

export default DateShows;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { Modal } from '@mui/material';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { generateDates } from '@/utils/dateUtils';
import { Theatre } from '@/types/admintypes';
import { ScreenData } from '@/types/theatre';
import { ScreenDatas, TheatreState, TheatreType } from '@/types/theatreTypes';
import { MovieType } from '@/types/movieTypes';
import { FaAngleLeft } from 'react-icons/fa';
import Header from './header';

interface IShowtime {
  movieId: MovieType;
  _id?: string;
  theatreId: TheatreType;
  screenId: ScreenDatas;
  showtime: string;
  totalSeats: number;
  date: string;
  seatLayout: any[];
}

const TheatreShows: React.FC = () => {
 // Get theatreId from the URL
  const navigate = useNavigate();
  const location=useLocation()
  const [dates] = useState<string[]>(generateDates());
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  
  const [dateIndex, setDateIndex] = useState(0);
  const datesToShow = dates.slice(dateIndex, dateIndex + 3);
  const  screenId =  location.state?.screenId; 
  useEffect(() => {
    if (screenId && selectedDate)
{
    fetchTheatreShowtimes();
}
  }, [selectedDate]);


  const fetchTheatreShowtimes = async () => {
    setLoading(true);
    try {
      console.log(selectedDate,"selectedDate");
      
      const response = await userAuthenticate.get('/theatre-showtimes', {
        params: { screenId ,date: selectedDate },
      });
      setShowtimes(response.data.showtimes);
      console.log(response.data.showtimes);
      
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenInfo = (screen: any) => {
    setSelectedScreen(screen);
  };

  const handleShowtimeClick = (show: IShowtime, time: string) => {
    navigate('/seat-booking', {
      state: {
        movieId: show.movieId,
        movieName:show.movieId.title,
        theatreId: show.theatreId?._id,
        theatreName: show.theatreId.name,
        screenId: show.screenId,
        screenName: show.screenId.screenName,
        screenType: show.screenId.screenType,
        showtime: time,
        date:selectedDate,
        SeatLayout: show.seatLayout,
        totalSeats: show.totalSeats,
        showtimeId:show._id
      },
    });
  };

  
  type GroupedShowtimes = Record<
  string, // Movie ID
  {
    title: string;
    screens: Record<
      string, // Screen ID
      {
        screenName: string;
        screenType: string;
        times: string[];
      }
    >;
  }
>;
const groupedShowtimes: GroupedShowtimes = showtimes.reduce((acc, show) => {
    const movieId = show.movieId?._id;
    const screenId = show.screenId?._id;
  
    if (!movieId || !screenId) return acc;
  
    if (!acc[movieId]) {
      acc[movieId] = {
        title: show.movieId?.title || 'Unknown Movie',
        screens: {},
      };
    }
  
    if (!acc[movieId].screens[screenId]) {
      acc[movieId].screens[screenId] = {
        screenName: show.screenId?.screenName || 'Unknown Screen',
        screenType: show.screenId?.screenType || 'Unknown Type',
        times: [],
      };
    }
  
    acc[movieId].screens[screenId].times.push(show.showtime);
  
    return acc;
  }, {} as GroupedShowtimes);
  return (
    <>
      <Header searchQuery="" setSearchQuery={()=>{}}/>
      <div className="p-4">
      <div className="flex justify-between items-center mb-4">
      <div className="absolute top-25 left-2 z-50">
        <button className="bg-opacity-40 min-h-8 text-opacity-100 text-gray-600 w-fit hover:text-slate-800 hover:bg-transparent rounded-md" onClick={() => navigate(-1)}>
          <FaAngleLeft size={30} />
        </button>
      </div>
        <h3 className="text-3xl ml-8 font-bold text-slate-950">
          {showtimes[0]?.theatreId?.name || 'Theatre Shows'}
        </h3>
      </div>

      {/* Date Tabs */}
      <div className="flex justify-start items-center gap-5 mb-6">
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
                {dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
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

      {/* Showtimes */}
      {loading? 
    (<p>Loading showtimes...</p>):(Object.keys(groupedShowtimes).length > 0 ? (
        Object.entries(groupedShowtimes).map(([movieId, details]) => (
          <div key={movieId} className="border p-4 rounded-lg shadow-md bg-gray-100 mb-4">
            <h3 className="font-semibold text-lg text-blue-800 mb-2">
              {details.title}
            </h3>
            {Object.entries(details.screens).map(([screenId, screen]) => (
              <div key={screenId}>
                <h4 className="font-medium mb-2">{screen.screenName}</h4>
                <div className="flex flex-wrap gap-5">
                  {screen.times.map((time: string) => (
                    <button key={time}
                     className="border border-black  shadow-2xl min-h-8 text-green-600 border-separate  bg-white rounded-sm transition px-3 py-1 hover:bg-slate-900 hover:text-white"
                      onClick={() => handleShowtimeClick(showtimes.find(s => s.showtime === time)!, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No shows available for the selected date.</p>
      ))}
    </div>
    </>
  );
};

export default TheatreShows;
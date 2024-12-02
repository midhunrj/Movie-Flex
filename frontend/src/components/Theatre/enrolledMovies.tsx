import React, { useState } from 'react';
import ShowtimeModal from './showTimeModal';
import { useDispatch, useSelector } from 'react-redux';
import { saveMoviesToShowtime } from '../../redux/theatre/theatreThunk';
import { EnrolledMovie,  ScreenDatas, Seat, Showtime, Tier } from '@/types/theatreTypes';
import { AppDispatch, RootState } from '@/redux/store/store';
import { ScreenData } from './EditScreen';



interface EnrolledMoviesProps {
  screenData: ScreenData;
  screen?: ScreenDatas
  TMDB_IMAGE_BASE_URL: string;
  handleNewShowtime: () => void;
}

const EnrolledMovies: React.FC<EnrolledMoviesProps> = ({
  screenData,
  screen,
  TMDB_IMAGE_BASE_URL,
  handleNewShowtime
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<EnrolledMovie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  const toggleModal = () => {
    setShowModal(!showModal);
    setSelectedShowtime(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedEndDate(e.target.value);

  const handleMovietoShow = (movie: EnrolledMovie) => {
    setSelectedMovie(movie);
    setShowModal(true); // Show modal when movie is selected
  };

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
  };

  const { theatre, isSuccess, isLoading } = useSelector((state: RootState) => state.theatre);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddMovieToShowtime = async () => {
    if (selectedMovie && selectedShowtime && selectedDate && selectedEndDate) {
      const seatLayoutByTier = screenData.tiers.map((tier: Tier) => ({
        tierName: tier.name,
        ticketRate: tier.ticketRate,
        rows: tier?.seatLayout?.map((rowSeats: Seat[]) => ({
          seats: rowSeats.map((seat: Seat) => ({
            
  
            seatLabel: seat.label,
            row: seat.row,
            col: seat.col,
            status: seat.isPartition ? 'Not available' : 'available',
            userId: null,
            isPartition: seat.isPartition || false,
            isSelected: false,
            isBooked: false,
          })),
        })),
      }));
      const showtimeData = {
        theatreId: theatre?._id,
        movieId: selectedMovie.movieId,
        screenId: screen?._id,
        showtime: selectedShowtime.time,
        startDate: selectedDate,
        endDate: selectedEndDate,
        totalSeats: screen?.totalSeats,
        seatLayout: seatLayoutByTier,
      };
     console.log(showtimeData,'showData in component');
     
      dispatch(saveMoviesToShowtime(showtimeData));
      console.log('Showtime added successfully');
      toggleModal();
    }
  };

  return (
    <div className="mx-4 mt-4">
      <h2 className="text-lg text-center font-semibold mb-6">Enrolled Movies</h2>

      {screenData.enrolledMovies && screenData.enrolledMovies.length > 0 ? (
        <div className="grid grid-cols-4 gap-12">
          {screenData.enrolledMovies.map((movie) => (
            <div
              key={movie._id}
              className="text-center bg-white p-2 rounded-lg hover:scale-105 transition-all"
            >
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg'}
                alt={movie.title}
                className="w-80 h-72 object-cover rounded-lg transition-transform"
              />
              <p className="mt-2 text-lg font-semibold text-gray-600">{movie.title}</p>
              <p className="text-sm text-gray-600">
                {movie.rating > 0 ? `Rating: ${movie.rating}` : 'Popular'}
              </p>
              <button
                className="mt-2 px-4 py-2 w-fit bg-blue-500 text-white rounded-lg min-h-12 mb-4 hover:bg-blue-600"
                onClick={() => handleMovietoShow(movie)}
              >
                Add to show
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col">
          <img
            src="https://via.placeholder.com/150?text=No+Upcoming+Movies"
            alt="No Upcoming Movies"
            className="w-48 h-48 mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">No upcoming movies ready for release.</p>
        </div>
      )}

      {showModal && selectedMovie && (
        <ShowtimeModal
          showModal={showModal}
          toggleModal={toggleModal}
          selectedShowtime={selectedShowtime}
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          handleDateChange={handleDateChange}
          handleEndDateChange={handleEndDateChange}
          handleShowtimeSelect={handleShowtimeSelect}
          handleAddMovieToShowtime={handleAddMovieToShowtime}
          availableShowtimes={screenData.showtimes || []}
          handleNewShowtime={handleNewShowtime}
        />
      )}
    </div>
  );
};

export default EnrolledMovies;

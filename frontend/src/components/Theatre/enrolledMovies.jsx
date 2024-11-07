import React, { useState } from 'react';
import ShowtimeModal from './showTimeModal';
import { useDispatch, useSelector } from 'react-redux';
import { saveMoviesToShowtime } from '../../redux/theatre/theatreThunk';


const EnrolledMovies = ({ screenData,screen, TMDB_IMAGE_BASE_URL,handleNewShowtime  }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const toggleModal = () =>{ setShowModal(!showModal)
    setSelectedShowtime(null)
  };
  console.log(screenData,"screenData in enrolledMovie");
  
 
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleEndDateChange = (e) => setSelectedEndDate(e.target.value);

  const handleMovietoShow = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true); // Show modal when movie is selected
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };
 const {theatre,isSuccess,isLoading}=useSelector((state)=>state.theatre)
  const dispatch=useDispatch()
  const handleAddMovieToShowtime = async () => {
    if (selectedMovie && selectedShowtime && selectedDate && selectedEndDate) {
      const seatLayoutByTier = screenData.tierDatas.map((tier) => {
        return {
          tierName: tier.name,
          ticketRate: tier.ticketRate,
          rows: tier.seatLayout.map((rowSeats) => {
            return rowSeats.map((seat) => ({
              seatLabel: seat.label,
              row: seat.row,
              col: seat.col,
              status: seat.isPartition?'Not available':'available',
              userId: null,
            
            }));
          }),
        };
      })
   console.log(selectedMovie,"selectedmovie");
   
      
      const showtimeData = {
        theatreId:theatre._id,
        movieId: selectedMovie.movieId,
        screenId: screen._id,
        showtime: selectedShowtime.time,
        startDate: selectedDate,
        endDate: selectedEndDate,
        totalSeats: screenData.seats,
        seatLayout: seatLayoutByTier,
      };
  
  
      dispatch(saveMoviesToShowtime(showtimeData))
      console.log('Showtime added successfully');
      toggleModal();
    }
  };

  return (
    <div className="mx-4 mt-4">
      <h2 className="text-lg text-center font-semibold mb-6">Enrolled Movies</h2>
      
      {screenData.enrolledMovies.length > 0 ? (
        <div className="grid grid-cols-4 gap-12">
          {screenData.enrolledMovies.map((movie) => (
            <div key={movie._id} className="text-center bg-white p-2 rounded-lg hover:scale-105 transition-all">
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "banner img brand.jpeg"}
                alt={movie.title}
                className="w-80 h-72 object-cover rounded-lg  transition-transform"
              />
              <p className="mt-2 text-lg font-semibold text-gray-600">{movie.title}</p>
              <p className="text-sm text-gray-600">
                {movie.rating > 0 ? `Rating: ${movie.rating}` : "Popular"}
              </p>
              <button
                className="mt-2 px-4 py-2 w-fit bg-blue-500 text-white rounded-lg min-h-12  mb-4 hover:bg-blue-600"
                onClick={() => handleMovietoShow(movie)}
              >
                Add to show
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col">
          <img src="https://via.placeholder.com/150?text=No+Upcoming+Movies" alt="No Upcoming Movies" className="w-48 h-48 mb-4" />
          <p className="text-xl font-semibold text-gray-700">No upcoming movies ready for release.</p>
        </div>
      )}

      {showModal && (
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

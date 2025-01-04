import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ShowtimeModal from './showTimeModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEnrolledMovie, saveMoviesToShowtime } from '../../redux/theatre/theatreThunk';
import { FaTrash } from 'react-icons/fa';
const EnrolledMovies = ({ screenData, screen, TMDB_IMAGE_BASE_URL, handleNewShowtime }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    console.log(screenData, "screenData in enrolledMovie");
    const toggleModal = () => {
        setShowModal(!showModal);
        setSelectedShowtime(null);
    };
    const handleDateChange = (e) => setSelectedDate(e.target.value);
    const handleEndDateChange = (e) => setSelectedEndDate(e.target.value);
    const handleMovietoShow = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true); // Show modal when movie is selected
    };
    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
    };
    const { theatre, isSuccess, isLoading } = useSelector((state) => state.theatre);
    const dispatch = useDispatch();
    const handleDeleteEnrolledMovie = (movieId, screenId) => {
        dispatch(deleteEnrolledMovie({ movieId, screenId }));
    };
    const handleAddMovieToShowtime = async () => {
        if (selectedMovie && selectedShowtime && selectedDate && selectedEndDate) {
            const seatLayoutByTier = screenData.tiers.map((tier) => ({
                tierName: tier.name,
                ticketRate: tier.ticketRate,
                rows: tier?.seatLayout?.map((rowSeats) => ({
                    seats: rowSeats.map((seat) => ({
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
            console.log(showtimeData, 'showData in component');
            dispatch(saveMoviesToShowtime(showtimeData));
            console.log('Showtime added successfully');
            toggleModal();
        }
    };
    return (_jsxs("div", { className: "mx-4 mt-4", children: [_jsx("h2", { className: "text-lg text-center font-semibold mb-6", children: "Enrolled Movies" }), screenData.enrolledMovies && screenData.enrolledMovies.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12", children: screenData.enrolledMovies.map((movie) => (_jsxs("div", { className: "text-center bg-white p-2 rounded-lg hover:scale-105 transition-all", children: [_jsx("img", { src: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg', alt: movie.title, className: "w-full h-72 object-cover rounded-lg transition-transform" }), _jsx("p", { className: "mt-2 text-lg font-semibold text-gray-600", children: movie.title }), _jsx("p", { className: "text-sm text-gray-600", children: movie.rating > 0 ? `Rating: ${movie.rating}` : 'Popular' }), _jsxs("div", { className: 'ml-4 flex flex-col sm:flex-row justify-center gap-4', children: [_jsx("button", { className: "mt-2 items-center p-2  h-fit w-full sm:w-fit bg-blue-500 text-white rounded-lg min-h-8 mb-4 hover:bg-blue-600", onClick: () => handleMovietoShow(movie), children: "Add to show" }), _jsxs("button", { className: "mt-2 p-2 h-fit w-full sm:w-fit bg-red-600 text-white rounded-lg min-h-8 flex items-center gap-2 hover:bg-amber-500", onClick: () => handleDeleteEnrolledMovie(movie.movieId, screen?._id), children: [_jsx(FaTrash, { size: 20 }), "Delete"] })] })] }, movie._id))) })) : (_jsxs("div", { className: "flex justify-center items-center flex-col", children: [_jsx("img", { src: "https://via.placeholder.com/150?text=No+Upcoming+Movies", alt: "No Upcoming Movies", className: "w-48 h-48 mb-4" }), _jsx("p", { className: "text-xl font-semibold text-gray-700", children: "No upcoming movies ready for release." })] })), showModal && selectedMovie && (_jsx(ShowtimeModal, { showModal: showModal, toggleModal: toggleModal, selectedShowtime: selectedShowtime, selectedDate: selectedDate, selectedEndDate: selectedEndDate, handleDateChange: handleDateChange, handleEndDateChange: handleEndDateChange, handleShowtimeSelect: handleShowtimeSelect, handleAddMovieToShowtime: handleAddMovieToShowtime, availableShowtimes: screenData.showtimes || [], handleNewShowtime: handleNewShowtime }))] }));
};
export default EnrolledMovies;

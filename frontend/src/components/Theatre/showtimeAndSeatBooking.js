import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { Clock, MapPin, CalendarDays } from 'lucide-react';
import { theatreAuthenticate } from '@/utils/axios/theatreInterceptor';
import { generateDates } from '@/utils/dateUtils';
import { toast } from 'sonner'; // Assuming you're using react-hot-toast for notifications
import { useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import { motion } from 'framer-motion';
const ShowtimeAndSeatBooking = ({ screenId }) => {
    // State management
    const { theatre } = useSelector((state) => state.theatre);
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [seatNames, setSeatNames] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [seatLayout, setSeatLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState(0);
    const [currentBoat, setCurrentBoat] = useState('movies');
    const [showconfirmModal, setShowConfirmModal] = useState(false);
    const [seatConfirmed, setSeatConfirmed] = useState(false);
    // Date-related states
    const [dates] = useState(generateDates()); // Assuming this generates next 7 days
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [dateIndex, setDateIndex] = useState(0);
    const datesToShow = dates.slice(dateIndex, dateIndex + 3);
    console.log(selectedSeats, "selected Seats");
    const slideUpVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    };
    // Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
            }
            else {
                setShowtimes([]);
                setError('No showtimes available for selected date');
            }
        }
        catch (err) {
            setError('Failed to fetch showtimes');
            toast.error('Unable to load showtimes');
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Fetch seat layout for a specific showtime
    const fetchSeatLayout = async (showtimeId) => {
        try {
            setIsLoading(true);
            const response = await theatreAuthenticate.get(`/screen-layout/${showtimeId}`);
            console.log(response.data, "response data");
            setSeatLayout(response.data.seatData);
        }
        catch (err) {
            if (currentBoat == "seats")
                toast.error('Failed to fetch seat layout');
            console.error(err);
        }
        finally {
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
        }
        catch (err) {
            toast.error('Failed to fetch movies');
            console.error(err);
        }
    };
    useEffect(() => {
        // const fetchSeatData=async()=>{
        fetchSeatLayout(selectedShowtime?._id);
        // }
        //fetchSeatData()
        setSeatConfirmed(false);
        console.log("seatconfirmed sfkjns");
    }, [selectedShowtime, seatConfirmed]);
    // Fetch data when date or screen changes
    useEffect(() => {
        fetchShowtimes();
        //fetchMovies();
        // Reset selections when date changes
        setSelectedMovie(null);
        setSelectedShowtime(null);
        setSelectedSeats(0);
        setSeatNames([]);
    }, [selectedDate]);
    // Memoized unique movies
    const uniqueMovies = useMemo(() => {
        const movieMap = new Map();
        showtimes.forEach(showtime => {
            if (!movieMap.has(showtime.movieId._id)) {
                movieMap.set(showtime.movieId._id, showtime.movieId);
            }
        });
        return Array.from(movieMap.values());
    }, [showtimes]);
    // Filtered showtimes for selected movie
    const movieShowtimes = useMemo(() => {
        return showtimes.filter((showtime) => !selectedMovie || showtime.movieId._id === selectedMovie._id);
    }, [showtimes, selectedMovie]);
    const handleSeatSelection = (tierIndex, rowIndex, seatIndex) => {
        // const originalTierIndex = seatLayout.length - 1 - tierIndex;
        // const originalRowIndex = seatLayout[originalTierIndex].seatLayout.length - 1 - rowIndex;
        const updatedLayout = [...seatLayout];
        const seat = updatedLayout[tierIndex].rows[rowIndex].seats[seatIndex];
        if (!seat?.isBooked) {
            if (seat.isSelected) {
                console.log('jumbo');
                seat.isSelected = false;
                setSeatNames((prev) => prev.filter((name) => name != seat.seatLabel));
                setSelectedSeats(prev => prev - 1);
            }
            else if (selectedSeats < 10) {
                console.log("sumbo");
                seat.isSelected = true;
                setSeatNames((prev) => [...prev, seat.seatLabel]);
                setSelectedSeats(prev => prev + 1);
            }
            else {
                console.log("vdfvdf");
                let clear = false;
                for (let tier of updatedLayout) {
                    for (let row of tier.rows) {
                        for (let s of row.seats) {
                            if (s.isSelected) {
                                s.isSelected = false;
                                console.log("jokr");
                                setSelectedSeats(prev => prev - 1);
                                setSeatNames((prev) => prev.filter((name) => name != s.seatLabel));
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
                seat.isSelected = true;
                setSeatNames((prev) => [...prev, seat.seatLabel]);
                setSelectedSeats(prev => prev + 1);
            }
            setSeatLayout(updatedLayout);
        }
    };
    // Calculate total price
    const calculateTotalPrice = () => {
        //if (!selectedShowtime) return 0;
        return seatLayout.reduce((total, tier) => {
            const selectedSeatsInTier = tier.rows
                .flatMap((row) => row.seats)
                .filter((seat) => seat.isSelected);
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
                movieId: selectedMovie?._id,
                theatreId: theatre?._id,
                screenId: selectedShowtime.screenId,
                showtimeId: selectedShowtime._id,
                selectedSeats: seatNames,
                totalPrice: calculateTotalPrice(),
                userId: theatre?._id,
            });
            toast.success('Tickets booked successfully');
            // Reset selections or navigate to confirmation
            setSelectedSeats(0);
            setShowConfirmModal(false);
            setSeatNames([]);
            setSeatConfirmed(true);
            //setSelectedShowtime(null);
        }
        catch (err) {
            toast.error('Booking failed');
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "bg-slate-900 min-h-screen text-white", children: [_jsx("div", { className: "mt-4 w-fit ", children: _jsxs("div", { className: " flex  justify-center items-center  mb-4 p-2 rounded-lg bg-gray-200", children: [_jsx("button", { disabled: dateIndex === 0, onClick: () => setDateIndex(dateIndex - 1), className: 'text-slate-950', children: '<' }), datesToShow.map(date => (_jsxs("button", { onClick: () => {
                                setSelectedDate(date);
                                if (currentBoat === "showtimes" || currentBoat === "seats") {
                                    setCurrentBoat("movies");
                                }
                            }, className: `
              flex flex-col mx-1 min-h-12 min-w-fit p-2 rounded-lg 
              ${selectedDate === date
                                ? 'bg-amber-500 text-gray-900'
                                : 'bg-gray-700 hover:bg-gray-600'}
            `, children: [_jsx(CalendarDays, { className: "mr-2 inline-block" }), new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })] }, date))), _jsx("button", { disabled: dateIndex + 3 >= dates.length, onClick: () => setDateIndex(dateIndex + 1), className: 'text-slate-950', children: '>' })] }) }), _jsxs("div", { className: "grid md:grid-cols-1 grid-cols-4 sm:grid-cols-1 gap-4 p-4", children: [currentBoat == 'movies' &&
                        _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Select Movie" }), isLoading ? (_jsx("div", { className: "text-center", children: "Loading movies..." })) : error ? (_jsx("div", { className: "text-red-500", children: error })) : (_jsx("div", { className: "grid grid-cols-4 gap-3", children: uniqueMovies.map(movie => (_jsxs("div", { onClick: () => { setSelectedMovie(movie), setCurrentBoat('showtimes'); }, className: `
                    cursor-pointer p-2 rounded-lg transition-all duration-300 
                    ${selectedMovie?._id === movie._id
                                            ? 'bg-amber-500 text-gray-900'
                                            : 'bg-gray-800 hover:bg-gray-700'}
                  `, children: [movie.posterUrl ? (_jsx("img", { src: `${TMDB_IMAGE_BASE_URL}/${movie.posterUrl}`, alt: movie.title, className: "w-full h-72 object-cover rounded-md mb-2" })) : (_jsx("div", { className: "w-full h-48 bg-gray-700 rounded-md mb-2 flex items-center justify-center", children: "No Poster" })), _jsx("h3", { className: "text-center font-semibold", children: movie.title })] }, movie._id))) }))] }), currentBoat == 'showtimes' &&
                        _jsxs("div", { className: "space-y-4 ", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Select Showtime" }), selectedMovie ? (_jsx("div", { className: "space-y-3  flex flex-col justify-between items-center  gap-8 w-fit m-10", children: movieShowtimes.map(showtime => (_jsxs("div", { onClick: () => {
                                            setSelectedShowtime(showtime);
                                            // setSelectedSeats([]); 
                                            setCurrentBoat('seats');
                                        }, className: `flex items-center w-full p-3 rounded-lg gap-6 cursor-pointer transition-all duration-300 ${selectedShowtime?._id === showtime._id
                                            ? 'bg-amber-500 text-slate-900'
                                            : 'bg-white hover:bg-gray-200 text-slate-950'}`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Clock, { className: "w-5 h-5" }), _jsx("span", { children: showtime.showtime })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), _jsx("span", { children: showtime.screenId.name })] }), _jsxs("span", { className: "text-sm", children: [showtime.totalSeats, " seats available"] })] }, showtime._id))) })) : (_jsx("p", { className: "text-gray-500 text-center", children: "Please select a movie first" }))] }), currentBoat == 'seats' &&
                        _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Select Seats" }), selectedShowtime ? (_jsxs("div", { children: [seatLayout.map((tier, tierIndex) => (_jsxs("div", { className: "mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-yellow-500 mb-2", children: [tier.tierName, " - \u20B9", tier.ticketRate] }), tier.rows.map((row, rowIndex) => (_jsx("div", { className: "flex justify-center gap-1 mb-1", children: row.seats.map((seat, seatIndex) => (_jsx("button", { onClick: () => handleSeatSelection(tierIndex, rowIndex, seatIndex), disabled: seat.isBooked || seat.isPartition, className: `
                          w-8 h-8 rounded-md text-xs text-indigo-950 flex items-center justify-center
                          ${seat.isPartition
                                                            ? 'bg-transparent border-none'
                                                            : seat.isBooked
                                                                ? 'bg-red-600 cursor-not-allowed'
                                                                : seat.isSelected
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-yellow-200 hover:bg-gray-500 hover:text-white'}
                        `, children: !seat.isPartition && seat.seatLabel }, `${seatIndex}`))) }, rowIndex)))] }, tierIndex))), selectedSeats > 0 ? (_jsxs(motion.div, { className: "mt-4 bg-gray-800 p-4 rounded-lg", initial: "hidden", animate: "visible", exit: "hidden", variants: slideUpVariants, children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { children: "Selected Seats:" }), _jsx("span", { children: seatNames.join(", ") })] }), _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total Price:" }), _jsxs("span", { children: ["\u20B9", calculateTotalPrice()] })] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { className: "w-fit mt-4 p-4 bg-amber-500 min-h-8 text-gray-900 py-2 rounded-lg hover:bg-amber-600 transition-colors", onClick: () => setShowConfirmModal(true), children: "Proceed to Payment" }) })] })) : _jsx(_Fragment, {}), _jsx(Modal, { open: showconfirmModal, onClose: () => setShowConfirmModal(false), children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md w-96 mx-auto mt-24", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Confirm Booking" }), _jsxs("p", { children: ["Selected Seats: ", selectedSeats] }), _jsxs("p", { children: ["Total Price: \u20B9", calculateTotalPrice()] }), _jsx("button", { onClick: handleProceedToBooking, className: "mt-4 bg-green-600 text-white min-h-8 py-2 px-4 rounded hover:bg-green-700", children: "Confirm" })] }) })] })) : (_jsx("p", { className: "text-gray-500 text-center", children: "Please select a showtime first" }))] })] })] }));
};
export default ShowtimeAndSeatBooking;

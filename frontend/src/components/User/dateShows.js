import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { generateDates } from '@/utils/dateUtils';
import { Modal } from '@mui/material'; // For modal implementation
import { useSelector } from 'react-redux';
import { FaAngleLeft } from 'react-icons/fa';
const DateShows = () => {
    const location = useLocation();
    const [movieId, setMovieId] = useState(() => {
        return location.state?.movieId || null;
    });
    console.log(movieId, "movieID", typeof (movieId));
    const [dates] = useState(generateDates());
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [userCoords, setUserCoords] = useState(null);
    // State for filters
    const [priceRange, setPriceRange] = useState(500);
    const [timeFilter, setTimeFilter] = useState('all');
    const { upcomingMovies, nowShowingMovies,userCoordinates } = useSelector((state) => state.user);
    const languageMap = {
        hi: 'Hindi',
        ma: 'Malayalam',
        ta: 'Tamil',
        te: 'Telugu',
    };
    const [dateIndex, setDateIndex] = useState(0);
    const datesToShow = dates.slice(dateIndex, dateIndex + 3);
    // Fetch showtimes when the selected date changes
    // useEffect(() => {
    //     setLoading(true);
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             setUserCoords({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //             });
    //         }, (error) => {
    //             console.error("Error getting location:", error);
    //         });
    //     }
    // }, []);
    // //   useEffect(() => {
    //     if (movieId) {
    //       localStorage.setItem('movieId', movieId);
    //     }
    //   }, [movieId]);
    useEffect(() => {
        if (selectedDate && userCoords) {
            fetchShowtimes();
        }
    }, [selectedDate, priceRange, timeFilter, userCoords]);
    const fetchShowtimes = async () => {
        setLoading(true);
        try {
            const response = await userAuthenticate.get('/showtimes', {
                params: { movieId, date: selectedDate, latitude: userCoordinates?.latitude,
                    longitude: userCoordinates?.longitude, },
            });
            console.log(response.data, "response data");
            setShowtimes(response.data.showtimes);
            setMovieId(response.data.showtimes[0].movieId);
            console.log(showtimes, "showtimes after setting");
        }
        catch (error) {
            console.error('Error fetching showtimes:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // if (movieId || (showtimes.length > 0 && showtimes[0].movieId)) {
        //     console.log(showtimes[0]?.movieId,"showtimes here");
        console.log(nowShowingMovies, "nowshowing movies");
        const details = nowShowingMovies.find((mov) => mov.id === movieId);
        setMovieDetails(details || null);
        //}
    }, [movieId, nowShowingMovies]);
    if (!movieId) {
        return _jsx("p", { children: "Error: No movie selected." });
    }
    // Group showtimes by theatre
    const filteredShowtimes = showtimes.filter(show => show.seatLayout.some(seat => seat.ticketRate <= priceRange));
    const groupedShowtimes = filteredShowtimes.reduce((acc, showtime) => {
        const { theatreId, screenId, showtime: time } = showtime;
        const key = `${theatreId._id}_${screenId._id}`;
        const timeHour = parseInt(time.split(':')[0]);
        if ((timeFilter === 'morning' && (timeHour < 6 || timeHour >= 12)) ||
            (timeFilter === 'afternoon' && (timeHour < 12 || timeHour >= 16)) ||
            (timeFilter === 'evening' && (timeHour < 16 || timeHour >= 20)) ||
            (timeFilter === 'night' && (timeHour < 20 || timeHour >= 24))) {
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
    const handleScreenInfo = (screen) => {
        setSelectedScreen(screen);
        setShowModal(true);
    };
    const navigate = useNavigate();
    const handleShowtimeClick = (show, time) => {
        console.log(show, "show details");
        navigate('/seat-booking', {
            state: {
                movieId,
                movieName: movieDetails?.title,
                showtimeId: show._id,
                theatreId: show.theatreId._id,
                theatreName: show.theatreId.name,
                screenId: show.screenId,
                screenName: show.screenId.screenName,
                screenType: show.screenId.screenType,
                showtime: time,
                date: selectedDate,
                seatLayout: show.seatLayout,
                totalSeats: show.totalSeats,
            },
        });
    };
    return (_jsxs("div", { className: "p-4", children: [_jsx("div", { className: "absolute top-5 left-4 z-50", children: _jsx("button", { className: "bg-opacity-40 min-h-8 text-opacity-100 text-slate-800 w-fit hover:text-black hover:bg-transparent rounded-md", onClick: () => navigate(-1), children: _jsx(FaAngleLeft, { size: 30 }) }) }), _jsx("div", { className: "flex justify-between items-center mb-4 ml-12", children: _jsxs("h3", { className: "text-3xl font-bold text-slate-950 ", children: [movieDetails?.title, ' - ', movieDetails?.language ?? "N/A"] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx("span", { className: " p-2 text-sm font-semibold text-green-500 bg-blue-100 rounded-full", children: "'U/A'" }), movieDetails?.genre?.map((genr) => (_jsx("button", { className: "px-3 py-1 text-sm min-h-8 font-medium text-red-700 bg-yellow-100 rounded-lg hover:bg-blue-200", children: genr }, genr)))] }), _jsx("hr", { className: 'mt-4 text-2xl' }), _jsxs("div", { className: "flex justify-between items-center mb-6 space-x-4 mt-8", children: [_jsxs("div", { className: "flex items-center mb-6 space-x-4 ", children: [_jsx("button", { disabled: dateIndex === 0, onClick: () => setDateIndex(dateIndex - 1), children: '<' }), datesToShow.map((date) => {
                                const dateObj = new Date(date);
                                return (_jsx("button", { className: `flex flex-col items-center w-fit min-h-12 p-2 py-3 rounded-lg min-w-[80px] ${date === selectedDate ? 'bg-gray-800 text-white' : 'bg-gray-200'}`, onClick: () => setSelectedDate(date), children: _jsx("span", { className: "font-bold", children: dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) }) }, date));
                            }), _jsx("button", { disabled: dateIndex + 3 >= dates.length, onClick: () => setDateIndex(dateIndex + 1), children: '>' })] }), _jsxs("div", { className: "mb-6 flex space-x-4", children: [_jsxs("span", { className: 'px-4 py-2 text-lg font-medium text-slate-950  shadow-lg border-collapse border-gray-600 w-fit bg-white rounded-sm', children: [movieDetails?.language ?? "N/A", " ", movieView != '3D' ? '2D' : '3D'] }), _jsxs("label", { className: "text-slate-950 font-medium mt-3", children: ["Price: \u20B9", priceRange] }), _jsx("input", { type: "range", min: "0", max: "1000", value: priceRange, onChange: (e) => setPriceRange(Number(e.target.value)) }), _jsxs("select", { value: timeFilter, onChange: (e) => setTimeFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "morning", children: "Morning (6 AM - 12 PM)" }), _jsx("option", { value: "afternoon", children: "Afternoon (12 PM - 4 PM)" }), _jsx("option", { value: "evening", children: "Evening (4 PM - 8 PM)" }), _jsx("option", { value: "night", children: "Night (8 PM - 12 AM)" })] })] })] }), loading ? (_jsx("p", { children: "Loading showtimes..." })) : Object.keys(groupedShowtimes).length > 0 ? (Object.entries(groupedShowtimes).map(([key, details]) => (_jsxs("div", { className: "border p-4 my-2 rounded-lg gap-4 shadow-md bg-white", children: [_jsxs("div", { className: " flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg text-blue-800", children: details.theatreName }), _jsxs("p", { className: "text-sm text-gray-500", children: [details.screenName, " (", details.screenType, ")"] })] }), _jsx("button", { className: "text-sm text-gray-600 underline", onClick: () => handleScreenInfo(details), children: "View Details" })] }), _jsx("div", { className: "flex flex-wrap gap-5", children: details.times.map((time) => (_jsx("button", { className: "border border-black  transition min-h-8 text-slate-800 border-separate rounded-sm px-3 py-1 hover:bg-slate-900 hover:text-white", onClick: () => {
                                const selectedShow = showtimes?.find((show) => show.showtime === time);
                                if (selectedShow) {
                                    handleShowtimeClick(selectedShow, time);
                                }
                            }, children: time }, time))) })] }, key)))) : (_jsx("p", { children: "No showtimes available for the selected date." })), selectedScreen && (_jsx(Modal, { open: showModal, onClose: () => setShowModal(false), children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md", children: [_jsx("h2", { className: "text-xl font-bold", children: selectedScreen?.screenName }), _jsxs("p", { children: ["Type: ", selectedScreen?.screenType] }), selectedScreen?.tiers?.map((tier) => (_jsxs("div", { className: "my-2", children: [_jsx("h3", { className: "font-semibold", children: tier.name }), _jsxs("p", { children: ["Price: ", tier.ticketRate] }), _jsxs("p", { children: ["Seats Available: ", tier.seats] })] }, tier.name)))] }) }))] }));
};
export default DateShows;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { generateDates } from '@/utils/dateUtils';
import { FaAngleLeft } from 'react-icons/fa';
const TheatreShows = () => {
    // Get theatreId from the URL
    const navigate = useNavigate();
    const location = useLocation();
    const [dates] = useState(generateDates());
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [dateIndex, setDateIndex] = useState(0);
    const datesToShow = dates.slice(dateIndex, dateIndex + 3);
    const screenId = location.state?.screenId;
    useEffect(() => {
        if (screenId && selectedDate) {
            fetchTheatreShowtimes();
        }
    }, [selectedDate]);
    const fetchTheatreShowtimes = async () => {
        setLoading(true);
        try {
            const response = await userAuthenticate.get('/theatre-showtimes', {
                params: { screenId, date: selectedDate },
            });
            setShowtimes(response.data.showtimes);
            console.log(response.data.showtimes);
        }
        catch (error) {
            console.error('Error fetching showtimes:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleScreenInfo = (screen) => {
        setSelectedScreen(screen);
    };
    const handleShowtimeClick = (show, time) => {
        navigate('/seat-booking', {
            state: {
                movieId: show.movieId,
                movieName: show.movieId.title,
                theatreId: show.theatreId?._id,
                theatreName: show.theatreId.name,
                screenId: show.screenId,
                screenName: show.screenId.screenName,
                screenType: show.screenId.screenType,
                showtime: time,
                date: selectedDate,
                SeatLayout: show.seatLayout,
                totalSeats: show.totalSeats,
                showtimeId: show._id
            },
        });
    };
    const groupedShowtimes = showtimes.reduce((acc, show) => {
        const movieId = show.movieId?._id;
        const screenId = show.screenId?._id;
        if (!movieId || !screenId)
            return acc;
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
    }, {});
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("div", { className: "absolute top-5 left-4 z-50", children: _jsx("button", { className: "bg-opacity-40 min-h-8 text-opacity-100 text-gray-600 w-fit hover:text-slate-800 hover:bg-transparent rounded-md", onClick: () => navigate(-1), children: _jsx(FaAngleLeft, { size: 30 }) }) }), _jsx("h3", { className: "text-3xl ml-8 font-bold text-slate-950", children: showtimes[0]?.theatreId?.name || 'Theatre Shows' })] }), _jsxs("div", { className: "flex justify-start items-center gap-5 mb-6", children: [_jsx("button", { disabled: dateIndex === 0, onClick: () => setDateIndex(dateIndex - 1), children: '<' }), datesToShow.map((date) => {
                        const dateObj = new Date(date);
                        return (_jsx("button", { className: `flex flex-col items-center w-fit min-h-12 p-2 py-3 rounded-lg min-w-[80px] ${date === selectedDate ? 'bg-gray-800 text-white' : 'bg-gray-200'}`, onClick: () => setSelectedDate(date), children: _jsx("span", { className: "font-bold", children: dateObj.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                }) }) }, date));
                    }), _jsx("button", { disabled: dateIndex + 3 >= dates.length, onClick: () => setDateIndex(dateIndex + 1), children: '>' })] }), loading ?
                (_jsx("p", { children: "Loading showtimes..." })) : (Object.keys(groupedShowtimes).length > 0 ? (Object.entries(groupedShowtimes).map(([movieId, details]) => (_jsxs("div", { className: "border p-4 rounded-lg shadow-md bg-white mb-4", children: [_jsx("h3", { className: "font-semibold text-lg text-blue-800 mb-2", children: details.title }), Object.entries(details.screens).map(([screenId, screen]) => (_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: screen.screenName }), _jsx("div", { className: "flex flex-wrap gap-5", children: screen.times.map((time) => (_jsx("button", { className: "border border-black min-h-8 text-slate-800 border-separate rounded-sm transition px-3 py-1 hover:bg-slate-900 hover:text-white", onClick: () => handleShowtimeClick(showtimes.find(s => s.showtime === time), time), children: time }, time))) })] }, screenId)))] }, movieId)))) : (_jsx("p", { children: "No shows available for the selected date." })))] }));
};
export default TheatreShows;

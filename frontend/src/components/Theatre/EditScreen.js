import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Modal } from 'flowbite-react';
import { format } from 'date-fns';
import ScreenLayout from './screenLayout';
// import EnrollMovieModal from './enrollMovieModal';
import EnrolledMovies from './enrolledMovies';
import { removeShowtime, updateScreen } from '../../redux/theatre/theatreThunk';
import { toast } from 'sonner';
import ShowtimeAndSeatBooking from './showtimeAndSeatBooking';
import { LucideEdit2 } from 'lucide-react';
import { theatreAuthenticate } from '@/utils/axios/theatreInterceptor';
const EditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('screen-details');
    const { theatre, isSuccess, isLoading, screens } = useSelector((state) => state.theatre);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isModalOpenMo, setIsModalOpenMo] = useState(false);
    const [tiers, setTiers] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const screen = screens.find((scr) => scr._id == id);
    console.log(screens, "screen data", screen);
    const handleEnrollMovie = () => {
        navigate('/theatre/movies', { state: { enrolledMovies: screenData.enrolledMovies, screenId: screen?._id } });
    };
    const [timeValue, setTimeValue] = useState(dayjs());
    const [screenData, setScreenData] = useState({
        screenName: '',
        screenType: '',
        seats: 0,
        tiers: [],
        showtimes: [],
        speakers: [],
        enrolledMovies: []
    });
    useEffect(() => {
        if (location.state?.updatedMovies) {
            setScreenData((prev) => ({ ...prev, enrolledMovies: location.state?.updatedMovies }));
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);
    useEffect(() => {
        // if (screen) {
        setScreenData({
            screenName: screen?.screenName || '',
            screenType: screen?.screenType || '',
            seats: screen?.totalSeats || 0,
            tiers: screen?.tiers || [],
            showtimes: screen?.showtimes || [],
            speakers: screen?.speakers || [],
            enrolledMovies: screen?.enrolledMovies || []
        });
        console.log(screenData, "screenData in editScreen");
        //}
    }, [screens]);
    console.log(screenData, "screen Data in edit screen");
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const handleChange = (e) => {
        const { name, value } = e.target;
        setScreenData({ ...screenData, [name]: value });
    };
    const handleTierChange = (e) => {
        const tierCount = parseInt(e.target.value);
        const updatedTiers = Array(tierCount).fill(0).map((_, i) => ({
            name: screenData.tiers[i]?.name || '',
            seats: screenData.tiers[i]?.seats,
            ticketRate: screenData.tiers[i]?.ticketRate,
        }));
        setScreenData({ ...screenData, tiers: updatedTiers });
    };
    const handleFieldTierChange = (index, field, value) => {
        const updatedTiers = [...screenData.tiers];
        updatedTiers[index] = { ...updatedTiers[index], [field]: value };
        setScreenData({ ...screenData, tiers: updatedTiers });
    };
    // const handleShowtimeChange = (index, field, value) => {
    //   const updatedShowtimes = [...screenData.showtimes];
    //   updatedShowtimes[index] = { ...updatedShowtimes[index], [field]: value };
    //   setScreenData({ ...screenData, showtimes: updatedShowtimes });
    // };
    const handleAddSpeaker = () => {
        setScreenData({
            ...screenData,
            speakers: [...screenData.speakers, { type: '', count: 0 }],
        });
    };
    const handleAddTier = () => {
        setScreenData({
            ...screenData,
            tiers: [...screenData.tiers, { name: '',
                    seats: 0,
                    ticketRate: 0 }]
        });
    };
    const handleAddMovieToShowtime = () => {
    };
    const handleRemoveSpeaker = (index) => {
        const updatedSpeakers = screenData?.speakers?.filter((_, i) => i !== index);
        setScreenData({ ...screenData, speakers: updatedSpeakers });
    };
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedScreenData = {
            ...screen,
            screenName: screenData.screenName,
            screenType: screenData.screenType,
            totalSeats: screenData.seats,
            tiers: screenData.tiers,
            showtimes: screenData?.showtimes ?? [],
            speakers: screenData.speakers,
            enrolledMovies: screenData?.enrolledMovies ?? [],
        };
        dispatch(updateScreen(updatedScreenData));
        navigate('/theatre/screens');
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleAddShowtime = () => {
        const formattedTime = timeValue.format('HH:mm');
        const newShowtime = dayjs(timeValue);
        if (screenData.showtimes && screenData.showtimes.length >= 5) {
            toast.error('You can only add up to 5 showtimes.');
            return;
        }
        const isTooClose = screenData?.showtimes?.some(({ time }) => {
            const existingShowtime = dayjs(time, 'HH:mm');
            const minutesDifference = Math.abs(existingShowtime.diff(newShowtime, 'minute'));
            console.log(`Existing showtime: ${existingShowtime.format('HH:mm')}, New showtime: ${newShowtime.format('HH:mm')}, Difference in minutes: ${minutesDifference}`);
            return minutesDifference < 180;
        });
        if (isTooClose) {
            toast.error('Each showtime must be at least 3 hours apart.');
            return;
        }
        setScreenData({
            ...screenData,
            showtimes: [...(screenData.showtimes || []), { time: formattedTime }],
        });
        closeModal();
    };
    const handleRemoveShowtime = (showtimeId, index) => {
        if (screen?._id && screen.showtimes.length > 0) {
            dispatch(removeShowtime({ screenId: screen._id, showtimeId }));
        }
        setScreenData({
            ...screenData,
            showtimes: screenData?.showtimes?.filter((_, i) => i !== index),
        });
    };
    const handleConfigSeat = (tier) => {
        console.log(tier, "a tier data before sending");
        navigate('/theatre/tier-seats', { state: { tier } });
    };
    const handleRemoveTier = (index) => {
        const updatedTiers = screenData.tiers.filter((_, i) => i !== index);
        setTiers(updatedTiers);
        setScreenData(prev => ({
            ...prev,
            tiers: updatedTiers
        }));
    };
    const handleEditShowtime = (index) => {
        if (!screenData.showtimes || !screenData.showtimes[index]) {
            return;
        }
        setSelectedShowtimeIndex(index);
        setTimeValue(dayjs(screenData?.showtimes[index]?.time, 'HH:mm'));
        openModal();
    };
    const handleUpdateShowtime = async () => {
        if (!screenData?.showtimes || selectedShowtimeIndex === null) {
            console.error('Invalid showtime data');
            return;
        }
        const updatedTime = timeValue.format('HH:mm');
        const updatedShowtimes = [...screenData.showtimes];
        const prevTime = updatedShowtimes[selectedShowtimeIndex].time;
        updatedShowtimes[selectedShowtimeIndex] = { ...updatedShowtimes[selectedShowtimeIndex],
            time: updatedTime
        };
        setScreenData({ ...screenData, showtimes: updatedShowtimes });
        const response = await theatreAuthenticate.put('/update-showtime', { screenId: screen?._id, prevTime, newTime: updatedTime });
        //setScreenData(response.data.screenData)
        toast.success('showtime Updated in theatre');
        closeModal();
    };
    const handleSpeakerChange = (index, field, value) => {
        const updatedSpeakers = [...screenData.speakers];
        updatedSpeakers[index][field] = value;
        setScreenData((prev) => ({
            ...prev,
            speakers: updatedSpeakers,
        }));
    };
    const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('18:00');
    // const handleDateChange = (e) => setSelectedDate(e.target.value);
    // const handleEndDateChange = (e) => setSelectedEndDate(e.target.value);
    // const handleTimeChange = (e) => setSelectedTime(e.target.value);
    const openModalMovie = (index) => {
        setActiveTab('Enrolled-movies');
        setSelectedShowtimeIndex(index);
        setIsModalOpenMo(true);
    };
    const closeModalMovie = (index) => {
        setIsModalOpenMo(false);
    };
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    // const handleMovieClick = (movieId) => {
    //   console.log(`View details for movie ID: ${movieId}`);
    // };
    const renderTabComponent = () => {
        switch (activeTab) {
            case 'screen-details':
                return (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsxs("h1", { className: "p-2 justify-center text-center text-2xl", children: [" Edit Screen Management", _jsx("div", { className: " flex items-center gap-4 justify-end", children: _jsx("button", { type: "button", onClick: handleEnrollMovie, className: " text-lg -mt-8  bg-yellow-500 bg-gradient-to-l min-h-12  text-blue-950 min-w-fit mr-4  px-4 rounded  hover:bg-lime-600 hover:text-white  transition-all", children: "Enroll Movie" }) })] }) }), _jsxs(Modal, { show: isModalOpen, onClose: () => {
                                closeModal();
                                setSelectedShowtimeIndex(null);
                            }, size: "lg", "aria-hidden": "true", children: [_jsx(Modal.Header, { className: "bg-gray-100  text-center rounded-t-lg", children: selectedShowtimeIndex !== null ? ' Update Showtime' : '  Add showtime' }), _jsxs(Modal.Body, { className: "p-6 flex flex-col items-center space-y-6 scrollbar-hide", children: [_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(StaticTimePicker, { displayStaticWrapperAs: "mobile", orientation: "landscape", value: timeValue, onChange: (newValue) => {
                                                    if (newValue) {
                                                        setTimeValue(newValue);
                                                    }
                                                }, onAccept: () => {
                                                    selectedShowtimeIndex !== null ? handleUpdateShowtime() : handleAddShowtime();
                                                    setSelectedShowtimeIndex(null);
                                                    closeModal();
                                                }, onClose: closeModal }) }), timeValue && (_jsxs("div", { className: "w-full text-center text-lg font-semibold text-gray-700", children: ["Selected Time: ", timeValue.format('HH:mm')] }))] })] }), _jsxs("form", { className: "mx-4 space-y-4 mt-4", onSubmit: handleSubmit, encType: 'multipart/form-data', children: [_jsxs("div", { className: 'flex justify-between gap-12', children: [_jsxs("div", { className: 'flex-1 flex items-center gap-4', children: [_jsx("label", { htmlFor: "screenName", className: "text-md min-w-fit mb-2 font-medium", children: "Screen Name" }), _jsx("input", { type: "text", name: "screenName", value: screenData.screenName, onChange: handleChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" })] }), _jsxs("div", { className: 'flex-1 flex items-center gap-4', children: [_jsx("label", { className: 'block mb-4 text-md font-medium min-w-fit', children: "Screen Type" }), _jsxs("select", { name: "screenType", value: screenData.screenType, className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none', onChange: handleChange, children: [_jsx("option", { value: "", disabled: true, selected: true, children: "Select screen type" }), _jsx("option", { value: "Standard(2D)", children: "Standard(2D)" }), _jsx("option", { value: "IMax", children: "IMax" }), _jsx("option", { value: "4dx", children: "4DX" }), _jsx("option", { value: "3D", children: "3D" }), _jsx("option", { value: "Other", children: "Other" })] })] })] }), _jsx("h3", { className: "text-2xl text-left p-2", children: "Showtimes Configuration" }), _jsx("div", { className: "flex justify-start p-2 mx-2 gap-2", children: _jsx("button", { type: "button", onClick: openModal, className: "w-fit min-h-10 h-fit font-semibold bg-lime-700 p-2  text-base rounded-lg text-white hover:bg-lime-600 transition-all", children: "Add Showtime" }) }), screenData?.showtimes && screenData.showtimes.length > 0 && (_jsx(_Fragment, { children: _jsx("div", { className: "grid grid-cols-3 grid-rows-2 gap-4 ", children: screenData.showtimes.map((showtime, index) => (_jsxs("div", { className: "flex flex-col items-center  gap-2 mb-4 group", children: [_jsxs("div", { className: "relative flex items-center gap-2 p-4 rounded bg-black text-amber-500 cursor-pointer w-auto", children: [_jsx("label", { className: "text-md font-medium", children: "Showtime" }), _jsx("div", { children: _jsxs("span", { children: [showtime.time, " ", _jsx(LucideEdit2, { size: 15, onClick: () => handleEditShowtime(index), className: 'absolute cursor fill-slate-200 opacity-0 group-hover:opacity-100  top-0 right-1' })] }) })] }), _jsxs("div", { className: "flex", children: [_jsx("button", { type: "button", onClick: () => {
                                                                openModalMovie(index);
                                                            }, className: `hover:scale-105 transition w-fit h-fit px-4 py-2  min-h-8 mt-2 hover:text-blue-950  hover:bg-amber-500 ml-2 ${showtime.movieId ? `text-slate-900 bg-yellow-200` : `bg-[#335c67] text-white`}`, children: showtime.movieId ? 'Movie added' : 'Add Movie' }), _jsx("button", { type: "button", onClick: () => handleRemoveShowtime(showtime._id ?? '', index), className: "transition text-slate-100 mt-2 px-4 py-2  w-fit h-fit min-h-8  bg-red-600 bg-opacity-100  hover:text-white hover:bg-[#c1121f] ml-2 hover:scale-105", children: "Remove" })] })] }, index))) }) })), "``", _jsx("h3", { className: 'text-2xl text-left p-2', children: "Seats Configuration" }), _jsxs("div", { className: 'flex justify-between gap-6', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'block mb-4 text-md font-medium min-w-fit', children: "No of tiers" }), _jsx("input", { type: "number", name: "Tier", value: screenData.tiers.length, onChange: handleTierChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "e.g., 50 seats" })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: "block mb-2 text-md font-medium min-w-fit", children: "Seats Configuration" }), _jsx("input", { type: "number", name: "seats", value: screenData.seats, onChange: handleChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "e.g., 50 seats" })] }), _jsx("div", { children: _jsx("button", { type: "button", onClick: handleAddTier, className: "px-4 py-2   w-fit h-fit min-h-8 bg-lime-700 text-white relative font-semibold  after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg", children: "Add Tier" }) })] }), screenData.tiers.length > 0 ?
                                    (screenData.tiers.map((tier, index) => (_jsxs(_Fragment, { children: [_jsxs("div", { className: 'flex justify-between gap-6', children: [_jsxs("div", { className: 'flex  flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Name of Tier" }), _jsx("input", { type: "text", value: tier.name, onChange: (e) => handleFieldTierChange(index, 'name', e.target.value), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Seats" }), _jsx("input", { type: "number", value: tier.seats, onChange: (e) => handleFieldTierChange(index, 'seats', parseInt(e.target.value)), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsx("button", { type: "button", onClick: () => handleRemoveTier(index), className: "text-white mt-2 min-h-8 bg-red-500 h-fit\r\n                     hover:text-zinc-300 ml-2", children: "Clear" })] }, index), _jsxs("div", { className: 'flex  justify-between gap-6', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Ticket Rate" }), _jsx("input", { type: "text", value: tier.ticketRate, onChange: (e) => handleFieldTierChange(index, 'ticketRate', e.target.value), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsx("div", { className: ' flex flex-1 justify-center items-center gap-4', children: _jsx("button", { type: "submit", onClick: () => handleConfigSeat(tier), className: 'bg-amber-400 text-blue-950 text-base font-medium rounded-md hover:text-sm hover:bg-yellow-500 min-h-12 h-fit w-fit  p-2  transition-all', children: "Config Seat" }) })] })] })))) : (_jsx("p", { className: ' text-center text-yellow-500 text-xl font-sans', children: "No tiers configured yet." })), _jsx("h3", { className: 'text-2xl text-left p-2', children: "Speakers Configuration" }), _jsx("div", { className: ' flex justify-start  p-2 mx-2 gap-2', children: _jsx("button", { type: "button", onClick: handleAddSpeaker, className: "px-4 py-2 z-30  w-fit h-fit min-h-8 bg-lime-700 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg", children: "Add Speaker" }) }), screenData.speakers.length > 0 ? (screenData.speakers.map((speaker, index) => (_jsxs("div", { className: 'flex justify-between gap-6 mb-4', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit', children: "Speaker Type" }), _jsx("input", { type: "text", value: speaker.type, onChange: (e) => handleSpeakerChange(index, 'type', e.target.value), className: "w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "Speaker Type" })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit', children: "Count" }), _jsx("input", { type: "number", value: speaker.count, onChange: (e) => handleSpeakerChange(index, 'count', parseInt(e.target.value)), className: "w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "Number of Speakers" })] }), _jsx("button", { type: "button", onClick: () => handleRemoveSpeaker(index), className: "text-white mt-2 bg-red-600 min-h-8 h-fit hover:text-zinc-400 ml-2", children: "Clear" })] }, index)))) : (_jsx("p", { className: ' text-center  text-yellow-500 text-xl font-sans', children: "No speakers configured yet" })), _jsx("div", { className: ' flex justify-center gap-2', children: _jsx("button", { type: "submit", className: "w-fit min-h-8 text-center\r\n               p-2   mt-4 bg-amber-500 rounded-lg hover:bg-amber-600 hover:text-sm transition-all", children: "Update Screen" }) })] })] }));
            case 'Enrolled-movies': return (_jsx(EnrolledMovies, { screenData: screenData, screen: screen, TMDB_IMAGE_BASE_URL: TMDB_IMAGE_BASE_URL, handleNewShowtime: () => setActiveTab('screen-details') }));
            case 'screen-layout': return (_jsx(ScreenLayout, { screenData: screenData }));
            case 'book-tickets':
                return (_jsx(ShowtimeAndSeatBooking, { screenId: screen?._id }));
            default: return null;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(TheatreHeader, {}), _jsxs("div", { className: "bg-white min-h-screen flex flex-col", children: [_jsx("div", { className: "tabs sticky top-0 z-10 bg-slate-900 shadow-lg mt-2", children: _jsxs("div", { className: "flex justify-around p-2", children: [_jsx("button", { className: `p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-details' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`, onClick: () => setActiveTab('screen-details'), children: "Screen Details" }), _jsx("button", { className: `p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'Enrolled-movies' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`, onClick: () => setActiveTab('Enrolled-movies'), children: "Enrolled Movies" }), _jsx("button", { className: `p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-layout' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`, onClick: () => setActiveTab('screen-layout'), children: "Screen Layout" }), _jsx("button", { className: `p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out
                        ${activeTab === 'book-tickets' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`, onClick: () => setActiveTab('book-tickets'), children: "Book Tickets" })] }) }), _jsx("div", { className: "flex-1 p-2 m-4 bg-slate-900 mx-20 w-auto justify-center items-center  rounded-lg text-white", children: _jsx("div", { className: 'tab-content', children: renderTabComponent() }) }), _jsx(Footer, {})] })] }));
};
export default EditScreen;

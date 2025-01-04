import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { useLocation, useNavigate } from 'react-router';
import { Modal } from 'flowbite-react';
import 'react-clock/dist/Clock.css';
import './css/input.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { AddScreen } from '../../redux/theatre/theatreThunk';
const ScreensForm = () => {
    const [screens, setScreens] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const location = useLocation();
    const [timeValue, setTimeValue] = useState(dayjs()); // Date object for the clock // Default time for time picker
    const [tierData, setTierData] = useState({
        name: '',
        ticketRate: '',
        seats: 0,
        rows: 0,
        columns: 0,
        partition: 0
    });
    const { theatre, isSuccess, isLoading } = useSelector((state) => state.theatre);
    const [screenData, setScreenData] = useState({
        screenName: '',
        screenType: '',
        movie: "",
        showtime: "",
        seats: '',
        tiers: tiers,
        speakers: [],
        screenImage: null,
        enrolledMovies: [] // Changed to an array for multiple speaker configurations
    });
    const dispatch = useDispatch();
    // Handle form input change
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setScreenData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);
    useEffect(() => {
        if (location.state?.selectedMovie) {
            setScreenData((prev) => ({
                ...prev,
                movie: location.state.selectedMovie
            }));
        }
    }, [location.state]);
    const handleEnrollMovie = () => {
        navigate('/theatre/movies', { state: { enrolledMovies: screenData.enrolledMovies } });
    };
    const handleTierChange = (e) => {
        const tierCount = parseInt(e.target.value, 10);
        if (!isNaN(tierCount)) {
            const newTiers = Array(tierCount).fill(tierData);
            setTiers(newTiers);
            setScreenData(prev => ({
                ...prev,
                tiers: [...prev.tiers, ...newTiers] // Combine old tiers with new ones
            }));
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isModalOpenMo, setIsModalOpenMo] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false)
    const [manualTime, setManualTime] = useState(''); // State for manual time input
    // const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const validateFields = () => {
        let validationErrors = {};
        // Validate screen data fields
        if (!screenData.screenName) {
            validationErrors.screenName = 'Screen Name is  ';
        }
        // if (!screenData.movie) {
        //   validationErrors.movie = 'Movie name is  ';
        // }
        if (!screenData.seats || isNaN(Number(screenData.seats)) || Number(screenData.seats) <= 0) {
            validationErrors.seats = 'Please enter a valid number of seats';
        }
        // Validate speakers
        if (!screenData.speakers || screenData.speakers.length === 0) {
            validationErrors.speakers = 'At least one speaker is  ';
        }
        else {
            screenData.speakers.forEach((speaker, index) => {
                if (!speaker.type) {
                    validationErrors[`speakerType_${index}`] = `Speaker type is   for speaker ${index + 1}`;
                }
                if (!speaker.count || isNaN(speaker.count) || speaker.count <= 0) {
                    validationErrors[`speakerCount_${index}`] = `Please enter a valid count for speaker ${index + 1}`;
                }
                // if (!speaker.location) {
                //   validationErrors[`speakerLocation_${index}`] = `Speaker location is   for speaker ${index + 1}`;
                // }
            });
        }
        return validationErrors;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
            return;
        }
        console.log(theatre, "theatre data");
        const ScreenFormData = {
            screenName: screenData.screenName,
            Movie: screenData.movie,
            screenType: screenData.screenType,
            totalSeats: parseInt(screenData.seats),
            tiers: screenData.tiers,
            showtimes: showtimes,
            speakers: screenData.speakers,
            theatreImage: screenData.screenImage,
            theatreId: theatre?._id,
            enrolledMovies: screenData?.enrolledMovies
        };
        dispatch(AddScreen(ScreenFormData));
        setScreens([...screens, screenData]);
        navigate('/theatre/screens');
        resetForm();
    };
    const resetForm = () => {
        setScreenData({
            screenName: '',
            screenType: '',
            movie: '',
            showtime: '',
            seats: '',
            speakers: [],
            tiers: [],
            screenImage: null,
            enrolledMovies: [],
            showtimes: []
        });
    };
    const handleFieldTierChange = (index, field, value) => {
        const updatedTiers = tiers.map((tier, i) => i === index ? { ...tier, [field]: value } : tier);
        setTiers(updatedTiers);
        setScreenData((prev) => ({
            ...prev, tiers: updatedTiers
        }));
    };
    const navigate = useNavigate();
    const handleConfigSeat = (tier) => {
        console.log(tier, "a tier data before sending");
        navigate('/theatre/tier-seats', { state: { tier } });
    };
    const handleRemoveTier = (index) => {
        const updatedTiers = tiers.filter((_, i) => i !== index);
        setTiers(updatedTiers);
        setScreenData(prev => ({
            ...prev,
            tiers: updatedTiers
        }));
    };
    const handleAddSpeaker = () => {
        setScreenData((prev) => ({
            ...prev,
            speakers: [...prev.speakers, { type: '', count: 0, location: '' }]
        }));
    };
    const handleRemoveSpeaker = (index) => {
        const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
        setScreenData((prev) => ({
            ...prev,
            speakers: updatedSpeakers,
        }));
    };
    const handleSpeakerChange = (index, field, value) => {
        const updatedSpeakers = [...screenData.speakers];
        updatedSpeakers[index][field] = value;
        setScreenData((prev) => ({
            ...prev,
            speakers: updatedSpeakers,
        }));
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleAddShowtime = () => {
        const formattedTime = timeValue.format('HH:mm'); // Use desired format like 'HH:mm' or 'h:mm A'
        console.log('Selected Showtime:', formattedTime);
        setShowtimes([...showtimes, { time: formattedTime }]);
        closeModal(); // Close the modal after adding the time
    };
    // Remove a showtime from the list
    const handleRemoveShowtime = (index) => {
        setShowtimes(showtimes.filter((_, i) => i !== index)); // Remove showtime by index
    };
    //   const handleFileChange = (e) => {
    //     setScreenData({ ...screenData, screenImage: e.target.files[0] });
    //   };
    //   const handleChangeShows = (movie, index) => {
    //     setShowtimes(showtimes.map((show, i) => 
    //         i === index ? { ...show, movie: movie } : show
    //     ));
    // };
    const [enrolledMovies, setEnrolledMovies] = useState([
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
    ]); // Example enrolled movies data
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState(null);
    const openModalMovie = (index) => {
        setSelectedShowtimeIndex(index);
        setIsModalOpen(true);
    };
    const closeModalMovie = () => {
        setIsModalOpen(false);
    };
    // const handleAddMovieToShowtime = (movie, index) => {
    //   setShowtimes(showtimes.map((show, i) => 
    //     i === index ? { ...show, movie: movie.title } : show
    //   ));
    // };
    return (_jsxs(_Fragment, { children: [_jsxs(Modal, { show: isModalOpen, onClose: closeModal, size: "lg", "aria-hidden": "true", children: [_jsx(Modal.Header, { className: "bg-gray-100 text-center rounded-t-lg", children: "Select Showtime" }), _jsxs(Modal.Body, { className: "p-6 flex flex-col items-center space-y-6 scrollbar-hide", children: [_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(StaticTimePicker, { displayStaticWrapperAs: "mobile", orientation: "landscape", value: timeValue, onChange: (newValue) => {
                                        if (newValue) {
                                            setTimeValue(newValue);
                                        }
                                    }, onAccept: () => {
                                        handleAddShowtime(); // Add selected time
                                        closeModal(); // Close modal on OK
                                    }, onClose: closeModal }) }), timeValue && (_jsxs("div", { className: "w-full text-center text-lg font-semibold text-gray-700", children: ["Selected Time: ", timeValue.format('HH:mm')] }))] })] }), _jsx(TheatreHeader, {}), _jsx("div", { className: "min-h-screen flex bg-gray-200", children: _jsxs("div", { className: "flex-col p-2 m-4 bg-indigo-950 w-full mx-20 rounded-lg justify-between text-white", children: [_jsx("div", { children: _jsxs("h1", { className: "p-2 justify-center text-center text-2xl", children: ["Screen Management", _jsx("div", { className: "flex items-center gap-4 justify-end", children: _jsx("button", { type: "button", onClick: handleEnrollMovie, className: "text-lg -mt-8 bg-yellow-500 bg-gradient-to-l min-h-12 text-blue-950 min-w-fit mr-4 px-4 rounded hover:bg-lime-600 hover:text-white transition-all", children: "Enroll Movie" }) })] }) }), _jsxs("form", { className: "mx-4 space-y-4 mt-4", onSubmit: handleSubmit, encType: 'multipart/form-data', children: [_jsxs("div", { className: 'flex justify-between gap-12', children: [_jsxs("div", { className: 'flex-1 flex items-center gap-4', children: [_jsx("label", { htmlFor: "screenName", className: "text-md min-w-fit mb-2 font-medium", children: "Screen Name" }), _jsx("input", { type: "text", name: "screenName", value: screenData.screenName, onChange: handleChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" })] }), _jsxs("div", { className: 'flex-1 flex items-center gap-4', children: [_jsx("label", { className: 'block mb-4 text-md font-medium min-w-fit', children: "Screen Type" }), _jsxs("select", { name: "screenType", value: screenData.screenType, onChange: handleChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", children: [_jsx("option", { value: "", disabled: true, children: "Select screen type" }), _jsx("option", { value: "Standard(2D)", children: "Standard(2D)" }), _jsx("option", { value: "IMax", children: "IMax" }), _jsx("option", { value: "4dx", children: "4DX" }), _jsx("option", { value: "3D", children: "3D" }), _jsx("option", { value: "Other", children: "Other" })] })] })] }), _jsx("h3", { className: "text-2xl text-left p-2", children: "Showtimes Configuration" }), _jsx("div", { className: "flex justify-start p-2 mx-2 gap-2", children: _jsx("button", { type: "button", onClick: openModal, className: "w-fit min-h-10 bg-green-600 p-3  text-base rounded-lg text-white hover:bg-lime-600 transition-all", children: "Add Showtime" }) }), showtimes.length > 0 && (_jsx(_Fragment, { children: _jsxs("div", { className: "grid grid-cols-3 grid-rows-2 gap-4", children: [" ", showtimes.map((showtime, index) => (_jsxs("div", { className: "flex flex-col items-center  gap-2 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 p-3 rounded bg-black text-amber-500 w-auto", children: [_jsx("label", { className: "text-md font-medium", children: "Showtime" }), _jsx("span", { children: showtime.time })] }), _jsxs("div", { className: "flex", children: [_jsx("button", { type: "button", onClick: () => {
                                                                    // const movie = prompt("Enter the movie name:"); // Simple prompt for movie input, replace with modal for better UX
                                                                    // if (movie) handleChangeShows(movie, index);
                                                                    openModalMovie(index);
                                                                }, className: "text-white  w-fit px-4 py-1 min-h-8 mt-2 bg-blue-500 hover:text-indigo-700 ml-2", children: showtime.movieId ? 'Edit Movie' : 'Add Movie' }), _jsx("button", { type: "button", onClick: () => handleRemoveShowtime(index), className: "text-white mt-2 px-4 py-1 min-h-8 bg-red-600 hover:text-zinc-400 ml-2", children: "Remove" })] })] }, index)))] }) })), _jsx("h3", { className: 'text-2xl text-left p-2', children: "Seats Configuration" }), _jsxs("div", { className: 'flex justify-between gap-6', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'block mb-4 text-md font-medium min-w-fit', children: "No of tiers" }), _jsxs("select", { name: "Tier", onChange: handleTierChange, className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none', children: [_jsx("option", { value: "0", selected: true, children: "Select no of tiers" }), _jsx("option", { value: "1", children: "1" }), _jsx("option", { value: "2", children: "2" }), _jsx("option", { value: "3", children: "3" }), _jsx("option", { value: "4", children: "4" })] })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: "block mb-2 text-md font-medium min-w-fit", children: "Seats Configuration" }), _jsx("input", { type: "number", name: "seats", value: screenData.seats, onChange: handleChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "e.g., 50 seats" })] })] }), screenData.tiers.length > 0 ?
                                    (screenData.tiers.map((tier, index) => (_jsxs(_Fragment, { children: [_jsxs("div", { className: 'flex justify-between gap-6', children: [_jsxs("div", { className: 'flex  flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Name of Tier" }), _jsx("input", { type: "text", value: tier.name, onChange: (e) => handleFieldTierChange(index, 'name', e.target.value), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Seats" }), _jsx("input", { type: "number", value: tier.seats, onChange: (e) => handleFieldTierChange(index, 'seats', parseInt(e.target.value)), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsx("button", { type: "button", onClick: () => handleRemoveTier(index), className: "text-white mt-2 min-h-8 bg-red-500 hover:text-zinc-300 ml-2", children: "Clear" })] }, index), _jsxs("div", { className: 'flex  justify-between gap-6', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit mb-4', children: "Ticket Rate" }), _jsx("input", { type: "text", value: tier.ticketRate, onChange: (e) => handleFieldTierChange(index, 'ticketRate', e.target.value), className: 'w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' })] }), _jsx("div", { className: ' flex flex-1 justify-center items-center gap-4', children: _jsx("button", { type: "submit", onClick: () => handleConfigSeat(tier), className: 'bg-amber-400 text-blue-950 text-base font-normal rounded-md hover:text-sm hover:bg-yellow-500 min-h-12 w-fit  p-4  transition-all', children: "Config Seat" }) })] })] })))) : (_jsx("p", { className: ' text-center text-yellow-500 text-xl font-sans', children: "No tiers configured yet." })), _jsx("h3", { className: 'text-2xl text-left p-2', children: "Speakers Configuration" }), _jsx("div", { className: ' flex justify-start  p-2 mx-2 gap-2', children: _jsx("button", { type: "button", onClick: handleAddSpeaker, className: "px-4 py-2 z-30  w-fit h-fit min-h-8 bg-green-600 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg", children: "Add Speaker" }) }), screenData.speakers.length > 0 ? (screenData.speakers.map((speaker, index) => (_jsxs("div", { className: 'flex justify-between gap-6 mb-4', children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit', children: "Speaker Type" }), _jsx("input", { type: "text", value: speaker.type, onChange: (e) => handleSpeakerChange(index, 'type', e.target.value), className: "w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "Speaker Type" })] }), _jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsx("label", { className: 'text-md font-medium min-w-fit', children: "Count" }), _jsx("input", { type: "number", value: speaker.count, onChange: (e) => handleSpeakerChange(index, 'count', parseInt(e.target.value)), className: "w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none", placeholder: "Number of Speakers" })] }), _jsx("button", { type: "button", onClick: () => handleRemoveSpeaker(index), className: "text-white mt-2 bg-red-600 min-h-8 hover:text-zinc-400 ml-2", children: "Clear" })] }, index)))) : (_jsx("p", { className: ' text-center  text-yellow-500 text-xl font-sans', children: "No speakers configured yet" })), _jsx("div", { className: ' flex justify-center gap-2', children: _jsx("button", { type: "submit", className: "w-fit min-h-8 text-center\r\n               p-2 mt-4 bg-amber-500 rounded-lg hover:bg-amber-600 hover:text-sm transition-all", children: "Add Screen" }) })] })] }) }), _jsx(Footer, {})] }));
};
export default ScreensForm;
{ /* <div className="flex items-center gap-4">
             <label htmlFor="screenImage" className="text-md min-w-fit mb-2 font-medium">Upload Screen Image</label>
             <input type="file" name="screenImage" onChange={handleFileChange} className="w-fit  p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" />
           </div> */
}

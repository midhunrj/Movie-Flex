import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Spinner } from "@nextui-org/spinner";
import { logout, setUserCoordinates, setUserLocation, } from "../../redux/user/userSlice";
import Footer from "./footer";
import { BiBell, BiSearch, BiMap, BiChevronDown, } from "react-icons/bi";
import { fetchMovies, fetchTheatres } from "../../redux/user/userThunk";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BannerCarousel from "./bannerCarousel";
import { io, Socket } from "socket.io-client";
import { userUrl } from "@/utils/axios/config/urlConfig";
import { AiOutlineClose } from "react-icons/ai";
const HomePage = () => {
    const { user, role, isSuccess, isError, isLoading, nowShowingMovies = [], upcomingMovies = [], userCoordinates, theatres, userCurrentLocation, } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [citysearchQuery, setcitySearchQuery] = useState("");
    // const [upcomingMovies,setUpcomingMovies]=useState([])
    // const [nowShowingMovies,setNowShowingMovies]=useState([])
    const [browseMode, setBrowseMode] = useState("movies");
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [suggestedCities, setSuggestedCities] = useState([
        "Ernakulam",
        "Bangalore",
        "Chennai",
        "Mumbai",
        "Delhi",
        "Kolkata",
        "Hyderabad",
        "Ahmedabad",
    ]);
    const [searchCities, setSearchCities] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const handleLogout = async () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate("/");
    };
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const userId = user?._id;
    useEffect(() => {
        const socket = io(userUrl);
        socket.emit("subscribe", userId, role);
        socket.on("Notification-unread-count", (count) => {
            console.log(count, "unreadcount");
            setUnreadCount(count);
        });
        console.log(unreadCount, "aifhfhafhakfh");
        return () => {
            socket.disconnect();
        };
    }, [userId, role, Socket]);
    const handleCitySelection = async (city) => {
        if (city == currentLocation) {
            await getUserLocation();
            setLocation(currentLocation);
        }
        else {
            await fetchCityCoordinates(city);
            setSelectedLocation(city);
            setLocation(city);
            dispatch(setUserLocation(city));
        }
        setIsOpen(false);
    };
    console.log(searchCities, "searchcities");
    const fetchCityCoordinates = async (city) => {
        console.log(city, "i am clicking suggested city");
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data, "search of coordinates location");
            if (data.features && data.features.length > 0) {
                const [longitude, latitude] = data.features[0].center;
                dispatch(setUserCoordinates({ latitude, longitude }));
                dispatch(fetchTheatres({ latitude, longitude }));
                console.log(`Coordinates for ${city}:`, { latitude, longitude });
            }
            else {
                console.error(`No coordinates found for ${city}`);
            }
        }
        catch (error) {
            console.error("Error fetching city coordinates:", error);
        }
    };
    const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXNoaW5qb3kiLCJhIjoiY2x6aWE4YnNkMDY0ejJxcjBlZmpid2VoYyJ9.Etsb6UwNacChll6vPVQ_1g";
    const handleTheatreSelection = (screenId) => {
        setSelectedTheatre(screenId);
        navigate("/theatre-Shows", { state: { screenId } });
    };
    useEffect(() => {
        if (userCurrentLocation) {
            console.log(`Location updated: ${userCurrentLocation}`);
        }
    }, [userCurrentLocation]);
    const handleSearchCityChange = async (e) => {
        const query = e.target.value;
        setcitySearchQuery(query);
        if (query.length > 2) {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&types=place&limit=5`;
            try {
                const response = await fetch(url, {
                    headers: {
                        "Cache-Control": "no-store",
                        Pragma: "no-cache",
                    },
                });
                console.log(response);
                const data = await response.json();
                const cityNames = data.features.map((feature) => feature.place_name);
                setSearchCities([...cityNames]);
            }
            catch (error) {
                console.error("Error fetching city suggestions:", error);
            }
        }
    };
    const imageMap = nowShowingMovies.map((a) => {
        return `${TMDB_IMAGE_BASE_URL}/${a.backdrop_path}`;
    });
    const bannerImages = [...imageMap];
    const getUserLocation = async () => {
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                dispatch(setUserCoordinates({ latitude, longitude }));
                dispatch(fetchTheatres({ latitude, longitude }));
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place&limit=1`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.features && data.features.length > 0) {
                        const userLocation = data.features[0].place_name;
                        setCurrentLocation(userLocation);
                        dispatch(setUserLocation(userLocation));
                    }
                    else {
                        console.error("Unable to fetch user location details.");
                        setCurrentLocation("Location not found");
                    }
                }
                catch (error) {
                    console.error("Error fetching current location:", error);
                    setCurrentLocation("Unable to retrieve location");
                }
                finally {
                    setIsLoadingLocation(false);
                }
            }, (error) => {
                console.error("Geolocation error:", error);
                setCurrentLocation("Unable to retrieve location");
                setIsLoadingLocation(false);
            });
        }
        else {
            console.error("Geolocation is not supported by this browser.");
            setCurrentLocation("Geolocation not supported");
        }
    };
    const sanitizeString = (str) => {
        return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    };
    const santizedSearchQuery = sanitizeString(searchQuery);
    console.log(nowShowingMovies, "nowshowing movies in home page");
    const filteredNowShowing = nowShowingMovies.filter((movie) => {
        const sanitizedMovieTitle = sanitizeString(movie?.title ?? "");
        //movie.title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(searchQuery.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
        return sanitizedMovieTitle.includes(santizedSearchQuery);
    });
    console.log(upcomingMovies, "upcomingMovies in home");
    const filteredUpcoming = upcomingMovies.filter((movie) => {
        const sanitizedMovieTitle = sanitizeString(movie.title ?? "");
        //movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        return sanitizedMovieTitle.includes(santizedSearchQuery);
    });
    const filterMovies = (movies) => {
        return movies.filter((movie) => movie?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    };
    const locationTab = useLocation();
    const isActive = (path) => locationTab?.pathname === path;
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
        dispatch(fetchMovies());
        // getUserLocation();
    }, [user]);
    const MovieCarousel = ({ movies }) => (_jsx(motion.div, { className: "flex overflow-x-auto  scrollbar-hide space-x-4 p-4", drag: "x", dragConstraints: { right: 0, left: -300 }, children: movies.slice(0, 8).map((movie) => (_jsxs(motion.div, { className: " flex-none w-80", children: [_jsx("img", { src: movie.poster_path
                        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                        : '', alt: movie.title, className: "w-full cursor-pointer rounded-lg hover:scale-105 transition-transform" }), _jsx("p", { className: "mt-2 text-lg font-semibold", children: movie.title }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Rating: ", movie.rating || "Popular"] })] }, movie._id))) }));
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "relative bg-white rounded-lg shadow-lg w-full max-w-7xl mx-4 sm:w-4/5 md:w-2/3 lg:w-1/2 ", children: [_jsxs("div", { className: "flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg", children: [_jsx("h3", { className: "text-lg font-semibold ml-12", children: "Select Your Location" }), _jsx("button", { className: "text-white hover:text-gray-200", onClick: () => setIsOpen(false), children: _jsx(AiOutlineClose, { size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsx("input", { type: "text", placeholder: "Enter your location...", value: citysearchQuery, onChange: handleSearchCityChange, className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("div", { className: "p-3 cursor-pointer w-fit h-fit bg-yellow-100 rounded-md hover:bg-gray-100 transition ", onClick: getUserLocation, children: isLoadingLocation ? (_jsxs("span", { className: "flex gap-2 ", children: [_jsx(Spinner, { size: "sm", color: "danger", className: "text-red-500" }), "Loading location..."] })) : currentLocation ? (_jsx("span", { onClick: () => {
                                            const place = currentLocation.split(',')[0];
                                            handleCitySelection(place);
                                        }, children: currentLocation })) : (_jsx("span", { children: "Detect My Location" })) }), citysearchQuery.length > 0 && searchCities.length > 0 ? (_jsx(_Fragment, { children: _jsx("div", { className: "max-h-48 overflow-y-auto border border-gray-300 rounded-lg mt-2", children: searchCities.map((city) => (_jsx("div", { className: "p-3 cursor-pointer hover:bg-gray-100 transition", onClick: () => {
                                                const place = city.split(",")[0];
                                                handleCitySelection(place);
                                            }, children: city }, city))) }) })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl m-2 text-slate-950 font-semibold", children: "Top Cities" }), _jsx("div", { className: " min-h-fit m-2 border shadow-lg   overflow-hidden gap-4 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-lg mt-2", children: suggestedCities.map((city) => (_jsx("div", { className: "relative  m-2 p-4", children: _jsx("button", { className: " p-2 cursor-pointer w-28 h-fit bg-blue-100 hover:bg-gray-100 transition", onClick: () => handleCitySelection(city), children: city }, city) }))) })] }))] }), _jsx("div", { className: "flex justify-end p-4 border-t border-gray-200 rounded-b-lg", children: _jsx("button", { onClick: () => setIsOpen(false), className: "bg-blue-600 text-white px-4 py-2 rounded-lg min-h-8 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500", children: "Close" }) })] }) })), _jsxs("div", { className: " bg-gray-100 text-slate-950", children: [_jsxs("header", { className: "flex items-center justify-between w-full bg-blue-950 text-white  p-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "movielogo 2.jpeg", alt: "Movie Site Logo", className: "h-12 w-12 mr-4" }), _jsx("h1", { className: "text-2xl font-bold", children: "Movie Flex" })] }), _jsxs("div", { className: "flex space-x-8", children: [_jsx(Link, { to: "/", className: `hover:bg-amber-400 px-4 py-2 rounded ${isActive("/home")
                                            ? "bg-yellow-500 text-blue-950"
                                            : "hover:bg-gray-700 hover:text-white"}`, children: "Home" }), _jsx(Link, { to: "/profile", className: `hover:bg-gray-700 px-4 py-2 rounded ${isActive("/profile")
                                            ? "bg-yellow-500 text-blue-950"
                                            : "hover:bg-gray-700 hover:text-white"}`, children: "Profile" }), _jsx(Link, { to: "/orders", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Your Orders" }), _jsx(Link, { to: "/favourites", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "Favourites" }), _jsx(Link, { to: "/wallet", className: "hover:bg-gray-700 px-4 py-2 rounded", children: "wallet" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "p-2 rounded bg-gray-700 text-white pl-10" }), _jsx(BiSearch, { className: "absolute left-2 top-2 text-gray-300", size: 24 })] }), _jsxs("div", { className: "flex items-center cursor-pointer bg-white w-fit rounded p-2 text-black", children: [_jsx(BiMap, { size: 24, onClick: () => setIsOpen(true) }), _jsxs("span", { className: "ml-1 flex items-center cursor-pointer", onClick: () => setIsOpen(true), children: [location
                                                        ? location
                                                        : userCurrentLocation
                                                            ? userCurrentLocation
                                                            : "Fetching Location...", _jsx(BiChevronDown, { size: 20, className: "ml-1" })] })] }), _jsx(BiBell, { size: 24, className: "text-white cursor-pointer", onClick: () => navigate("/Notification") }), unreadCount > 0 ? (_jsx("span", { className: "absolute top-6 right-[7rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1", children: unreadCount })) : (_jsx(_Fragment, {})), _jsx("button", { className: "bg-red-600 min-h-8 text-white rounded px-4 py-1 hover:bg-red-700 transition", onClick: handleLogout, children: "Logout" })] })] }), browseMode === "movies" ? (_jsxs(_Fragment, { children: [searchQuery.length == 0 ? (_jsx(BannerCarousel, { images: bannerImages })) : (_jsx(_Fragment, {})), _jsxs("section", { className: "mb-8", children: [filteredUpcoming.length > 0 ? (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl ml-4 font-bold text-indigo-900", children: "Upcoming Movies \u00A0 >>>" }), _jsx(Link, { to: "/upcoming-movies", className: "text-indigo-900 hover:text-base hover:font-medium mr-2", children: "See All >" })] })) : (_jsx(_Fragment, {})), isLoading ? (_jsx("div", { className: "flex  justify-evenly space-x-4 mt-4", children: [...Array(4)].map((_, index) => (_jsx(Skeleton, { height: 300, width: 300 }, index))) })) : (_jsx(MovieCarousel, { movies: filterMovies(upcomingMovies) }))] }), _jsxs("section", { className: "mb-8", children: [filteredNowShowing.length > 0 ? (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl ml-4 font-bold text-indigo-900", children: "Now Showing \u00A0 >>>" }), _jsx(Link, { to: "/now-showing", className: "text-indigo-900 hover:text-base hover:font-medium mr-2", children: "See All >" })] })) : (_jsx(_Fragment, {})), isLoading ? (_jsx("div", { className: "flex  justify-evenly space-x-4 mt-4", children: [...Array(4)].map((_, index) => (_jsx(Skeleton, { height: 300, width: 300 }, index))) })) : (_jsx(MovieCarousel, { movies: filterMovies(nowShowingMovies) }))] })] })) : (browseMode == "theatres" ? (theatres.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4", children: theatres?.map((theatre, index) => (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer", onClick: () => handleTheatreSelection(theatre.screens?._id), children: [_jsx("span", { className: "w-full h-40 px-4 py-2 object-cover bg-yellow-200 text-red-500 rounded-md mb-4", children: theatre.screens.screenType }), _jsx("h3", { className: "text-lg mt-4 font-bold text-gray-700 mb-2", children: theatre.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [theatre.address.place, ", ", theatre.address.city] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Distance: ", (theatre.distance / 1000).toFixed(1), " km"] }), _jsxs("p", { className: "mt-4 text-sm text-gray-500", children: [_jsx("strong", { children: "Screen:" }), " ", theatre.screens.screenName, " -", " ", theatre.screens.screenType] }), _jsxs("p", { className: "text-sm text-gray-500", children: [_jsx("strong", { children: "Total Seats:" }), " ", theatre.screens.totalSeats] })] }, theatre?._id || index))) })) : (_jsxs("div", { className: "flex justify-center m-10 items-center flex-col", children: [_jsx("img", { src: "https://via.placeholder.com/150?text=No+Upcoming+Movies", alt: "No Upcoming Movies", className: "w-48 h-48 mb-4" }), _jsx("p", { className: "text-xl font-semibold text-gray-700", children: "No Theatres found in this location" })] }))) : null), _jsxs("div", { className: "flex justify-center space-x-4 my-4", children: [_jsx("button", { onClick: () => setBrowseMode("movies"), className: `px-4 py-2 w-fit min-h-12 mb-4 rounded ${browseMode === "movies" ? "bg-blue-600 text-white" : "bg-gray-200"}`, children: "Browse by Movies" }), _jsx("button", { onClick: () => setBrowseMode("theatres"), className: `px-4 py-2 w-fit min-h-12 mb-4rounded ${browseMode === "theatres"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"}`, children: "Browse by Theatres" })] }), _jsx(Footer, {})] })] }));
};
export default HomePage;
// unused code here jhfshfjhfkjsfhkjsfhkjsfh -------------------------------------------------------- kjhkjhkjhkjshkjshfjh///
// import React, { useState, useEffect } from "react";
// import { BiMap } from "react-icons/bi";
// import { Modal, Button } from "flowbite-react";
// import axios from "axios";
// const HomePage = () => {
//   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
//   const [locationInput, setLocationInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]); // List of location suggestions
//   const [userLocation, setUserLocation] = useState("");
//   const [movies, setMovies] = useState([]); // Movies data for "Now Showing"
//   const [geoError, setGeoError] = useState(""); // To handle geolocation errors
//   const geoApiKey = "dfd10cf75e1e42ac8410797d0be42cf2"; // Replace with your OpenCage API key
//   const tmdbApiKey = 'de211859fbf9be075be8898c50affa35'; // Replace with your TMDb API key
//   // Fetch suggestions from OpenCage API
//   const fetchLocationSuggestions = async (query) => {
//     try {
//       const response = await axios.get(
//         `https://Linkpi.opencagedata.com/geocode/v1/json?q=${query}&key=${geoApiKey}`
//       );
//       const data = response.data.results.map((item) => item.formatted);
//       setSuggestions(data);
//     } catch (error) {
//       console.error("Error fetching location suggestions:", error);
//     }
//   };
//   const handleLocationInputChange = (e) => {
//     setLocationInput(e.target.value);
//     if (e.target.value.length > 2) {
//       fetchLocationSuggestions(e.target.value); // Fetch suggestions after 2 characters
//     }
//   };
//   const handleLocationSelect = (location) => {
//     setUserLocation(location); // Set the selected location
//     setIsLocationModalOpen(false); // Close the modal
//     setSuggestions([]); // Clear suggestions
//     // Fetch movies for the selected location
//     fetchMoviesForLocation(location);
//   };
//   // Handle user's current location via Geolocation API
//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           // Fetch location name from latitude/longitude using OpenCage API
//           fetchLocationFromCoords(latitude, longitude);
//         },
//         (error) => {
//           setGeoError("Unable to fetch your location. Please try again.");
//         }
//       );
//     } else {
//       setGeoError("Geolocation is not supported by your browser.");
//     }
//   };
//   // Fetch location name from coordinates
//   const fetchLocationFromCoords = async (lat, lon) => {
//     try {
//       const response = await axios.get(
//         `https://Linkpi.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoApiKey}`
//       );
//       const locationName = response.data.results[0].formatted;
//       setUserLocation(locationName); // Set user's current location
//       setIsLocationModalOpen(false); // Close modal after setting location
//       // Fetch movies for the selected location (based on lat/lon)
//       fetchMoviesForLocation(locationName);
//     } catch (error) {
//       console.error("Error fetching location from coordinates:", error);
//     }
//   };
//   // Fetch movies based on selected location using TMDb API
//   const fetchMoviesForLocation = async (location) => {
//     try {
//       const response = await axios.get(
//         `https://Linkpi.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&language=en-US&page=1&region=IN` // Adjust region as necessary
//       );
//       setMovies(response.data.results); // Set movie data
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//     }
//   };
//   return (
//     <>
//       <header className="flex items-center justify-between w-full text-white bg-blue-950 p-4">
//         {/* Location Icon and Location Display */}
//         <div className="flex items-center">
//           <BiMap
//             size={24}
//             className="text-white cursor-pointer"
//             onClick={() => setIsLocationModalOpen(true)}
//           />
//           <span className="ml-1">
//             {userLocation ? userLocation : "Select Location"}
//           </span>
//         </div>
//       </header>
//       {/* Modal for Location Selection */}
//       <Modal show={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)}>
//         <Modal.Header>Select Your Location</Modal.Header>
//         <Modal.Body>
//           <div className="mb-4">
//             <input
//               type="text"
//               className="p-2 w-full rounded border border-gray-300"
//               placeholder="Enter location"
//               value={locationInput}
//               onChange={handleLocationInputChange}
//             />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
//             <ul>
//               {suggestions.length > 0 ? (
//                 suggestions.map((location, index) => (
//                   <li
//                     key={index}
//                     className="cursor-pointer hover:bg-gray-200 p-2 rounded"
//                     onClick={() => handleLocationSelect(location)}
//                   >
//                     {location}
//                   </li>
//                 ))
//               ) : (
//                 <p>No suggestions available</p>
//               )}
//             </ul>
//           </div>
//           {/* Use Current Location */}
//           <div className="mt-4">
//             <Button color="blue" onClick={handleUseCurrentLocation}>
//               Use Current Location
//             </Button>
//             {geoError && <p className="text-red-500 mt-2">{geoError}</p>}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => handleLocationSelect(locationInput)}>Select</Button>
//           <Button color="gray" onClick={() => setIsLocationModalOpen(false)}>Cancel</Button>
//         </Modal.Footer>
//       </Modal>
//       {/* Now Showing Movies Section */}
//       <section className="p-4">
//         <h2 className="text-2xl font-bold mb-4">Now Showing</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {movies.length > 0 ? (
//             movies.map((movie) => (
//               <div key={movie.id} className="border rounded p-2">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                   alt={movie.title}
//                   className="w-full h-auto rounded"
//                 />
//                 <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
//                 <p className="text-sm">{movie.release_date}</p>
//               </div>
//             ))
//           ) : (
//             <p>No movies available.</p>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };
// export default HomePage;
{
    /* <header className="bg-blue-950 text-white py-4">
    <div className="container mx-auto grid grid-cols-12 ">
      <div className="col-span-8">
        <h1 className="text-xl">Movie Ticket Booking</h1>
      </div>
      <div className="col-span-4 flex justify-end space-x-4">
        <Link to="/" className="hover:bg-amber-400 py-2 px-4 rounded">Home</Link>
        <Link to="#" className="hover:bg-gray-700 py-2 px-4 rounded">Profile</Link>
        <Link to="#" className="hover:bg-gray-700 py-2 px-4 rounded">Your Orders</Link>
        <Link to="#" className="hover:bg-gray-700 py-2 px-4 rounded">Favourites</Link>
        <Link to="#" className="hover:bg-gray-700 py-2 px-4 rounded">Shows</Link>
      </div>
    </div>
  </header>
           */
}

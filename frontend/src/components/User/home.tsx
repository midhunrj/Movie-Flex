
import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { logout, setUserCoordinates, setUserLocation } from "../../redux/user/userSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Button, Modal } from "flowbite-react";
import { toast } from "react-toastify";
import Footer from "./footer";
import { BiBell, BiSearch, BiMap, BiArrowFromTop, BiArrowBack, BiAlignRight, BiArrowToBottom, BiChevronDown } from "react-icons/bi";
import { fetchMovies, fetchTheatres } from "../../redux/user/userThunk";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import BannerCarousel from "./bannerCarousel";
import { AppDispatch, RootState } from "@/redux/store/store";
import { MovieType } from "@/types/movieTypes";
import { useLocalizationContext } from "@mui/x-date-pickers/internals";
import { io } from "socket.io-client";
import { userUrl } from "@/utils/axios/config/urlConfig";
// import { Theatre } from "@/types/admintypes";
//import {refreshPage} from '../../redux/user/userThunk'
// import {toas}
interface Address {
  place: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
}

interface Screen {
  screenName: string;
  screenType: string;
  totalSeats: number;
}

export interface TheatreLocate {
  _id: string;
  name: string;
  address: Address;
  distance: number;
  screens: Screen;
}

interface Props {
  theatres: TheatreLocate[];
  handleTheatreSelection: (theatre: TheatreLocate) => void;
  browseMode: string;
  setBrowseMode: (mode: string) => void;
}

const HomePage = () => {
  const { user,role,isSuccess,isError,isLoading,nowShowingMovies=[],upcomingMovies=[],userCoordinates,theatres,userCurrentLocation } = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<string|null>(null);
  const [searchQuery,setSearchQuery]=useState<string>("")
  const [citysearchQuery,setcitySearchQuery]=useState<string>("")
  // const [upcomingMovies,setUpcomingMovies]=useState([])
  // const [nowShowingMovies,setNowShowingMovies]=useState([])
  const [browseMode, setBrowseMode] = useState<"movies" | "theatres">("movies");
  const [selectedTheatre, setSelectedTheatre] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [suggestedCities, setSuggestedCities] = useState<string[]>(["Kochi","Bangalore","Chennai","Mumbai","Delhi"]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const handleLogout = async () => {
    dispatch(logout());
    console.log("ok bye bye i am going see you soon");
    navigate("/");
  };
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
const [currentLocation, setCurrentLocation] = useState<string|null>(null);

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
  
const userId = user?._id;

useEffect(() => {
  const socket = io(userUrl); 

  
  socket.emit("subscribe", userId, role);

  
  socket.on("Notification-unread-count", (count: number) => {
    console.log(count,"unreadcount");
    
    setUnreadCount(count);
  });
  console.log(unreadCount,"aifhfhafhakfh");
  
  return () => {
    socket.disconnect();
  };
}, [userId,role]);
const handleCitySelection = async(city:string) => {
  if(city==currentLocation)
  {
    await getUserLocation()

    setLocation(currentLocation)
  }
  else{
   await  fetchCityCoordinates(city)
  setSelectedLocation(city);
  setLocation(city);
  dispatch(setUserLocation(city))
  }
  setIsOpen(false);
};

const fetchCityCoordinates = async (city: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      
      dispatch(setUserCoordinates({ latitude, longitude }));
      console.log(`Coordinates for ${city}:`, { latitude, longitude });
    } else {
      console.error(`No coordinates found for ${city}`);
    }
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
  }
};


// const handleSearchCityChange = async (e) => {
//   const query = e.target.value;
//   setcitySearchQuery(query);

//   if (query.length > 2) {
//     try {
//       const response = await fetch(`https://Linkpi.teleport.org/Linkpi/cities/?search=${query}`);
//       const data = await response.json();
//       const cities = data._embedded['city:search-results'].map(result => result._embedded['city:item'].name);
//       setSuggestedCities(cities);
//     } catch (error) {
//       console.error("Error fetching city suggestions:", error);
//     }
//   } else {
//     setSuggestedCities([]);
//   }
// };
const MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoiYXNoaW5qb3kiLCJhIjoiY2x6aWE4YnNkMDY0ejJxcjBlZmpid2VoYyJ9.Etsb6UwNacChll6vPVQ_1g"

const handleTheatreSelection = (theatreId: string) => {
  setSelectedTheatre(theatreId);
  navigate('/theatre-Shows', { state: { theatreId } });
};

useEffect(() => {
  if (userCurrentLocation) {
    console.log(`Location updated: ${userCurrentLocation}`);
  }
}, [userCurrentLocation]);

const handleSearchCityChange = async (e:ChangeEvent<HTMLInputElement>) => {
  const query = e.target.value;
  setcitySearchQuery(query);

  if (query.length > 2) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&types=place&limit=5`;
    try {
      const response = await fetch(url)
      console.log(response);
      
      const data = await response.json()
      const cityNames = data.features.map((feature:any) => feature.place_name);
      setSuggestedCities(["Current Location", ...cityNames]);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  } else {
    setSuggestedCities(["Current Location"]);
  }
};

// const getUserLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const geoApiKey = "dfd10cf75e1e42ac8410797d0be42cf2";
//         const response = await fetch(
//           `https://Linkpi.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`
//         );
//         const data = await response.json();

//         let userLocation;
//         const components = data.results[0].components;
//         // More precise location check
//         if (components.suburb) {
//           userLocation = components.suburb;
//         } else if (components.town) {
//           userLocation = components.town;
//         } else if (components.village) {
//           userLocation = components.village;
//         } else if (components.city) {
//           userLocation = components.city;
//         } else {
//           userLocation = "Location not available";
//         }

//         setLocation(userLocation);
//       },
//       (error) => {
//         console.error(error);
//         setLocation("Unable to retrieve location");
//       }
//     );
//   } else {
//     setLocation("Geolocation not supported");
//   }
// };
// const bannerImages = [
//   "banner ide.jpeg",
//   "banner ide 2.jpeg",
//   "banner img 2.jpeg",
//   "banner img.jpeg",
// ];
const imageMap=nowShowingMovies.map((a)=>{return `${TMDB_IMAGE_BASE_URL}/${a.backdrop_path}`})
const bannerImages=[...imageMap]
const getUserLocation = async () => {
  if (navigator.geolocation) {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
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
          } else {
            console.error("Unable to fetch user location details.");
            setCurrentLocation("Location not found");
          }
        } catch (error) {
          console.error("Error fetching current location:", error);
          setCurrentLocation("Unable to retrieve location");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setCurrentLocation("Unable to retrieve location");
        setIsLoadingLocation(false);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    setCurrentLocation("Geolocation not supported");
  }
};


  const sanitizeString = (str:string) => {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };
  const santizedSearchQuery=sanitizeString(searchQuery)
  console.log(nowShowingMovies,"nowshowing movies in home page");
  
  const filteredNowShowing = nowShowingMovies.filter((movie:MovieType) =>{
    const sanitizedMovieTitle=sanitizeString(movie?.title??'')
    //movie.title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(searchQuery.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    return sanitizedMovieTitle.includes(santizedSearchQuery)
  }
  );
    console.log(upcomingMovies,"upcomingMovies in home");
    
  const filteredUpcoming = upcomingMovies.filter((movie:MovieType) =>
  {
    const sanitizedMovieTitle=sanitizeString(movie.title??'')
    //movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    return sanitizedMovieTitle.includes(santizedSearchQuery)
  }
  );
  const filterMovies = (movies:MovieType[]):MovieType[] => {
    return movies.filter(movie => movie?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  };
const locationTab=useLocation()
  const isActive = (path: string) => locationTab?.pathname === path;
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(fetchMovies())
   // getUserLocation();
  }, [user]);

  const MovieCarousel:React.FC<{ movies:MovieType[] }>=({movies}) => (
    <motion.div className="flex overflow-x-auto  scrollbar-hide space-x-4 p-4" drag="x" dragConstraints={{ right: 0, left: -300 }}>
      {movies.slice(0, 8).map((movie) => (
        <motion.div key={movie._id} className="flex-none w-80">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "/path/to/fallback-image.jpg"}
            alt={movie.title}
            className="w-full cursor-pointer rounded-lg hover:scale-105 transition-transform"
          />
          <p className="mt-2 text-lg font-semibold">{movie.title}</p>
          <p className="text-sm text-gray-600">Rating: {movie.rating || "Popular"}</p>
        </motion.div>
      ))}
    </motion.div>
  )
  return (
    <>
   {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Select Your Location</h3>
              <button
                className="text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
  <input
    type="text"
    placeholder="Enter your location..."
    value={citysearchQuery}
    onChange={handleSearchCityChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {suggestedCities.length > 0 && (
    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg mt-2">
      <div
        className="p-3 cursor-pointer hover:bg-gray-100 transition flex items-center"
        onClick={getUserLocation}
      >
        {isLoadingLocation ? (
          <span>Loading location...</span>
        ) : currentLocation ? (
          <span onClick={()=>handleCitySelection(currentLocation)}>{currentLocation}</span>
        ) : (
          <span>Detect My Location</span>
        )}
      </div>
      {suggestedCities.map((city) => (
        <div
          key={city}
          className="p-3 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => handleCitySelection(city)}
        >
          {city}
        </div>
      ))}
    </div>
  )}
</div>

            <div className="flex justify-end p-4 border-t border-gray-200 rounded-b-lg">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg min-h-8 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  

      <div className=" bg-gray-100">
        <header className="flex items-center justify-between w-full text-white bg-[#091057] p-4">
          <div className="flex items-center">
            <img
              src="movielogo 2.jpeg"
              alt="Movie Site Logo"
              className="h-12 w-12 mr-4"
            />
            <h1 className="text-2xl font-bold">Movie Flex</h1>
          </div>

          {/* Center: Navbar Links */}
          <div className="flex space-x-8">
            <Link to="/" className={`hover:bg-amber-400 px-4 py-2 rounded ${
                isActive('/home') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
              }`}>Home</Link>
            <Link to="/profile" className={`hover:bg-gray-700 px-4 py-2 rounded ${
                isActive('/profile') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
              }`}>Profile</Link>
            <Link to="/orders" className="hover:bg-gray-700 px-4 py-2 rounded">Your Orders</Link>
            <Link to="/favourites" className="hover:bg-gray-700 px-4 py-2 rounded">Favourites</Link>
            <Link to="/wallet" className="hover:bg-gray-700 px-4 py-2 rounded">wallet</Link>
          </div>

          <div className="flex items-center space-x-4">
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 rounded bg-gray-700 text-white pl-10"
              />
              <BiSearch className="absolute left-2 top-2 text-gray-300" size={24} />
            </div>

            
            <div className="flex items-center bg-white w-fit rounded p-2 text-black">
  <BiMap size={24} onClick={() => setIsOpen(true)} />
  <span className="ml-1 flex items-center cursor-pointer" onClick={() => setIsOpen(true)}>
    {location ? location :userCurrentLocation?userCurrentLocation: "Fetching Location..."}
    <BiChevronDown size={20} className="ml-1" />
  </span>
</div>

            
            <BiBell size={24} className="text-white cursor-pointer"  onClick={()=>navigate('/Notification')} />
           {unreadCount>0? 
            <span className="absolute top-6 right-[7rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
           {unreadCount} 
        </span>
         :<></> } 
           
            <button
              className="bg-red-600 min-h-8 text-white rounded px-4 py-2 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

       
       { browseMode === "movies"? ( <><BannerCarousel images={bannerImages} />

       {/* Upcoming Movies */}
       {/* Upcoming Movies */}
       <section className="mb-8">
       <div className="flex justify-between items-center">
      <h2 className="text-2xl ml-4 font-bold text-indigo-900">
        Upcoming Movies &nbsp; &gt;&gt;&gt;
      </h2>
      <Link to="/upcoming-movies" className="text-blue-800 hover:text-base hover:font-medium mr-2">
        See All &gt;
      </Link>
      </div>
        {isLoading ? (
          <div className="flex  justify-evenly space-x-4 mt-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height={300} width={300} />
          ))}
        </div>
        ) : (
          <MovieCarousel movies={filterMovies(upcomingMovies)} />
        )}
      </section>

      
      <section className="mb-8">
      <div className="flex justify-between items-center">
      <h2 className="text-2xl ml-4 font-bold text-indigo-900">
        Now Showing &nbsp; &gt;&gt;&gt;
      </h2>
      <Link to="/now-showing" className="text-blue-800 hover:text-base hover:font-medium mr-2">
        See All &gt;
      </Link>
    </div>
        {isLoading ? (
           <div className="flex  justify-evenly space-x-4 mt-4">
           {[...Array(4)].map((_, index) => (
             <Skeleton key={index} height={300} width={300} />
           ))}
         </div>
        ) : (
          <MovieCarousel movies={filterMovies(nowShowingMovies)} />
        )}
      </section>
      
       </> ): (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
        {theatres?.map((theatre: TheatreLocate, index: number) => (
          <div
            key={theatre?._id || index} // Fallback to index if _id is missing
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTheatreSelection(theatre._id)}
          >
            <span className="w-full h-40 px-4 py-2 object-cover bg-yellow-200 text-red-500 rounded-md mb-4">
              {theatre.screens.screenType}
             
              
            </span>
            <h3 className="text-lg mt-4 font-bold text-gray-700 mb-2">{theatre.name}</h3>
            <p className="text-sm text-gray-600">
              {theatre.address.place}, {theatre.address.city}
            </p>
            <p className="text-sm text-gray-600">
              Distance: {(theatre.distance / 1000).toFixed(1)} km
            </p>
            <p className="mt-4 text-sm text-gray-500">
              <strong>Screen:</strong> {theatre.screens.screenName} - {theatre.screens.screenType}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Total Seats:</strong> {theatre.screens.totalSeats}
            </p>
          </div>
        ))}
      </div>
      
          )}
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setBrowseMode("movies")}
          className={`px-4 py-2 w-fit min-h-12 mb-4 rounded ${browseMode === "movies" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Browse by Movies
        </button>
        <button
          onClick={() => setBrowseMode("theatres")}
          className={`px-4 py-2 w-fit min-h-12 mb-4rounded ${browseMode === "theatres" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Browse by Theatres
        </button>
      </div>
    
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
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



{/* <header className="bg-blue-950 text-white py-4">
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
         */}
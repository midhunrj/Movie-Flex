// import React, { useEffect, useState } from 'react'
// import { BiBell, BiSearch, BiMap, BiChevronDown } from "react-icons/bi"
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { logout } from '../../redux/user/userSlice';
// import { Link } from 'react-router-dom';
// import { RootState } from '@/redux/store/store';
// import { io } from 'socket.io-client';
// import { userUrl } from '@/utils/axios/config/urlConfig';
// const Header = () => {
//     const dispatch=useDispatch()
//     const navigate=useNavigate()
//     const[unreadCount,setUnreadCount]=useState(0)
//     const {userCurrentLocation,user,role} = useSelector((state: RootState) => state.user);
//     console.log(userCurrentLocation,"is it there current location");
    
//     const userId = user?._id;
  
//     useEffect(() => {
//       const socket = io(userUrl); 
  
      
//       socket.emit("subscribe", userId, role);
  
      
//       socket.on("Notification-unread-count", (count: number) => {
//         setUnreadCount(count);
//       });
  
//       console.log(unreadCount,"aifhfhafhakfh");
      
//       return () => {
//         socket.disconnect();
//       };
//     }, [userId, role]);
//     const handleLogout = async () => {
//         dispatch(logout());
//         console.log("ok bye bye i am going see you soon");
//         navigate("/");
//       };

//       const isActive = (path: string) => location.pathname === path;
//   return (
//     <>
//     <header className="flex items-center justify-between w-full text-white bg-[#480ca8] p-4">
          
//           <div className="flex items-center">
//             <img
//               src="movielogo 2.jpeg"               alt="Movie Site Logo"
//               className="h-12 w-12 mr-4"
//             />
//             <h1 className="text-2xl font-bold">Movie Flex</h1>
//           </div>

          
//           <div className="flex space-x-8">
//           <Link to="/" className={` px-4 py-2 rounded ${
//                 isActive('/home') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
//               }`}>Home</Link>
//             <Link to="/profile" className={` px-4 py-2 rounded ${
//                 isActive('/profile') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
//               }`}>Profile</Link>
//             <Link to="/orders" className={` px-4 py-2 rounded ${
//                 isActive('/orders') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
//               }`}>Your Orders</Link>
//             <Link to="/favourites" className={` px-4 py-2 rounded ${
//                 isActive('/favourites') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-gray-700 hover:text-white'
//               }`}>Favourites</Link>
//             <Link to="/wallet" className="hover:bg-gray-700 px-4 py-2 rounded">wallet</Link>
//           </div>

          
//           <div className="flex items-center space-x-4">
//             {/* Search Bar */}
//             {/* <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="p-2 rounded bg-gray-700 text-white pl-10"
//               />
//               <BiSearch className="absolute left-2 top-2 text-gray-300" size={24} />
//             </div> */}

            
//             <div className="flex bg-white text-black items-center rounded-md border p-2">
//               <BiMap size={24} className="text-black" />
//               <span className="ml-1 cursor-pointer">{userCurrentLocation || 'Set Location'}</span>
//               <BiChevronDown size={20} className="ml-1" />
//             </div>

            
//             <BiBell size={24} className="text-white cursor-pointer" />
//             {unreadCount>0? 
//             <span className="absolute top-6 right-[7rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
//            {unreadCount} 
//         </span>
//          :<></> } 
            
//             <button
//               className="bg-red-600 min-h-8 text-white rounded px-4 py-2 hover:bg-red-700 transition"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//     </>  )
// }

// export default Header






import React, { ChangeEvent, useEffect, useState } from 'react'
import { BiBell, BiSearch, BiMap, BiChevronDown } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { logout, setUserCoordinates, setUserLocation } from '../../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store/store';
import { io, Socket } from 'socket.io-client';
import { userUrl } from '@/utils/axios/config/urlConfig';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { Spinner } from '@nextui-org/spinner';
import { fetchTheatres } from '@/redux/user/userThunk';
import { FiMenu } from 'react-icons/fi';
const Header = ({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string;
  setSearchQuery: (query: string) => void;}) => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
     const locatione=useLocation()
    const[unreadCount,setUnreadCount]=useState(0)
    const[isOpen,setIsOpen]=useState<boolean>(false)
    const {userCurrentLocation,user,role,userCoordinates} = useSelector((state: RootState) => state.user);
    console.log(userCurrentLocation,"is it there current location");
    const [dropdownOpen,setDropdownOpen]=useState<boolean>(false)
    
  const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYXNoaW5qb3kiLCJhIjoiY2x6aWE4YnNkMDY0ejJxcjBlZmpid2VoYyJ9.Etsb6UwNacChll6vPVQ_1g";

    const userId = user?._id;
  
    useEffect(() => {
      const socket = io(userUrl); 
  
      
      socket.emit("subscribe", userId, role);
  
      
      socket.on("Notification-unread-count", (count: number) => {
        setUnreadCount(count);
      });
  
      console.log(unreadCount,"aifhfhafhakfh");
      
      return () => {
        socket.disconnect();
      };
    }, [userId, role,Socket]);
    const [location, setLocation] = useState<string | null>(null);

  const [citysearchQuery, setcitySearchQuery] = useState<string>("");
  // const [upcomingMovies,setUpcomingMovies]=useState([])
  // const [nowShowingMovies,setNowShowingMovies]=useState([])
  const [browseMode, setBrowseMode] = useState<"movies" | "theatres">("movies");
  const [selectedTheatre, setSelectedTheatre] = useState<string>("");

  const [suggestedCities, setSuggestedCities] = useState<string[]>([
    "Ernakulam",
    "Bangalore",
    "Chennai",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Hyderabad",
    "Ahmedabad",
  ]);
  const [searchCities, setSearchCities] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [mobileMenuOpen,setMobileMenuOpen]=useState<boolean>(false)

  // const sanitizeString = (str: string) => {
  //   return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  // };
  // const santizedSearchQuery = sanitizeString(searchQuery);
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
      if (userCurrentLocation) {
        console.log(`Location updated: ${userCurrentLocation}`);
      }
    }, [userCurrentLocation]);
    const handleCitySelection = async (city: string) => {
      if (city == currentLocation) {
        await getUserLocation();
  
        setLocation(currentLocation);
      } else {
        await fetchCityCoordinates(city);
        setSelectedLocation(city);
        setLocation(city);
        dispatch(setUserLocation(city));
      }
      setIsOpen(false);
    };
    const handleSearchCityChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setcitySearchQuery(query);
  
      if (query.length > 2) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&types=place&limit=5`;
        try {
          const response = await fetch(url, {
            headers: {
              "Cache-Control": "no-store",
              Pragma: "no-cache",
            },
          });
          console.log(response);
  
          const data = await response.json();
          const cityNames = data.features.map(
            (feature: any) => feature.place_name
          );
          setSearchCities([...cityNames]);
        } catch (error) {
          console.error("Error fetching city suggestions:", error);
        }
      }
    };
    const fetchCityCoordinates = async (city: string) => {
      console.log(city, "i am clicking suggested city");
  
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        city
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data, "search of coordinates location");
  
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
           if(!latitude&&!longitude)
           {
            throw new Error
           }
          dispatch(setUserCoordinates({ latitude, longitude }));
          dispatch(fetchTheatres({ latitude, longitude }));
          console.log(`Coordinates for ${city}:`, { latitude, longitude });
        } else {
          console.error(`No coordinates found for ${city}`);
        }
      } catch (error) {
        console.error("Error fetching city coordinates:", error);
      }
    };
  
  
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
    const handleLogout = async () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate("/");
      };

      const isActive = (path: string) => locatione.pathname === path;
  return (
    <>
    {/* {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-50">
<div className="relative bg-white rounded-lg shadow-lg w-full max-w-7xl mx-4 sm:w-4/5 md:w-2/3 lg:w-1/2 ">

            <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold ml-12">
                Select Your Location
              </h3>
              <button
                className="text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                          <AiOutlineClose size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Enter your location..."
                value={citysearchQuery}
                onChange={handleSearchCityChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
{/* 
              <div
                className="p-3 cursor-pointer w-fit h-fit bg-yellow-100 rounded-md hover:bg-gray-100 transition "
                onClick={getUserLocation}
              >
                {isLoadingLocation ? (
                  <span className="flex gap-2 ">

                        <Spinner size="sm" color="danger" className="text-red-500" />

                   
                  Loading location...</span>
                ) : currentLocation ? (
                  <span onClick={() =>{const place=currentLocation.split(',')[0]
                     handleCitySelection(place)}}>
                    {currentLocation}
                  </span>
                ) : (
                  <span>Detect My Location</span>
                )}
              </div> */}
              {/* {citysearchQuery.length > 0 && searchCities.length > 0 ? (
                <>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg mt-2">
                    {searchCities.map((city) => (
                      <div
                        key={city}
                        className="p-3 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                          const place = city.split(",")[0]
                          handleCitySelection(place);
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl m-2 text-slate-950 font-semibold">
                    Top Cities
                  </h2>
                  <div className=" min-h-fit m-2 border shadow-lg   overflow-hidden gap-4 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-lg mt-2">
                    {suggestedCities.map((city) => (
                      <div className="relative  m-2 p-4">
                        <button
                          key={city}
                          className=" p-2 cursor-pointer w-28 h-fit bg-blue-100 hover:bg-gray-100 transition"
                          onClick={() => handleCitySelection(city)}
                        >
                          {city}
                        </button>
                      </div>
                    ))}
                  </div>
                </> */}
              {/* )}
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
      )} */}

            {/* <header className="flex items-center justify-between w-full text-white bg-blue-950 p-4">
          <div className="flex items-center">
            <img
              src="movielogo 2.jpeg"
              alt="Movie Site Logo"
              className="h-12 w-12 mr-4"
            />
            <h1 className="text-2xl font-bold">Movie Flex</h1>
          </div>

          {/* Center: Navbar Links */}
          {/* <div className="flex space-x-8">
            <Link
              to="/"
              className={`hover:bg-amber-400 px-4 py-2 rounded ${
                isActive("/home")
                  ? "bg-yellow-500 text-blue-950"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className={`hover:bg-gray-700 px-4 py-2 rounded ${
                isActive("/profile")
                  ? " disabled:opacity-50  text-gray-200 pointer-events-none"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              Profile
            </Link>
            <Link to="/orders" className="hover:bg-gray-700 px-4 py-2 rounded">
              Your Orders
            </Link>
            <Link
              to="/favourites"
              className="hover:bg-gray-700 px-4 py-2 rounded"
            >
              Favourites
            </Link>
            <Link to="/wallet" className="hover:bg-gray-700 px-4 py-2 rounded">
              wallet
            </Link>
          </div> */} 

          {/* <div className="flex items-center space-x-4">
            {isActive('/home')?<div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 rounded bg-gray-700 text-white pl-10"
              />
              <BiSearch
                className="absolute left-2 top-2 text-gray-300"
                size={24}
              />
            </div>:<></>}

            <div className="flex items-center bg-white w-fit rounded p-2 text-black">
              <BiMap size={24} onClick={() => setIsOpen(true)} />
              <span
                className="ml-1 flex items-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                {/* {location
                  ? location
                  : userCurrentLocation
                  ? userCurrentLocation
                  : "Fetching Location..."} */}
                  {/* <span className="ml-1 cursor-pointer">{userCurrentLocation || 'Set Location'}</span> 

                <BiChevronDown size={20} className="ml-1" />
              </span>
            </div> */}
            {/* <div className='relative w-fit'>
            <BiBell
              size={24}
              className="text-white cursor-pointer"
              onClick={() => navigate("/Notification")}
            />
            {unreadCount > 0 ? (
              <span className="absolute top-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCount}
              </span>
            ) : (
              <></>
            )}
</div> */}
{/* <div className="relative">
      <div
        className="flex items-center cursor-pointer transition-all bg-transparent px-4 py-2 rounded"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <FaUserCircle
          
          className="h-8 w-8 rounded-full mr-2"
        />
        <span>{user?.name}</span>
        <BiChevronDown size={20} className="ml-1" />
      </div>
      {dropdownOpen && (
        <div className="absolute  transition-all right-0 w-full mt-2 text-center flex flex-col space-y-2   bg-white text-black   border border-gray-400 shadow-lg rounded  h-fit  z-10">
          <Link
            to="/profile"
            className=" w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/orders"
            className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
          >
            Orders
          </Link>
          <Link
            to="/Notification"
            className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
          >
            Notification
          </Link>
          <div className=" w-full px-4 py-2 border-y-2  rounded-sm shadow-lg border-gray-200 items-end justify-center">     <button
className="bg-red-600 min-h-8 w-fit  text-white rounded px-4 py-1 hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
          </div>
        </div> */}
      {/* )}
    </div>
  </div>
        </header> */}

{isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="relative bg-white rounded-lg shadow-lg w-full  sm:w-4/5 md:w-2/3 lg:w-1/2 max-w-4xl sm:max-xl mx-4">
            <div className="flex justify-between items-center bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg">
              <h3 className="text-base sm:text-lg font-semibold">
                Select Your Location
              </h3>
              <button
                className="text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <input
                type="text"
                placeholder="Enter your location..."
                value={citysearchQuery}
                onChange={handleSearchCityChange}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div
                className="p-2 sm:p-3 cursor-pointer w-fit h-fit bg-yellow-100 rounded-md hover:bg-gray-100 transition text-sm sm:text-base"
                onClick={getUserLocation}
              >
                {isLoadingLocation ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" color="danger" className="text-red-500" />
                    Loading location...
                  </span>
                ) : currentLocation ? (
                  <span onClick={() => {
                    const place = currentLocation.split(',')[0];
                    handleCitySelection(place);
                  }}>
                    {currentLocation}
                  </span>
                ) : (
                  <span>Detect My Location</span>
                )}
              </div>

              {citysearchQuery.length > 0 && searchCities.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                  {searchCities.map((city) => (
                    <div
                      key={city}
                      className="p-2 sm:p-3 cursor-pointer hover:bg-gray-100 transition text-sm sm:text-base"
                      onClick={() => {
                        const place = city.split(",")[0];
                        handleCitySelection(place);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl text-slate-950 font-semibold">
                    Top Cities
                  </h2>
                  <div className="min-h-fit  border shadow-lg m-2  gap-4 overflow-hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  rounded-lg mt-2">
                    {suggestedCities.map((city) => (
                      <div className='relative m-2 p-4'><button
                        key={city}
                        className="p-2 text-sm sm:text-base w-28 h-fit bg-blue-100 hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => handleCitySelection(city)}
                      >
                        {city}
                      </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg h-fit text-sm sm:text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

<header className="bg-blue-950 text-white w-full">
  {/* Mobile Header */}
  {/* <div className="md:hidden p-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      {/* <div className="flex items-center">
        <img
          src="movielogo 2.jpeg"
          alt="Movie Site Logo"
          className="h-8 w-8"
        />
        <h1 className="text-xl font-bold ml-2">Movie Flex</h1>
      </div>

      
      <div className="flex items-center space-x-3">
        
        <div className="relative">
          {isActive('/home') &&(
          <div className="relative block">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-gray-700 text-sm lg:text-base text-white pl-10 w-40"
          />
          <BiSearch className="absolute left-2 top-2 text-sm lg:text-base text-gray-300" size={24} />
        </div>)}
        </div>
        <div
          className="flex items-center bg-white rounded p-1.5 text-black text-sm"
          onClick={() => setIsOpen(true)}
        >
          <BiMap size={20} />
          <span className="ml-1">{userCurrentLocation || 'Set Location'}</span>
        </div>

        
        <div className="relative">
          <BiBell
            size={20}
            className="cursor-pointer"
            onClick={() => navigate("/Notification")}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
</div> */}
        {/* Search */}
        

        {/* User Profile */}
        {/* <div className="relative"> */}
          {/* <FaUserCircle
            className="h-8 w-8 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          /> */}
          {/* <div>
            <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="text-white p-2"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button> */}
          {/* {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black border border-gray-400 shadow-lg rounded z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Orders
              </Link>
              <Link
                to="/wallet"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Wallet
              </Link>
              <button
                className="block w-full px-4 py-2 text-left bg-red-600 text-white hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )} */}
              {/* {mobileMenuOpen && (
      <div className="mt-4 space-y-2">
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">Profile</Link>
        <Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded">Your Orders</Link>
        <Link to="/favourites" className="block py-2 px-4 hover:bg-gray-700 rounded">Favourites</Link>
        <Link to="/wallet" className="block py-2 px-4 hover:bg-gray-700 rounded">Wallet</Link>
        <div className="px-4 py-2 border-t border-gray-200">
              <button
                className="w-full bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
        
      </div>
              )}</div>
      </div>
    </div>  */}
  <div className="md:hidden p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="movielogo 2.jpeg"
          alt="Movie Site Logo"
          className="h-8 w-8"
        />
        <h1 className="text-xl font-bold ml-2">Movie Flex</h1>
      </div>
      <div className='flex items-center ml-auto space-x-4'>
      <div className="relative">
          {isActive('/home') &&(
          <div className="relative block">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-gray-700 text-sm lg:text-base text-white pl-10 w-40"
          />
          <BiSearch className="absolute left-2 top-2 text-sm lg:text-base text-gray-300" size={24} />
        </div>)}
        </div>
        </div>
        <div className='flex items-center ml-auto space-x-4'>
        <div
          className="flex items-center bg-white rounded p-1.5 text-black text-sm"
          onClick={() => setIsOpen(true)}
        >
          <BiMap size={20} />
          <span className="ml-1">{userCurrentLocation || 'Set Location'}</span>
        </div>

        
        <div className="relative w-fit">
          <BiBell
            size={20}
            className="cursor-pointer"
            onClick={() => navigate("/Notification")}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-0 translate-x-1/2 -translate-y-1/2  bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
<div className='relative'>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="text-white p-2 h-fit"
      >
        {/* <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg> */}
        <FiMenu size={24}/>
      </button>
      </div>
      </div>
    </div>
    
    {mobileMenuOpen && (
      <div className="mt-4 space-y-2">
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">Profile</Link>
        <Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded">Your Orders</Link>
        <Link to="/favourites" className="block py-2 px-4 hover:bg-gray-700 rounded">Favourites</Link>
        <Link to="/wallet" className="block py-2 px-4 hover:bg-gray-700 rounded">Wallet</Link>
        <div className=" flex  px-4 py-2 border-t border-gray-200">
              <button
                className="w-48 justify-center h-fit  bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
        
      </div>
    )}
  </div>


  {/* Desktop Header */}
  <div className="hidden md:flex items-center  w-full justify-between  p-4">
    <div className="flex items-center">
      <img
        src="movielogo 2.jpeg"
        alt="Movie Site Logo"
        className="h-12 w-12 "
      />
      <h1 className="text-2xl font-bold ml-2">Movie Flex</h1>
    </div>

    <nav className="flex  gap-4">
      <Link
        to="/"
        className={`hover:bg-amber-400 px-3 py-2 rounded text-sm lg:text-base ${
          isActive("/home")
            ? "bg-yellow-500 text-blue-950"
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        Home
      </Link>
      <Link
        to="/profile"
        className={`px-3 py-2 rounded text-sm lg:text-base ${
          isActive("/profile")
            ? "disabled:opacity-50 text-gray-200 pointer-events-none"
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        Profile
      </Link>
      <Link to="/orders" className="hover:bg-gray-700 px-3 py-2 rounded text-sm lg:text-base">
        Your Orders
      </Link>
      <Link to="/favourites" className="hover:bg-gray-700 px-3 py-2 rounded text-sm lg:text-base">
        Favourites
      </Link>
      <Link to="/wallet" className="hover:bg-gray-700 px-3 py-2 rounded text-sm lg:text-base">
        Wallet
      </Link>
      
    </nav>

    <div className="flex items-center space-x-3">
      {isActive('/home') && (
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-gray-700 text-sm lg:text-base text-white pl-10 w-20 lg:w-60"
          />
          <BiSearch className="absolute left-2 top-2 text-sm lg:text-base text-gray-300" size={24} />
        </div>
      )}

      <div className="flex items-center bg-white rounded p-1.5 text-black text-sm lg:text-base">
        <BiMap size={20} onClick={() => setIsOpen(true)} />
        <span className="ml-1 cursor-pointer hidden sm:flex items-center" onClick={() => setIsOpen(true)}>
          <span className="ml-1 cursor-pointer">{location
    ? location
         : userCurrentLocation
         ? userCurrentLocation
         : "Fetching Location..."}</span>
          <BiChevronDown size={20} className="ml-1 cursor-pointer" />
        </span>
      </div>

      <div className="relative w-fit">
        <BiBell
          size={20}
          className="text-white cursor-pointer"
          onClick={() => navigate("/Notification")}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0 translate-x-1/2 -translate-y-1/2  bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          className="flex items-center transition-all cursor-pointer px-4 py-2 rounded"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle className="h-8 w-8 rounded-full" />
          <span className="ml-2 hidden lg:block">{user?.name}</span>
          <BiChevronDown size={20} className="ml-1" />
        </div>

        {dropdownOpen && (
          <div className="absolute  transition-all right-0 mt-2 text-center w-full   h-fit flex flex-col space-y-2 bg-white text-black border border-gray-400 shadow-lg rounded z-10">
            <Link to="/profile" className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100 ">
              Profile
            </Link>
            <Link to="/orders" className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100">
              Orders
            </Link>
            <Link to="/wallet" className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100">
              Wallet
            </Link>
            <Link to="/Notification" className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100">
              Notification
            </Link>
            <div className=" w-full px-4 py-2 border-t border-gray-200">
              <button
                className="w-full h-fit bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition text-base"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</header>    </>  )
}

export default Header


// previously used  hoem page for reference //

{/* <header className="flex items-center justify-between w-full bg-blue-950 text-white  p-4">
<div className="flex items-center">
  <img
    src="movielogo 2.jpeg"
    alt="Movie Site Logo"
    className="h-12 w-12 "
  />
  <h1 className="text-2xl font-bold ml-2">Movie Flex</h1>
</div>

{/* Center: Navbar Links */}

{/* <div className="flex space-x-8">
  <Link
    to="/"
    className={`hover:bg-amber-400 px-4 py-2 rounded ${
      isActive("/home")
        ? "bg-yellow-500 text-blue-950"
        : "hover:bg-gray-700 hover:text-white"
    }`}
  >
    Home
  </Link>
  <Link
    to="/profile"
    className={`hover:bg-gray-700 px-4 py-2 rounded ${
      isActive("/profile")
        ? "bg-yellow-500 text-blue-950"
        : "hover:bg-gray-700 hover:text-white"
    }`}
  >
    Profile
  </Link>
  <Link to="/orders" className="hover:bg-gray-700 px-4 py-2 rounded">
    Your Orders
  </Link>
  <Link
    to="/favourites"
    className="hover:bg-gray-700 px-4 py-2 rounded"
  >
    Favourites
  </Link>
  <Link to="/wallet" className="hover:bg-gray-700 px-4 py-2 rounded">
    wallet
  </Link>
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
    <BiSearch
      className="absolute left-2 top-2 text-gray-300"
      size={24}
    />
  </div>

  <div className="flex items-center cursor-pointer bg-white w-fit rounded p-2 text-black">
    <BiMap size={24} onClick={() => setIsOpen(true)} />
    <span
      className="ml-1 flex items-center cursor-pointer"
      onClick={() => setIsOpen(true)}
    > */}
//       {location
//         ? location
//         : userCurrentLocation
//         ? userCurrentLocation
//         : "Fetching Location..."}
//       <BiChevronDown size={20} className="ml-1" />
//     </span>
//   </div>
// <div className="relative w-fit">
//   <BiBell
//     size={24}
//     className="text-white cursor-pointer"
//     onClick={() => navigate("/Notification")}
//   />
//   {unreadCount > 0 ? (
//     <span className="absolute -top-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
//       {unreadCount}
//     </span>
//   ) : (
//     <></>
//   )}
//   </div>

  {/* <button
    className="bg-red-600 min-h-8 text-white rounded px-4 py-1 hover:bg-red-700 transition"
    onClick={handleLogout}
  >
    Logout
  </button> */}

{/* <div className="relative">
<div
className="flex items-center cursor-pointer transition-all bg-transparent px-4 py-2 rounded"
onClick={() => setDropdownOpen(!dropdownOpen)}
>
<FaUserCircle

className="h-8 w-8 rounded-full mr-2"
/>
<span>{user?.name}</span>
<BiChevronDown size={20} className="ml-1" />
</div>
{dropdownOpen && (
<div className="absolute  transition-all right-0 w-full mt-2 text-center flex flex-col space-y-2   bg-white text-black   border border-gray-400 shadow-lg rounded  h-fit  z-10">
<Link
  to="/profile"
  className=" w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
>
  Profile
</Link>
<Link
  to="/orders"
  className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
>
  Orders
</Link>
<Link
  to="/Notification"
  className="w-full px-4 py-2 border-y-2 rounded-sm shadow-lg border-gray-200 hover:bg-gray-100"
>
  Notification
</Link>
<div className=" w-full px-4 py-2 border-y-2  rounded-sm shadow-lg border-gray-200 items-end justify-center">     <button
className="bg-red-600 min-h-8 w-fit  text-white rounded px-4 py-1 hover:bg-red-700 transition"
  onClick={handleLogout}
>
  Logout
</button>
</div>
</div>
)}
</div>
</div> */}
// </header> 
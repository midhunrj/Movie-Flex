// // import React from "react";
// // import { useDispatch,useSelector } from "react-redux";
// // import { useNavigate } from "react-router";
// // // import { logout } from "../../redux/user/userThunk";
// // import { logout } from "../../redux/user/userSlice";
// // import {Menu, MenuButton} from '@headlessui/react'

// // const HomePage = () => {
// //     const {user,isLoading,isSuccess,isError,message}=useSelector((state)=>state.user)
// //      const navigate=useNavigate()
// //      const dispatch=useDispatch()
// //      const handleLogout=async()=>{
// //        dispatch(logout())
// //       //  if(response)
// //       //  {
// //         console.log("ok bye bye i am going see you soon");
// //         navigate('/')
// //       //  }
// //      }
// //     return (
// //         <>
// //         <div className="container">
// //           <Menu>
// //             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">Home</MenuButton>
// //             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">shows</MenuButton>
// //             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">Profile</MenuButton>
// //             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">your orders</MenuButton>
// //             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">favourites</MenuButton>
// //           </Menu>
// //         <div className="flex justify-end items-end h-max p-4">
// //           <button 
// //             className="px-4 py-2 bg-cyan-300-500 min-h-8 text-white rounded-md hover:bg-red-600 transition"
// //             onClick={handleLogout}
// //           >
// //             Logout
// //           </button>
// //         </div>
// //         <div className="flex items-center justify-center h-screen 00">
            
// //             <h1 className="text-4xl font-bold text-blue-500">
// //                 Welcome to Movie Ticket Booking</h1>
            
// //         </div>
// //         </div>
// //         </>
// //     );
// // };

// // export default HomePage;




// import React, { useState,useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { logout } from "../../redux/user/userSlice";
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
// import {motion} from 'framer-motion'
// import {Button,Modal,} from 'flowbite-react'
// import {TextField} from '@mui/material'

// const HomePage = () => {
//   const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isOpen,setIsOpen]=useState(false)
//   const handleLogout = async () => {
//     dispatch(logout());
//     console.log("ok bye bye i am going see you soon");
//     navigate('/');
//   };

//   useEffect(()=>{
//    if(!user)
//    {
//     navigate('/')
//    }
//   },[user])

//   return (
//     <>
//       <div className="container mx-auto p-4">
//         {/* Header */}
//         <div className="grid grid-cols-8 justify-between w-svw text-white bg-blue-950 gap-4 text-center mx-4">
//           <div className="col-start-1 ">
//           <h1 className="text-white text-xl">Movie Ticket Booking</h1>
//           </div>
//           <a href="/" className="hover:bg-amber-400 py-8 rounded">Home</a>
//       <a href="#" className= "active:bg-teal-600 hover:bg-gray-700 py-8 rounded">Profile</a>
//       <a href="#" className="hover:bg-gray-700 py-8 rounded">Your Orders</a>
//       <a href="#" className="hover:bg-gray-700 py-8 rounded">Favourites</a>
//       <a href="#" className="hover:bg-gray-700 py-8 rounded">Shows</a>
          
//           {/* Menu */}
//           <div className="grid-cols-3 bg-950 mx-auto py-8">
//             {/* <Menu>
//               <MenuButton>Home
//             <MenuItem>Home</MenuItem>
//             <MenuItem>Profile</MenuItem>
//             </MenuButton>
//             </Menu> */}
//             <h1>Home page</h1>
//           </div>
//           <Menu as="div" className="relative">
//             <MenuButton className="bg-blue-950 text-white py-2 px-4 rounded">
//               Menu
//             </MenuButton>
//             <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? 'bg-blue-500 text-white' : 'text-black'
//                     } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                     onClick={() => navigate('/')}
//                   >
//                     Home
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? 'bg-blue-500 text-white' : 'text-black'
//                     } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                     onClick={() => navigate('/shows')}
//                   >
//                     Shows
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? 'bg-blue-500 text-white' : 'text-black'
//                     } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                     onClick={() => navigate('/profile')}
//                   >
//                     Profile
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? 'bg-blue-500 text-white' : 'text-black'
//                     } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                     onClick={() => navigate('/orders')}
//                   >
//                     Your Orders
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? 'bg-blue-500 text-white' : 'text-black'
//                     } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                     onClick={() => navigate('/favourites')}
//                   >
//                     Favourites
//                   </button>
//                 )}
//               </MenuItem>
//             </MenuItems>
//           </Menu>
//         </div>

//         {/* Logout Button */}
//         <div className="flex justify-end items-end p-4">
//         <button 
//             className="px-4 py-2 bg-cyan-300-500 min-h-8 text-white rounded-md hover:bg-red-600 transition"
//              onClick={handleLogout}
//            >
//              Logout
//            </button>
           
//         </div>

//         Main Content
//         <div className="flex w-screen h-max p-4 m-4">
//           <img src="..pub/banner_img_2.jpeg"/>
//         </div>
//         <div className="flex items-center justify-center h-screen">
//         {/* <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 5 }}
//         transition={{ duration: 3 }}
//         className="mt-6 p-4 bg-green-500 text-white"
//       >
//         Animated Component
//       </motion.div> */}
//           <h1 className="text-4xl font-bold text-blue-500">
//             Welcome to Movie Ticket Booking
//           </h1>
//         </div>


//         <Button onClick={()=>setIsOpen(true)} className="px-2  min-h-8">Book now</Button>
//         {/* Flowbite Modal */}
//       <Modal show={isOpen} onClose={() => setIsOpen(false)}>
//         <Modal.Header>Book a Ticket</Modal.Header>
//         <Modal.Body>
//           <p className="text-base leading-relaxed text-gray-600">
//             Confirm your ticket booking now!
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => setIsOpen(false)}>Confirm</Button>
//           <Button color="gray" onClick={() => setIsOpen(false)}>Cancel</Button>
//         </Modal.Footer>
//       </Modal>
//       {/* <div className=""> */}
//       <div className=" flex col-start-4 my-4">
//                 <div className="col-span-3 gap-4"><img src="coming soon 1.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="coming soon 2.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="coming soon 3.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="now showing 5.jpg"/></div>
//       </div>
//       <div className=" grid grid-cols-12 my-4">
//         <div className="col-span-3 gap-4"><img src="now showing 1.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="now showing 2.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="now showing 3.jpg"/></div>
//         <div className="col-span-3 gap-4"><img src="now showing 4.jpg"/></div>
//       </div>
//       </div>
//       {/* </div> */}
//     </>
//   );
// };

// export default HomePage;


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { logout } from "../../redux/user/userSlice";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { Button, Modal } from "flowbite-react";
// import { toast } from "react-toastify";
// import Footer from "./footer";
// import { BiBell, BiSearch, BiMap } from "react-icons/bi";
// //import {refreshPage} from '../../redux/user/userThunk'
// // import {toas}

// const HomePage = () => {
//   const { user } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isOpen, setIsOpen] = useState(false);
//   const [location, setLocation] = useState(null);

//   const handleLogout = async () => {
//     dispatch(logout());
//     console.log("ok bye bye i am going see you soon");
//     navigate("/");
//   };

  
//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
          
         
//           let geoApiKey='dfd10cf75e1e42ac8410797d0be42cf2'
//           const response = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`
//           );
//           const data = await response.json();
//           const userLocation = data.results[0].formatted; // Adjust based on the API response
          
//           setLocation(userLocation);
//         },
//         (error) => {
//           console.error(error);
//           setLocation("Unable to retrieve location");
//         }
//       );
//     } else {
//       setLocation("Geolocation not supported");
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     }
//     getUserLocation();
//   }, [user]);

//   return (
//     <>
//       <div className="pt-2 mx-auto p-4">
//         <header className="flex items-center justify-between w-full text-white bg-blue-950 p-4">
//           <div className="flex items-center">
//             <img
//               src="movielogo 2.jpeg"
//               alt="Movie Site Logo"
//               className="h-12 w-12 mr-4"
//             />
//             <h1 className="text-2xl font-bold">Movie Flex</h1>
//           </div>

//           {/* Center: Navbar Links */}
//           <div className="flex space-x-8">
//             <a href="/" className="hover:bg-amber-400 px-4 py-2 rounded">Home</a>
//             <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Profile</a>
//             <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Your Orders</a>
//             <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Favourites</a>
//             <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Shows</a>
//           </div>

//           {/* Right: Search, Location, Notification, and Logout */}
//           <div className="flex items-center space-x-4">
//             {/* Search Bar */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="p-2 rounded bg-gray-700 text-white pl-10"
//               />
//               <BiSearch className="absolute left-2 top-2 text-gray-300" size={24} />
//             </div>

//             {/* Location Icon */}
//             <div className="flex items-center">
//               <BiMap size={24} className="text-white" />
//               <span className="ml-1">{location ? location : "Fetching Location..."}</span>
//             </div>

//             {/* Notification Icon */}
//             <BiBell size={24} className="text-white cursor-pointer" />

//             {/* Logout Button */}
//             <button
//               className="bg-red-600 min-h-8 text-white rounded px-4 py-2 hover:bg-red-700 transition"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* Banner Section */}
//         <div className=" flex-wrap gap-4 my-1 mb-4">
//           <img
//             src="banner hd mv.jpeg"
//             alt="Banner"
//             className="h-screen w-screen  object-fill rounded-lg"
//           />
//         </div>

//         {/* Movies List Section */}
//         <div className="space-y-12">
//           {/* Upcoming Movies */}
//           <h2 className="text-2xl font-bold text-indigo-900 mb-4">Upcoming Movies  &nbsp; &gt;&gt;&gt;</h2>
//           <div className="flex">
//             <div className="grid grid-cols-4 gap-4">
//               <div className="text-center gap-4 ">
//                 <img
//                   src="coming soon 1.jpg"
//                   alt="Movie 1"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">Barroz</p>
//                 <p className="text-sm text-gray-600">Rating: 8.5</p>
//               </div>
//               <div className="text-center gap-12">
//                 <img
//                   src="coming soon 2.jpg"
//                   alt="Movie 2"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">A.R.M</p>
//                 <p className="text-sm text-gray-600">Rating: 7.8</p>
//               </div>
//               <div className="text-center gap-24">
//                 <img
//                   src="coming soon 3.jpg"
//                   alt="Movie 3"
//                   className="w-fit  cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">Devara</p>
//                 <p className="text-sm text-gray-600">Rating: 8.0</p>
//               </div>
//               <div className="text-center gap-4">
//                 <img
//                   src="upcming mv img.jpg"
//                   alt="Movie 4"
//                   className="w-fit cursor-pointer  curounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">G.O.A.T</p>
//                 <p className="text-sm text-gray-600">Rating: 7.9</p>
//               </div>
//             </div>
//           </div>

//           {/* Now Showing */}
//           <h2 className="text-2xl font-bold text-indigo-900 mb-4">Now Showing &nbsp; &gt;&gt;&gt;</h2>
//           <div className="flex ">
//             <div className="grid grid-cols-4 gap-4">
//               <div className="text-center">
//                 <img
//                   src="now showing 1.jpg"
//                   alt="Movie 5"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">Thangalaan</p>
//                 <p className="text-sm text-gray-600">Rating: 9.0</p>
//               </div>
//               <div className="text-center gap-4">
//                 <img
//                   src="now showing 2.jpg"
//                   alt="Movie 6"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="">Demonte Colony</p>
//                 <p className="text-sm text-gray-600">Rating: 8.8</p>
//               </div>
//               <div className="text-center gap-4">
//                 <img
//                   src="now showing 3.jpg"
//                   alt="Movie 7"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">Stree 2</p>
//                 <p className="text-sm text-gray-600">Rating: 8.6</p>
//               </div>
//               <div className="text-center gap-4">
//                 <img
//                   src="now showing 4.jpg"
//                   alt="Movie 8"
//                   className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
//                 />
//                 <p className="mt-2 text-lg font-semibold">Animal</p>
//                 <p className="text-sm text-gray-600">Rating: 8.3</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default HomePage;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../redux/user/userSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Button, Modal } from "flowbite-react";
import { toast } from "react-toastify";
import Footer from "./footer";
import { BiBell, BiSearch, BiMap } from "react-icons/bi";
import { fetchMovies } from "../../redux/user/userThunk";
import { Link } from "react-router-dom";
//import {refreshPage} from '../../redux/user/userThunk'
// import {toas}

const HomePage = () => {
  const { user,isSuccess,isError,nowShowingMovies,upcomingMovies } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchQuery,setSearchQuery]=useState("")
  // const [upcomingMovies,setUpcomingMovies]=useState([])
  // const [nowShowingMovies,setNowShowingMovies]=useState([])
  const handleLogout = async () => {
    dispatch(logout());
    console.log("ok bye bye i am going see you soon");
    navigate("/");
  };

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
         
          let geoApiKey='dfd10cf75e1e42ac8410797d0be42cf2'
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`
          );
          const data = await response.json();
          const userLocation = data.results[0].formatted; // Adjust based on the API response
          
          setLocation(userLocation);
        },
        (error) => {
          console.error(error);
          setLocation("Unable to retrieve location");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  const sanitizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };
  const santizedSearchQuery=sanitizeString(searchQuery)
  
  const filteredNowShowing = nowShowingMovies.filter((movie) =>{
    const sanitizedMovieTitle=sanitizeString(movie.title)
    //movie.title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(searchQuery.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    return sanitizedMovieTitle.includes(santizedSearchQuery)
  }
  );

  const filteredUpcoming = upcomingMovies.filter((movie) =>
  {
    const sanitizedMovieTitle=sanitizeString(movie.title)
    //movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    return sanitizedMovieTitle.includes(santizedSearchQuery)
  }
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    dispatch(fetchMovies())
    getUserLocation();
  }, [user]);

  return (
    <>
      <div className="pt-2 mx-auto p-4">
        <header className="flex items-center justify-between w-full text-white bg-blue-950 p-4">
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
            <a href="/" className="hover:bg-amber-400 px-4 py-2 rounded">Home</a>
            <Link to="/profile" className="hover:bg-gray-700 px-4 py-2 rounded">Profile</Link>
            <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Your Orders</a>
            <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Favourites</a>
            <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">Shows</a>
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

            
            <div className="flex items-center">
              <BiMap size={24} className="text-white" />
              <span className="ml-1">{location ? location : "Fetching Location..."}</span>
            </div>

            
            <BiBell size={24} className="text-white cursor-pointer" />

           
            <button
              className="bg-red-600 min-h-8 text-white rounded px-4 py-2 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Banner Section */}
        <div className=" flex-wrap gap-4 my-1 mb-4">
          <img
            src="banner hd mv.jpeg"
            alt="Banner"
            className="h-screen w-screen  object-fill rounded-lg"
          />
        </div>

        {/* Movies List Section */}
        <div className="space-y-12">
          {/* Upcoming Movies */}
          <div className="flex justify-between">
          <h2 className=" justify-start text-2xl font-bold text-indigo-900 mb-4">
            Upcoming Movies  &nbsp; &gt;&gt;&gt;</h2>
            <a href="/upcoming-movies" className="justify-end  cursor-pointer  text-blue-800 hover:text-base hover:font-medium mr-4">See All  &gt;</a>
            </div>
                    <div className="flex">
            <div className="grid grid-cols-4 gap-4">
            {filteredUpcoming.slice(0,4).map((movie) => (
              <div className="text-center gap-4" key={movie._id}>
                <img
                  src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg'}  
                    alt={movie.title}
                  className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
                />
                <p className="mt-2 text-lg font-semibold">{movie.title}</p>
                <p className="text-sm text-gray-600"> Rating: {movie.rating > 0 ? movie.rating : "Popular"}</p>
              </div>
            ))}
            </div>
          </div>

          {/* Now Showing */}
          <div className="flex justify-between">
          <h2 className="justify-start text-2xl font-bold text-indigo-900 mb-4">
            Now Showing &nbsp; &gt;&gt;&gt;</h2>
            <a href="/now-showing" className=" justify-end text-blue-800 hover:font-medium hover:text-base mr-4">See All &gt;</a>
           
          </div>
                   <div className="flex ">
            <div className="grid grid-cols-4 gap-4">
            {filteredNowShowing.slice(0,4).map((movie) => (
              <div className="text-center" key={movie._id}>
                <img
                  src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'banner img brand.jpeg'}
                  alt={movie.title}
                  className="w-fit cursor-pointer rounded-lg hover:scale-105 transition-transform"
                />
                <p className="mt-2 text-lg font-semibold">{movie.title}</p>
                <p className="text-sm text-gray-600">Rating: {movie.rating}</p>
              </div>
            ))}
            </div>
          </div>
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
//         `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${geoApiKey}`
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
//         `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoApiKey}`
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
//         `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&language=en-US&page=1&region=IN` // Adjust region as necessary
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
      <a href="/" className="hover:bg-amber-400 py-2 px-4 rounded">Home</a>
      <a href="#" className="hover:bg-gray-700 py-2 px-4 rounded">Profile</a>
      <a href="#" className="hover:bg-gray-700 py-2 px-4 rounded">Your Orders</a>
      <a href="#" className="hover:bg-gray-700 py-2 px-4 rounded">Favourites</a>
      <a href="#" className="hover:bg-gray-700 py-2 px-4 rounded">Shows</a>
    </div>
  </div>
</header>
         */}
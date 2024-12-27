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






import React, { useEffect, useState } from 'react'
import { BiBell, BiSearch, BiMap, BiChevronDown } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store/store';
import { io } from 'socket.io-client';
import { userUrl } from '@/utils/axios/config/urlConfig';
const Header = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const[unreadCount,setUnreadCount]=useState(0)
    const[isOpen,setIsOpen]=useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>("");
    const {userCurrentLocation,user,role} = useSelector((state: RootState) => state.user);
    console.log(userCurrentLocation,"is it there current location");
    
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
    }, [userId, role]);
    const handleLogout = async () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate("/");
      };

      const isActive = (path: string) => location.pathname === path;
  return (
    <>
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
          </div>

          <div className="flex items-center space-x-4">
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
                  <span className="ml-1 cursor-pointer">{userCurrentLocation || 'Set Location'}</span>

                <BiChevronDown size={20} className="ml-1" />
              </span>
            </div>

            <BiBell
              size={24}
              className="text-white cursor-pointer"
              onClick={() => navigate("/Notification")}
            />
            {unreadCount > 0 ? (
              <span className="absolute top-6 right-[7rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCount}
              </span>
            ) : (
              <></>
            )}

            <button
              className="bg-red-600 min-h-8 text-white rounded px-4 py-1 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>


    </>  )
}

export default Header
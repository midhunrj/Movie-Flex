import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { BiBell, BiMap } from "react-icons/bi";
import { logout } from '../../redux/theatre/theatreSlice';
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { theatreUrl } from '@/utils/axios/config/urlConfig';
const TheatreHeader = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, isError, isSuccess, role } = useSelector((state) => state.theatre);
    const [unreadCount, setUnreadCount] = useState(0);
    const userId = theatre?._id;
    useEffect(() => {
        const socket = io(theatreUrl);
        socket.emit("subscribe", userId, role);
        socket.on("Notification-unread-count", (count) => {
            setUnreadCount(count);
        });
        console.log(unreadCount, "aifhfhafhakfh");
        return () => {
            socket.disconnect();
        };
    }, [userId, role]);
    const handleLogout = () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre');
    };
    return (_jsx("header", { className: " from-yellow-200 via-blue-950  bg-gradient-to-tr to-[#091057]   text-white", children: _jsxs("div", { className: "flex justify-between items-center p-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "/movielogo 2.jpeg" // Update with your movie site logo path
                            , alt: "Movie Site Logo", className: "h-12 w-12 mr-4" }), _jsx("span", { className: "text-2xl font-bold", children: "Movie Flex" })] }), _jsxs("div", { className: "flex space-x-6", children: [_jsx(Link, { to: "/theatre/home", className: "hover:bg-gray-700 p-4 rounded transition", children: "Home" }), _jsx(Link, { to: "/theatre/movies", className: "hover:bg-gray-700 p-4 rounded transition", children: "Movies" }), _jsx(Link, { to: "/theatre/screens", className: "hover:bg-gray-700 p-4 rounded transition", children: "Screens" }), _jsx(Link, { to: "/theatre/profile", className: "hover:bg-gray-700 p-4 rounded transition", children: "profile" })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "relative", children: [_jsx(BiBell, { size: 24, className: "text-white cursor-pointer", onClick: () => navigate('/theatre/Notification') }), unreadCount > 0 ?
                                    _jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center", children: unreadCount })
                                    : _jsx(_Fragment, {})] }), _jsxs("div", { className: "text-sm text-gray-200", children: [_jsx(BiMap, { size: 24, className: "text-white" }), "kochi"] }), _jsx(Link, { to: "/theatre/profile", className: "flex items-center", children: _jsx(FaUserCircle, { size: 28, className: "text-white" }) }), _jsx("button", { className: "bg-transparent min-h-8 text-white rounded p-2 hover:bg-red-600 transition", onClick: handleLogout, children: "Logout" })] })] }) }));
};
export default TheatreHeader;

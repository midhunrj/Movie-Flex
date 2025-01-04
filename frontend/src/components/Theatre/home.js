import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/theatre/theatreSlice";
import { BiBell } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import Footer from "../User/footer";
import { Link } from "react-router-dom";
import { theatreAuthenticate } from "@/utils/axios/theatreInterceptor";
import { Bar, Line } from "react-chartjs-2";
import { io, Socket } from "socket.io-client";
import { theatreUrl } from "@/utils/axios/config/urlConfig";
const TheatreHome = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theatre, role } = useSelector((state) => state.theatre);
    const [unreadCount, setUnreadCount] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [revenues, setRevenues] = useState([]);
    const [timePeriod, setTimePeriod] = useState('Monthly');
    const userId = theatre?._id;
    const handleLogout = () => {
        dispatch(logout());
        console.log("ok bye bye i am going see you soon");
        navigate('/theatre');
    };
    const [bookingData, setBookingData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10; // Number of rows per page
    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);
    const fetchBookings = async (page) => {
        setLoading(true);
        try {
            const response = await theatreAuthenticate.get("/bookings", {
                params: {
                    page,
                    limit: itemsPerPage,
                    theatreId: theatre?._id
                },
            });
            console.log(response.data.bookings, "booking history");
            setBookingData(response.data.bookings);
            setTotalPages(response.data.totalPages);
        }
        catch (error) {
            console.error("Error fetching bookings:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
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
    }, [userId, role, Socket]);
    useEffect(() => {
        fetchBookingTrends();
        fetchRevenueTrends();
    }, [timePeriod]);
    const fetchBookingTrends = async () => {
        const response = await theatreAuthenticate.get("/booking-trends", { params: { interval: timePeriod }, headers: { theatreId: theatre?._id } });
        console.log(response.data, "bookingtrens");
        setBookings(response.data.bookingTrend);
    };
    const fetchRevenueTrends = async () => {
        const response = await theatreAuthenticate.get("/revenue-trends", { params: { interval: timePeriod }, headers: { theatreId: theatre?._id } });
        setRevenues(response.data.revenueTrend);
    };
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: " min-h-screen bg-gray-100", children: [_jsx("header", { className: " from-yellow-200 via-blue-950  bg-gradient-to-tr to-[#091057] text-white", children: _jsxs("div", { className: "flex justify-between items-center p-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "/movielogo 2.jpeg" // Update with your movie site logo path
                                            , alt: "Movie Site Logo", className: "h-12 w-12 mr-4" }), _jsx("span", { className: "text-2xl font-bold", children: "Movie Flex" })] }), _jsxs("div", { className: "flex space-x-6", children: [_jsx(Link, { to: "/theatre/home", className: "hover:bg-gray-700 p-4 rounded transition", children: "Home" }), _jsx(Link, { to: "/theatre/movies", className: "hover:bg-gray-700 p-4 rounded transition", children: "Movies" }), _jsx(Link, { to: "/theatre/screens", className: "hover:bg-gray-700 p-4 rounded transition", children: "Screens" }), _jsx(Link, { to: "/theatre/profile", className: "hover:bg-gray-700 p-4 rounded transition", children: "profile" })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "relative", children: [_jsx(BiBell, { size: 24, className: "text-white cursor-pointer", onClick: () => navigate('/theatre/Notification') }), unreadCount > 0 ?
                                                    _jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center", children: unreadCount })
                                                    : _jsx(_Fragment, {})] }), _jsx(Link, { to: "/theatre/profile", className: "flex items-center", children: _jsx(FaUserCircle, { size: 28, className: "text-white" }) }), _jsx("button", { className: "bg-transparent min-h-8 text-white rounded p-2 hover:bg-red-600 transition", onClick: handleLogout, children: "Logout" })] })] }) }), _jsx("h1", { className: "text-4xl font-bold text-blue-500 text-center mt-8", children: "Welcome to Movie Ticket Booking" }), _jsxs("div", { className: "mt-4  mx-8", children: [_jsx("label", { htmlFor: "timePeriod", className: "font-semibold mr-4", children: "Select Time Period:" }), _jsxs("select", { id: "timePeriod", className: "border rounded p-2", value: timePeriod, onChange: (e) => setTimePeriod(e.target.value), children: [_jsx("option", { value: "Daily", children: "Daily" }), _jsx("option", { value: "Weekly", children: "Weekly" }), _jsx("option", { value: "Monthly", children: "Monthly" }), _jsx("option", { value: "Yearly", children: "Yearly" })] })] }), _jsxs("div", { className: "mt-8 mx-8   grid  gap-12 grid-cols-2", children: [_jsxs("div", { className: "bg-white p-2 rounded-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold", children: "Booking Trends" }), bookings.length > 0 && (_jsx(Line, { data: {
                                            labels: bookings.map((item) => item._id),
                                            datasets: [
                                                {
                                                    label: "Bookings",
                                                    data: bookings.map((item) => item.totalBookings),
                                                    borderColor: "blue",
                                                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                                                    tension: 0.5,
                                                },
                                            ],
                                        } }))] }), _jsxs("div", { className: "bg-white p-2 rounded-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold", children: "Revenue Trends" }), revenues.length > 0 && (_jsx(Bar, { data: {
                                            labels: revenues.map((item) => item._id),
                                            datasets: [
                                                {
                                                    label: "Revenue",
                                                    data: revenues.map((item) => item.totalRevenue),
                                                    backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0"],
                                                },
                                            ],
                                        } }))] })] }), loading ? (_jsx("p", { children: "Loading..." })) : bookingData.length > 0 ? (_jsxs("div", { className: "mx-8", children: [_jsx("h2", { className: "text-2xl text-center font-bold my-4", children: "Order History" }), _jsxs("table", { className: "min-w-full bg-white  gap-4 shadow-md rounded-md mt-6", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-lg text-left", children: "Movie " }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "User" }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "Booking Date" }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "Status" })] }) }), _jsx("tbody", { children: bookingData.map((booking) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "px-4 py-2", children: booking.movieId.title }), _jsx("td", { className: "px-4 py-2", children: booking.userId ? booking.userId?.name : booking.screenData?.screenName }), _jsx("td", { className: "px-4 py-2", children: new Date(booking.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-4 py-2", children: booking.status })] }, booking._id))) })] }), _jsxs("div", { className: "flex justify-center items-center gap-2 my-4", children: [_jsx("button", { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, className: `px-4 py-1  rounded-lg min-h-8  ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Prev" }), Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page == currentPage || page == currentPage - 1 || page == currentPage + 1).map(page => (_jsx("button", { onClick: () => paginate(page), className: `p-2 rounded-lg  min-h-8 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`, children: page }, page))), _jsx("button", { onClick: () => paginate(currentPage + 1), disabled: currentPage === totalPages, className: `px-4 py-1 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Next" })] })] })) : (_jsx("div", { className: "text-center flex justify-center items-center mx-auto  text-black", children: "No history found" }))] }), _jsx(Footer, {})] }));
};
export default TheatreHome;

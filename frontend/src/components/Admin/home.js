import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../redux/admin/adminSlice";
import { Line, Bar } from "react-chartjs-2";
import SidebarMenu from "./sidebarMenu";
import { adminAuthenticate } from "@/utils/axios/adminInterceptor";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadarController, ScatterController, BubbleController, Title, Tooltip, Legend } from "chart.js";
import { tmdbApiKey } from "@/utils/axios/config/urlConfig";
const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "Monthly Sales",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        },
    ],
};
const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: "Sales Data",
        },
        tooltip: {
            enabled: true,
        },
    },
};
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadarController, // For Radar charts
ScatterController, // For Scatter charts
BubbleController, LineElement, PointElement);
const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/admin");
    };
    const [overview, setOverview] = useState(null);
    const [bookingData, setBookingData] = useState([]);
    const [movies, setMovies] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [timePeriod, setTimePeriod] = useState('Monthly');
    const [selectedRegion, setSelectedRegion] = useState("Worldwide");
    const regions = ["Worldwide", "USA", "India", "California", "Maharashtra", "Kerala", "TamilNadu", "AndhraPradesh", "Los Angeles"];
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const itemsPerPage = 10; // Number of rows per page
    function formatToRupees(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }
    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);
    const fetchBookings = async (page) => {
        setLoading(true);
        try {
            const response = await adminAuthenticate.get("/bookings", {
                params: {
                    page,
                    limit: itemsPerPage,
                },
            });
            console.log(response.data.bookings, "booking history");
            setBookings(response.data.bookings);
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
    const getRegionCode = (region) => {
        const regionMap = {
            "India": "IN",
            "USA": "US",
            "California": "US", // For states, you might not get specific results.
            "Maharashtra": "IN",
            "Los Angeles": "US",
        };
        return regionMap[region] || "US"; // Default to 'US' if the region is not mapped.
    };
    const getLanguageCodes = (region) => {
        const regionLanguageMap = {
            "India": "hi",
            "Kerala": "ml",
            "TamilNadu": "ta",
            "AndhraPradesh": "te",
            "USA": "en",
            "Worldwide": "en",
        };
        const languages = regionLanguageMap[region];
        console.log(`Languages for ${region}:`, languages); // Add logging to check
        return languages;
    };
    useEffect(() => {
        fetchOverview();
        fetchBookingTrends();
        fetchRevenueTrends();
        fetchMoviesByRegion(selectedRegion);
    }, [selectedRegion, timePeriod]);
    const fetchOverview = async () => {
        const response = await adminAuthenticate.get("/overview");
        console.log(response.data, "response from backend");
        setOverview(response.data.dashboardData);
    };
    const fetchBookingTrends = async () => {
        const response = await adminAuthenticate.get("/booking-trends", { params: { interval: timePeriod } });
        console.log(response.data, "bookingtrens");
        setBookingData(response.data.bookingTrend);
    };
    const fetchRevenueTrends = async () => {
        const response = await adminAuthenticate.get("/revenue-trends", { params: { interval: timePeriod } });
        setRevenueData(response.data.revenueTrend);
    };
    const fetchMoviesByRegion = async (region) => {
        try {
            let apiEndpoint = "";
            const languageCodes = getLanguageCodes(region);
            console.log('Language Codes:', languageCodes);
            if (region === "Worldwide") {
                apiEndpoint = `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbApiKey}`;
            }
            else {
                const regionCode = getRegionCode(region);
                // const languageParam = languageCodes.join(',');
                //console.log(languageParam,"languageParam");
                apiEndpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&region=${regionCode}&with_original_language=${languageCodes}`;
            }
            console.log("API Endpoint:", apiEndpoint);
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            console.log(data, "data");
            const regionMovies = data.results.slice(0, 10).map((movie) => ({
                title: movie.title,
                region: region,
                boxOffice: movie.vote_average + " / 10",
            }));
            setMovies(regionMovies);
        }
        catch (error) {
            console.error("Error fetching movies by region:", error);
        }
    };
    return (_jsx("div", { children: _jsx(SidebarMenu, { children: _jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-blue-600", children: "Admin Dashboard" }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { htmlFor: "region", className: "font-semibold mr-4", children: "Select Region:" }), _jsx("select", { id: "region", className: "border rounded p-2", value: selectedRegion, onChange: (e) => setSelectedRegion(e.target.value), children: regions.map((region, index) => (_jsx("option", { value: region, children: region }, index))) })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mt-8  text-gray-700", children: [_jsxs("div", { className: "bg-white text-center  align-text-top font-medium text-2xl shadow-lg rounded-md p-4", children: [_jsx("h2", { children: "Total Bookings" }), _jsx("p", { className: "text-3xl  align-text-bottom font-semibold text-gray-800", children: overview?.totalBookings })] }), _jsxs("div", { className: "bg-white text-center font-medium  text-2xl shadow-lg rounded-md p-4", children: [_jsx("h2", { children: "Total Revenue" }), _jsx("p", { className: "text-2xl font-semibold text-gray-800", children: formatToRupees(overview?.totalRevenue) })] }), _jsxs("div", { className: "bg-white  text-center font-medium text-2xl shadow-lg rounded-md p-4", children: [_jsx("h2", { children: "Cancelled Bookings" }), _jsx("p", { className: "text-2xl font-semibold text-gray-800", children: overview?.cancelledBookings })] }), _jsxs("div", { className: "bg-white  font-medium text-center text-2xl hadow-lg rounded-md p-4", children: [_jsx("h2", { children: "Active Users" }), _jsx("p", { className: "text-2xl font-semibold text-gray-800", children: overview?.activeUsers })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { htmlFor: "timePeriod", className: "font-semibold mr-4", children: "Select Time Period:" }), _jsxs("select", { id: "timePeriod", className: "border rounded p-2", value: timePeriod, onChange: (e) => setTimePeriod(e.target.value), children: [_jsx("option", { value: "Daily", children: "Daily" }), _jsx("option", { value: "Weekly", children: "Weekly" }), _jsx("option", { value: "Monthly", children: "Monthly" }), _jsx("option", { value: "Yearly", children: "Yearly" })] })] }), _jsxs("div", { className: "mt-8  grid  gap-12 grid-cols-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "Booking Trends" }), bookingData.length > 0 && (_jsx(Line, { data: {
                                            labels: bookingData.map((item) => item._id),
                                            datasets: [
                                                {
                                                    label: "Bookings",
                                                    data: bookingData.map((item) => item.totalBookings),
                                                    borderColor: "blue",
                                                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                                                    tension: 0.5,
                                                },
                                            ],
                                        } }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "Revenue Trends" }), revenueData.length > 0 && (_jsx(Bar, { data: {
                                            labels: revenueData.map((item) => item._id),
                                            datasets: [
                                                {
                                                    label: "Revenue",
                                                    data: revenueData.map((item) => item.totalRevenue),
                                                    backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0"],
                                                },
                                            ],
                                        } }))] })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("h2", { className: "text-xl font-bold mb-2", children: [selectedRegion, " - Top 10 Movies"] }), _jsxs("table", { className: "min-w-full bg-white shadow-md rounded-md", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Title" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Region" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Box Office" })] }) }), _jsx("tbody", { children: movies.map((movie, index) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "px-4 py-2", children: movie.title }), _jsx("td", { className: "px-4 py-2", children: movie.region }), _jsx("td", { className: "px-4 py-2", children: movie.boxOffice })] }, index))) })] })] }), loading ? (_jsx("p", { children: "Loading..." })) : (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl text-center font-bold my-4", children: "Order History" }), _jsxs("table", { className: "min-w-full bg-white  gap-4 shadow-md rounded-md mt-6", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-lg text-left", children: "Movie " }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "User" }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "Booking Date" }), _jsx("th", { className: "px-4 py-2  text-lg text-left", children: "Status" })] }) }), _jsx("tbody", { children: bookings.map((booking) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "px-4 py-2", children: booking.movieId.title }), _jsx("td", { className: "px-4 py-2", children: booking.userId ? booking.userId?.name : booking.screenData?.screenName }), _jsx("td", { className: "px-4 py-2", children: new Date(booking.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-4 py-2", children: booking.status })] }, booking._id))) })] }), _jsxs("div", { className: "flex justify-center items-center gap-2 mt-4", children: [_jsx("button", { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, className: `px-4 py-1  rounded-lg min-h-8  ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Prev" }), Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page == currentPage || page == currentPage - 1 || page == currentPage + 1).map(page => (_jsx("button", { onClick: () => paginate(page), className: `p-2 rounded-lg  min-h-8 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`, children: page }, page))), _jsx("button", { onClick: () => paginate(currentPage + 1), disabled: currentPage === totalPages, className: `px-4 py-1 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Next" })] })] }))] }) }) }));
};
export default Dashboard;

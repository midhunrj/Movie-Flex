import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import VehicleModal from "./vehicleModal";
import EditIcon from "@mui/icons-material/Edit";
import { FaAngleLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
const ticketImages = [
    "scooterImage",
    " bikeImage",
    "carImage",
    "jeepImage",
    "vanImage",
    "busImage",
];
const TheatreBooking = () => {
    const location = useLocation();
    const { movieId, theatreId, theatreName, screenName, movieName, SeatLayout, screenId, showtime, date, totalSeats, showtimeId } = location.state;
    console.log(showtimeId, "showtimeId");
    const { user } = useSelector((state) => state.user);
    const [seatLayout, setSeatLayout] = useState([]);
    const [seatNames, setSeatNames] = useState([]);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [showconfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ticketCount, setTicketCount] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Seat names updated:", seatNames);
    }, [seatNames]);
    useEffect(() => {
        const fetchSeatLayout = async () => {
            setLoading(true);
            try {
                console.log(screenId.tiers, "tier seats");
                console.log(seatLayout, "seatlayout after tiers from location state");
                setAvailableSeats(totalSeats);
            }
            catch (error) {
                console.error("Error fetching seat layout:", error);
                setError("Failed to load seat layout.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchSeatLayout();
    }, [theatreId, screenId, showtime]);
    const slideUpVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    };
    const backendSeatLayout = async () => {
        const response = await userAuthenticate.get('/screen-layout', {
            params: { showtimeId }, // Pass showtimeId as a query parameter
        });
        console.log(response.data, "response for seatLayout");
        setAvailableSeats(totalSeats);
        setSeatLayout(response.data.seatData);
    };
    useEffect(() => {
        const fetchSeatData = async () => {
            await backendSeatLayout();
        };
        fetchSeatData();
    }, [showtimeId,]);
    console.log(seatLayout, "seatlayout after tiers from backend");
    const handleSeatClick = (tierIndex, rowIndex, seatIndex) => {
        // const originalTierIndex = seatLayout.length - 1 - tierIndex;
        // const originalRowIndex = seatLayout[originalTierIndex].seatLayout.length - 1 - rowIndex;
        const updatedLayout = [...seatLayout];
        const seat = updatedLayout[tierIndex].rows[rowIndex].seats[seatIndex];
        if (!seat?.isBooked) {
            if (seat.isSelected) {
                console.log('jumbo');
                seat.isSelected = false;
                setSeatNames((prev) => prev.filter((name) => name != seat.seatLabel));
                setSelectedSeats(prev => prev - 1);
            }
            else if (selectedSeats < ticketCount) {
                console.log("sumbo");
                seat.isSelected = true;
                setSeatNames((prev) => [...prev, seat.seatLabel]);
                setSelectedSeats(prev => prev + 1);
            }
            else {
                console.log("vdfvdf");
                let clear = false;
                for (let tier of updatedLayout) {
                    for (let row of tier.rows) {
                        for (let s of row.seats) {
                            if (s.isSelected) {
                                s.isSelected = false;
                                console.log("jokr");
                                setSelectedSeats(prev => prev - 1);
                                setSeatNames((prev) => prev.filter((name) => name != s.seatLabel));
                                clear = true;
                                break;
                            }
                        }
                        if (clear) {
                            break;
                        }
                    }
                    if (clear) {
                        true;
                    }
                }
                console.log("fsd");
                seat.isSelected = true;
                setSeatNames((prev) => [...prev, seat.seatLabel]);
                setSelectedSeats(prev => prev + 1);
            }
            setSeatLayout(updatedLayout);
        }
    };
    const calculateTotalCost = () => {
        return seatLayout.reduce((total, tier) => {
            const selectedSeatsInTier = tier.rows
                .flatMap((row) => row.seats)
                .filter((seat) => seat.isSelected);
            return total + selectedSeatsInTier.length * tier.ticketRate;
        }, 0);
    };
    const calculateConvenienceFee = (baseCost) => {
        return (baseCost * 10.53) / 100;
    };
    const handleConfirmBooking = async () => {
        try {
            const selectedSeatsData = seatLayout
                .flatMap((tier) => tier.rows.flatMap((row) => row.seats))
                .filter((seat) => seat.isSelected);
            const totalCost = calculateTotalCost();
            const convenienceFee = calculateConvenienceFee(totalCost);
            const finalAmount = totalCost + convenienceFee;
            const response = await userAuthenticate.post('/book-tickets', {
                movieId,
                theatreId,
                screenId: screenId._id,
                showtimeId,
                selectedSeats: seatNames,
                totalPrice: calculateTotalCost(),
                userId: user?._id,
            });
            const { bookingId } = response.data;
            navigate("/payment-page", {
                state: {
                    selectedSeats,
                    totalCost,
                    convenienceFee,
                    finalAmount,
                    movieName,
                    theatreName,
                    date,
                    bookingId,
                    seatNames,
                    showtime,
                },
            });
        }
        catch (error) {
            console.error("Booking failed:", error);
        }
    };
    if (loading)
        return _jsx("p", { className: "text-center text-lg", children: "Loading seat layout..." });
    if (error)
        return _jsx("p", { className: "text-center text-red-500", children: error });
    const handleModalClose = () => setShowModal(false);
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx(VehicleModal, { open: showModal, onClose: handleModalClose, ticketCount: ticketCount, setTicketCount: setTicketCount }), _jsxs("div", { className: "flex gap-4 shadow-sm rounded-md bg-gray-200 justify-between", children: [_jsxs("div", { className: "ml-4", children: [_jsxs("div", { className: "flex items-center  -space-x-12", children: [_jsx("button", { onClick: () => navigate(-1), children: _jsx(FaAngleLeft, { size: 25 }) }), " ", _jsx("h2", { className: "text-2xl font-bold", children: "Theatre Details" })] }), _jsxs("p", { children: ["Movie: ", movieName] }), _jsxs("p", { children: ["Theatre: ", theatreName] }), _jsxs("p", { children: ["Showtime: ", showtime] }), _jsxs("p", { children: ["Date: ", date] })] }), _jsx("div", { className: "mr-4 mt-2", children: _jsxs("button", { onClick: () => setShowModal(true), className: "w-fit py-2 px-3 min-h-12  shadow-md border rounded-lg bg-yellow-100  text-gray-800", children: [" ", _jsx(EditIcon, { onClick: () => setShowModal(true), className: "text-gray-800 cursor-pointer w-8 h-8" }), ticketCount, " tickets"] }) })] }), _jsxs("div", { className: "mt-6 space-x-12", children: [_jsx("h3", { className: "text-xl text-center font-semibold ", children: "Seating Information" }), _jsxs("div", { className: "flex justify-center gap-4 my-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-green-500 rounded-md" }), _jsx("p", { className: "text-sm", children: "Selected" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-white border rounded-md" }), _jsx("p", { className: "text-sm", children: "Available" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-gray-600 rounded-md" }), _jsx("p", { className: "text-sm text-gray-600", children: "Booked" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 bg-gray-400 rounded-md" }), _jsx("p", { className: "text-sm text-gray-600", children: "Reserved" })] })] }), seatLayout
                        .slice()
                        .reverse()
                        .map((tier, reverseTierIndex) => {
                        const tierIndex = seatLayout.length - 1 - reverseTierIndex;
                        return (_jsxs("div", { className: "my-4", children: [_jsx("h4", { className: "font-semibold text-lg text-slate-900", children: tier.tierName }), _jsxs("p", { className: "text-gray-600", children: ["Price: \u20B9", tier.ticketRate] }), _jsx("div", { className: "mt-2", children: tier.rows
                                        .slice()
                                        .reverse()
                                        .map((row, rowIndex) => (_jsx("div", { className: "flex justify-center gap-2 mb-2", children: row.seats.map((seat, seatIndex) => (_jsx("button", { onClick: () => handleSeatClick(tierIndex, tier.rows.length - 1 - rowIndex, seatIndex), disabled: seat.isBooked, className: `w-10 h-10 border transition rounded-md ${seat.isPartition
                                                ? "bg-transparent border-none"
                                                : seat.isBooked
                                                    ? "bg-gray-600 text-white cursor-not-allowed"
                                                    : seat.isSelected
                                                        ? "bg-green-500 text-white"
                                                        : seat.isReserved
                                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                                            : "bg-white hover:bg-gray-800 hover:text-white"}`, children: seat.seatLabel }, seatIndex))) }, rowIndex))) }), tierIndex > 0 && (_jsx("div", { className: "border-t-2  border-gray-300 my-2" }))] }, tierIndex));
                    })] }), _jsxs("div", { className: "relative w-[75%] mx-[12.5%] h-8 bg-gray-700 rounded-t-xl overflow-hidden mt-8", children: [_jsx("div", { className: "absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60" }), _jsx("p", { className: "text-center text-white text-xs uppercase tracking-wider absolute inset-0 flex items-center justify-center", children: "Screen" })] }), selectedSeats > 0 ?
                _jsxs(motion.div, { className: "mt-4 bg-gray-200 p-4 rounded-lg", initial: "hidden", animate: "visible", exit: "hidden", variants: slideUpVariants, children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { children: "Selected Seats:" }), _jsx("span", { children: seatNames.join(", ") })] }), _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total Price:" }), _jsxs("span", { children: ["\u20B9", calculateTotalCost()] })] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: () => setShowConfirmModal(true), className: "bg-blue-600 text-white  w-fit min-h-8 flex justify-center py-2 px-4 rounded hover:bg-blue-700", children: "Book Tickets" }) })] })
                : _jsx(_Fragment, {}), _jsx(Modal, { open: showconfirmModal, onClose: () => setShowModal(false), children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md w-96 mx-auto mt-24", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Confirm Booking" }), _jsxs("p", { children: ["Selected Seats: ", selectedSeats] }), _jsxs("p", { children: ["Total Price: \u20B9", calculateTotalCost()] }), _jsx("button", { onClick: handleConfirmBooking, className: "mt-4 bg-green-600 text-white min-h-8 py-2 px-4 rounded hover:bg-green-700", children: "Confirm" })] }) })] }));
};
export default TheatreBooking;

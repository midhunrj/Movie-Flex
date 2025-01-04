import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "@mui/material";
// Mocked vehicle data
const vehicles = [
    { type: "Bicycle", seatCount: 1, image: "/uploads/Bicycle.png" },
    { type: "Scooter", seatCount: 2, image: "/uploads/scooter.svg" },
    { type: "Bike", seatCount: 3, image: "/uploads/bike.png" },
    { type: "Car", seatCount: 5, image: "/uploads/Car.png" },
    { type: "Mini-Van", seatCount: 7, image: "/uploads/mini-van.jpeg" },
    { type: "Van", seatCount: 8, image: "/uploads/van.jpeg" },
    { type: "Bus", seatCount: 10, image: "/uploads/bus.svg" },
];
const getVehicleDetails = (seatCount) => {
    const vehicle = vehicles.find((v) => seatCount <= v.seatCount);
    return vehicle
        ? {
            icon: vehicle.image.endsWith(".svg") ? (_jsx("img", { src: vehicle.image, alt: vehicle.type, className: "w-40 h-40" })) : (_jsx("img", { src: vehicle.image ? vehicle.image : "/uploads/fallback_profile.jpeg", alt: vehicle.type, className: "w-40 h-40 object-cover rounded" })),
            color: seatCount <= 5 ? "green" : seatCount <= 8 ? "orange" : "red",
        }
        : {
            icon: (_jsx("img", { src: "/uploads/fallback_profile.jpeg", alt: "Fallback", className: "w-40 h-40 object-cover rounded" })),
            color: "gray",
        };
};
const VehicleModal = ({ open, onClose, ticketCount, setTicketCount, }) => {
    const { icon, color } = getVehicleDetails(ticketCount);
    return (_jsx(Modal, { open: open, onClose: onClose, style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Light grey overlay with reduced opacity
        }, children: _jsxs("div", { className: "p-6 bg-white rounded shadow-md w-1/2 h-auto relative", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-center", children: "Choose Number of Tickets" }), _jsx("p", { className: "mb-4 text-center", children: "Select a ticket count to see the associated vehicle." }), _jsx("div", { className: "flex justify-center items-center mb-6", children: _jsx("div", { className: " rounded p-4 flex justify-center items-center", style: { color, borderColor: color }, children: icon }) }), _jsx("div", { className: "flex justify-center gap-2 mb-4", children: Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (_jsx("button", { onClick: () => setTicketCount(num), className: `p-2 w-10 h-10 text-center rounded ${ticketCount === num
                            ? "bg-[#2c698d] text-white"
                            : "bg-gray-200 hover:bg-gray-300"}`, children: num }, num))) }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: onClose, className: "bg-[#090910] text-white opacity-90 mt-8 w-36 hover:opacity-100  text-center min-h-12   p-4  rounded hover:bg-red-600", children: "select seats" }) })] }) }));
};
export default VehicleModal;

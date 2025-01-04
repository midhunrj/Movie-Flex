import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BookingCard = ({ booking, isLast, canCancelBooking, cancelBooking, setSelectedBooking, }) => {
    const formattedDate = format(new Date(booking?.createdAt), 'PPpp');
    const qrValue = `
    Booking ID: ${booking?._id}
    Movie: ${booking?.movieId?.title}
    Theatre: ${booking?.theatreDetails?.name}
    Seats: ${booking?.screenData?.tierName} ${booking?.selectedSeats.join(', ')}
    Showtime: ${booking?.showtimeId?.showtime}
  `;
    return (_jsxs("div", { 
        //ref={isLast ? lastBookingRef : null}
        className: "bg-white shadow-md rounded-lg p-4 h-[32rem] hover:scale-105 cursor-pointer transition-all", children: [_jsx("img", { src: `${TMDB_IMAGE_BASE_URL}/${booking?.movieId?.poster_path || 'fallback.jpg'}`, alt: booking?.movieId?.title || 'Movie Poster', className: "w-full h-48 object-fill rounded-md mb-4" }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-bold mb-2", children: booking?.movieId?.title }), _jsxs("p", { children: [_jsx("strong", { children: "Theatre:" }), " ", booking?.theatreDetails?.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Screen:" }), " ", booking?.screenData?.screenName, " (", booking?.screenData?.screenType, ")"] }), booking?.showtimeId?.showtime && (_jsxs("p", { children: [_jsx("strong", { children: "Showtime:" }), " ", booking?.showtimeId?.showtime] })), _jsxs("p", { children: [_jsx("strong", { children: "Total Price:" }), " \u20B9", booking?.totalPrice] }), _jsxs("p", { children: [_jsx("strong", { children: "Seats:" }), " ", booking?.screenData?.tierName, ' ', booking?.selectedSeats.join(', ')] })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx(QRCodeCanvas, { value: qrValue }), _jsx("span", { className: "text-lg font-bold", children: booking?.bookingId }), _jsx("span", { className: "text-md text-blue-600 mt-4 mx-2 hover:text-blue-400 hover:underline cursor-pointer", onClick: () => setSelectedBooking(booking), children: "View Info" })] })] }), booking && canCancelBooking(booking?.showtimeId?.showtime, booking?.showtimeId?.date) && booking?.status !== 'Cancelled' ? (_jsx("button", { onClick: () => cancelBooking(booking?._id, booking.totalPrice), className: "bg-gradient-to-r from-red-500 to-indigo-500 text-white w-fit h-fit px-4 py-2 transition-all rounded-md hover:bg-red-600", children: "Cancel Booking" })) : booking?.status === 'Cancelled' ? (_jsx("div", { className: "flex justify-center", children: _jsx("span", { className: "text-red-500 bg-yellow-200 rounded-md p-1 font-semibold", children: "Ticket is Cancelled" }) })) : (_jsx("div", { className: "flex justify-center", children: _jsx("span", { className: "text-gray-800 bg-blue-200 rounded-md p-1 font-semibold", children: "Ticket is Used" }) })), _jsx("div", { className: "flex justify-start mt-4", children: _jsxs("span", { className: "text-sm", children: ["Booking date and time: ", formattedDate] }) })] }));
};
export default BookingCard;

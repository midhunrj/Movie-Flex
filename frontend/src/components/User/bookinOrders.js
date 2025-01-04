import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import Header from './header';
import Footer from './footer';
import { Modal, Button } from 'antd';
import * as QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { useSelector } from 'react-redux';
import BookingCard from './bookingCard';
const BookingOrders = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { user } = useSelector((state) => state.user);
    const userId = user?._id;
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    //  const [hasMore, setHasMore] = useState(true); // Tracks if there's more data to load
    const observer = useRef(null);
    const limit = 12;
    const paginate = (page) => setCurrentPage(page);
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const fetchBookings = async () => {
        try {
            const response = await userAuthenticate.get('/bookings-history', {
                params: { userId, page: currentPage, limit },
            });
            console.log(response.data, "response from movies orders");
            const newBookings = response.data.bookingData;
            setBookings(newBookings);
            setTotalPages(response.data.totalPages);
            //setHasMore(newBookings.length === limit); 
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBookings();
    }, [currentPage]);
    const cancelBooking = async (bookingId, refundAmount) => {
        console.log(bookingId, "bookingId going through,qyery");
        await userAuthenticate.put(`/cancel-Booking`, { refundAmount }, {
            params: { bookingId: bookingId },
        });
        //  console.log(response.data);
        fetchBookings();
    };
    // const downloadInvoice = async (booking: BookingType) => {
    //   const element = document.getElementById('booking-details');
    //   if (element) {
    //     const canvas = await html2canvas(element);
    //     const data = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const imgProperties = pdf.getImageProperties(data);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    //     pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save(`Booking_Invoice_${booking._id}.pdf`);
    //   }
    // };
    const qrRef = useRef(null);
    const downloadInvoice = async (booking) => {
        if (booking == undefined) {
            return;
        }
        const pdf = new jsPDF();
        // Define convenience rate and calculate the final amount
        const convenienceRate = booking.totalPrice * 0.1053;
        const totalAmount = booking.totalPrice + convenienceRate;
        // // Add logo image
        // const logoImageURL = `${TMDB_IMAGE_BASE_URL}/${booking.movieId.poster_path}`;
        // const logoImage = await fetch(logoImageURL)
        //   .then((res) => res.blob())
        //   .then((blob) => new Promise<string>((resolve) => {
        //     const reader = new FileReader();
        //     reader.onloadend = () => resolve(reader.result as string);
        //     reader.readAsDataURL(blob);
        //   }));
        // pdf.addImage(logoImage, "PNG", 10, 10, 30, 30);
        // Title
        pdf.setFontSize(16);
        pdf.text("Booking Invoice", 105, 20, { align: "center" });
        // Booking details
        pdf.setFontSize(12);
        pdf.text(`Booking ID: ${booking.bookingId}`, 20, 40);
        pdf.text(`Movie: ${booking.movieId?.title}`, 20, 50);
        pdf.text(`Theatre: ${booking.theatreDetails?.name}`, 20, 60);
        pdf.text(`Address: ${booking.theatreDetails?.address?.place}, ${booking.theatreDetails?.address?.city}, ${booking.theatreDetails?.address?.district}, ${booking.theatreDetails?.address?.state}`, 20, 70);
        pdf.text(`Screen: ${booking.screenData?.screenName} (${booking.screenData?.screenType})`, 20, 80);
        pdf.text(`Seats: ${booking.screenData?.tierName} - ${booking.selectedSeats?.join(", ")}`, 20, 90);
        pdf.text(`Showtime: ${booking.showtimeId?.showtime} on ${booking.showtimeId?.date}`, 20, 100);
        // Pricing details
        pdf.text(`Total Price: ₹${booking.totalPrice}`, 20, 120);
        pdf.text(`Convenience Rate (10.53%): ₹${convenienceRate.toFixed(2)}`, 20, 130);
        pdf.setFontSize(14);
        pdf.text(`Amount Paid: ₹${totalAmount.toFixed(2)}`, 20, 150);
        // Generate QR Code and add to PDF
        const qrCodeData = `Booking ID: ${booking.bookingId}, Movie: ${booking.movieId?.title}, Amount: ₹${totalAmount.toFixed(2)}`;
        const qrCodeCanvas = qrRef.current; // Access the QR code's canvas element
        if (qrCodeCanvas) {
            const qrCodeBase64 = qrCodeCanvas.toDataURL(qrCodeData); // Get base64 image
            pdf.addImage(qrCodeBase64, "PNG", 150, 250, 40, 40);
            // Footer
        }
        pdf.setFontSize(10);
        pdf.text("Thank you for booking with us!", 105, 280, { align: "center" });
        // Save the PDF
        pdf.save(`Booking_Invoice_${booking.bookingId}.pdf`);
    };
    const handleModalClose = () => {
        setSelectedBooking(null);
    };
    const canCancelBooking = (showtime, showDate) => {
        if (showtime) {
            const now = new Date();
            console.log(now, "Current local time");
            const [hours, minutes] = showtime.split(":").map(Number);
            const showtimeDate = new Date(showDate);
            showtimeDate.setHours(hours, minutes, 0, 0);
            console.log(showtimeDate, "Showtime as Date");
            const oneHourBeforeShowtime = new Date(showtimeDate.getTime() - 60 * 60 * 1000);
            console.log(oneHourBeforeShowtime, "One hour before showtime");
            return now < showtimeDate && now < oneHourBeforeShowtime;
        }
        else {
            return false;
        }
    };
    // const lastBookingRef = useCallback(
    //   (node:any) => {
    //     if (loading) return;
    //     if (observer.current) observer.current.disconnect();
    //     observer.current = new IntersectionObserver((entries) => {
    //       if (entries[0].isIntersecting && hasMore) {
    //         setCurrentPage((prevPage) => prevPage + 1);
    //       }
    //     });
    //     if (node) observer.current.observe(node);
    //   },
    //   [loading, hasMore]
    // );
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-col items-center bg-gray-200 min-h-screen  p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Order History" }), loading ? (_jsx("p", { children: "Loading bookings..." })) : bookings.length === 0 ? (_jsx("p", { children: "No bookings found." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3  lg:grid-cols-3 gap-6 w-full  max-w-[90rem]", children: bookings.map((booking, index) => (_jsx(BookingCard, { booking: booking, isLast: index === bookings.length - 1, 
                                    // lastBookingRef={index === bookings.length - 1 ? lastBookingRef : null}
                                    canCancelBooking: canCancelBooking, cancelBooking: cancelBooking, setSelectedBooking: setSelectedBooking }, index))) }), _jsxs("div", { className: "flex justify-center items-center gap-2 mt-4", children: [_jsx("button", { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, className: `px-4 py-1  rounded-lg min-h-8  ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Prev" }), Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page == currentPage || page == currentPage - 1 || page == currentPage + 1).map(page => (_jsx("button", { onClick: () => paginate(page), className: `p-2 rounded-lg  min-h-8 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`, children: page }, page))), _jsx("button", { onClick: () => paginate(currentPage + 1), disabled: currentPage === totalPages, className: `px-4 py-1 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`, children: "Next" })] })] })), selectedBooking && (_jsx(Modal, { visible: !!selectedBooking, onCancel: handleModalClose, footer: [
                            _jsx(Button, { className: 'min-h-8 w-fit', onClick: () => downloadInvoice(selectedBooking), type: "primary", children: "Download Invoice" }, "download"),
                            _jsx(Button, { className: 'min-h-8', onClick: handleModalClose, children: "Close" }, "close"),
                        ], children: _jsxs("div", { id: "booking-details", className: " flex justify-between", children: [_jsx("img", { src: `${TMDB_IMAGE_BASE_URL}/${selectedBooking.movieId?.posterUrl}`, alt: selectedBooking.movieId?.title, className: 'w-60 my-6 h-72 p-2 ' }), _jsxs("div", { className: 'flex-col gap-1', children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: selectedBooking?.movieId?.title }), _jsxs("p", { children: [_jsx("strong", { children: "Theatre:" }), " ", selectedBooking?.theatreDetails?.name, _jsx("br", {}), selectedBooking?.theatreDetails?.address?.place, ",", selectedBooking.theatreDetails?.address?.city, ",", selectedBooking.theatreDetails?.address?.district, ",", selectedBooking.theatreDetails?.address?.state] }), _jsxs("p", { children: [_jsx("strong", { children: "Screen:" }), " ", selectedBooking?.screenData?.screenName, " (", selectedBooking?.screenData?.screenType, ")"] }), _jsxs("p", { children: [_jsxs("span", { className: 'text-sm', children: [_jsx("strong", { children: "Quantity " }), ":", selectedBooking?.selectedSeats?.length] }), _jsx("br", {}), _jsx("strong", { children: "Seats:" }), selectedBooking.screenData?.tierName, " ", selectedBooking?.selectedSeats?.join(', ')] }), _jsxs("p", { children: [_jsx("strong", { children: "Total Price:" }), " \u20B9", selectedBooking.totalPrice] }), _jsx(QRCode.QRCodeCanvas, { value: `Booking ID: ${selectedBooking._id}\nMovie: ${selectedBooking.movieId?.title}\nTheatre: ${selectedBooking.theatreDetails?.name}\nShowtime: ${selectedBooking.showtimeId?.showtime}`, size: 128 }), _jsx("span", { className: 'text-2xl font-bold ', children: selectedBooking.bookingId })] })] }) }))] }), _jsx(Footer, {})] }));
};
export default BookingOrders;
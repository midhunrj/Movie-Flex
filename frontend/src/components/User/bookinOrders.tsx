import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import * as QRCode from 'qrcode.react';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { BookingType } from '@/types/bookingOrderTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
const BookingOrders = () => {
  const [bookings, setBookings] = useState<Partial<BookingType[]>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const fetchBookings = async () => {
    try {
      const response = await userAuthenticate.get('/bookings-history', {
        params: { userId },
      });
      console.log(response.data, "response from movies orders");

      setBookings(response.data.bookingData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId: string) => {
        console.log(bookingId,"bookingId going through,qyery");
        
        await userAuthenticate.put(`/cancel-Booking`, {}, {
          params: { bookingId: bookingId }, 
        });
  //  console.log(response.data);
   
      fetchBookings();
   
  };

  const canCancelBooking = (showtime: string | undefined): boolean => {
    // Check if the showtime is valid
    if (!showtime || typeof showtime !== "string") {
      console.error("Invalid or undefined showtime:", showtime);
      return false; // Return false if showtime is not valid
    }
  
    const now = new Date(); // Current time (local)
    console.log(now, "Current local time");
  
    // Convert the `showtime` string to a Date object with today's date
    const [hours, minutes] = showtime.split(":").map(Number); // Extract hours and minutes
    const showtimeDate = new Date();
    showtimeDate.setHours(hours, minutes, 0, 0); // Set the time on the date object
    console.log(showtimeDate, "Showtime as Date");
  
    // Calculate one hour before the showtime
    const oneHourBeforeShowtime = new Date(showtimeDate.getTime() - 60 * 60 * 1000);
    console.log(oneHourBeforeShowtime, "One hour before showtime");
  
    return now < showtimeDate && now < oneHourBeforeShowtime;
  };
  
  

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-gray-200 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {bookings.map((booking) => (
              <div key={booking?._id} className="bg-white shadow-md rounded-lg p-4 h-[28rem]  hover:scale-105 cursor-pointer transition-all">
                <img
                  src={`${TMDB_IMAGE_BASE_URL}/${booking!.movieId.poster_path!}`}
                  alt={booking?.movieId?.title}
                  className="w-full h-48 object-fill rounded-md mb-4"
                />
                <h2 className="text-lg font-bold mb-2">{booking?.movieId?.title}</h2>
                <p>
                  <strong>Theatre:</strong> {booking?.theatreDetails?.name}
                </p>
                <p>
                  <strong>Screen:</strong> {booking?.screenData?.screenName} ({booking?.screenData?.screenType})
                </p>
                {booking?.showtimeId?.showtime?<p>
                  <strong>Showtime:</strong> {booking?.showtimeId?.showtime}
                </p>:<></>}
                <p>
                  <strong>Total Price:</strong> ₹{booking?.totalPrice}
                </p>
                <p>
                  <strong>Seats:</strong> {booking?.screenData?.tierName} &nbsp; {booking?.selectedSeats.join(', ')}
                </p>
                {booking?(canCancelBooking(booking?.showtimeId?.showtime!) && booking?.status !== 'Cancelled' ?(
                  <button
                    onClick={() => cancelBooking(booking?._id!)}
                    className="mt-4 bg-gradient-to-r from-red-500 to-indigo-500 text-white w-fit px-4 py-2 min-h-8 transition-all  rounded-md hover:bg-red-600 hover:text-gray-300"
                  >
                    Cancel Booking
                  </button>
                ):( booking?.status === 'Cancelled' ? (
                  <span className="mt-4 text-red-500 rounded-md bg-yellow-200 w-fit min-h-12  p-1 font-semibold">Ticket is Cancelled</span>):null)):<></>}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingOrders;

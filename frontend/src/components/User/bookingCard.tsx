import React, { useState } from 'react';
import {QRCodeCanvas, QRCodeSVG} from 'qrcode.react';
import { format } from 'date-fns';
import { BookingType } from '@/types/bookingOrderTypes';
import { Button, QRCode } from 'antd';
import { Modal } from 'antd';

type BookingProps = {
  _id?: string;
  createdAt: string;
  movieId: {
    title: string;
    poster_path?: string;
  };
  theatreDetails: {
    name: string;
  };
  screenData: {
    screenName: string;
    screenType: string;
    tierName: string;
  };
  showtimeId: {
    showtime: string;
    date: string;
  };
  totalPrice: number;
  selectedSeats: string[];
  bookingId: string;
  status: string;
};

type BookingCardProps = {
  booking: BookingType;
  isLast: boolean;

  canCancelBooking: (showtime: string, date: string) => boolean;
  cancelBooking: (id: string, price: number) => void;
  setSelectedBooking: (booking: Partial<BookingType>) => void;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isLast,
  
  canCancelBooking,
  cancelBooking,
  setSelectedBooking,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const formattedDate = format(new Date(booking?.createdAt), 'PPpp');
  const handleCancel = () => {
    cancelBooking(booking?._id!, booking.totalPrice!);
    setIsModalVisible(false); // Close modal after confirmation
  };
  const qrValue = `
    Booking ID: ${booking?._id}
    Movie: ${booking?.movieId?.title}
    Theatre: ${booking?.theatreDetails?.name}
    Seats: ${booking?.screenData?.tierName} ${booking?.selectedSeats.join(', ')}
    Showtime: ${booking?.showtimeId?.showtime}
  `;

  return (
    <div
      //ref={isLast ? lastBookingRef : null}
      className="bg-white shadow-md rounded-lg p-4 h-[34rem] hover:scale-105 cursor-pointer transition-all"
    >
      <img
        src={`${TMDB_IMAGE_BASE_URL}/${booking?.movieId?.poster_path || 'fallback.jpg'}`}
        alt={booking?.movieId?.title || 'Movie Poster'}
        className="w-full h-60  object-fill rounded-md mb-4"
      />
      <div className="flex justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold mb-2">{booking?.movieId?.title}</h2>
          <p>
            <strong>Theatre:</strong> {booking?.theatreDetails?.name}
          </p>
          <p>
            <strong>Screen:</strong> {booking?.screenData?.screenName} ({booking?.screenData?.screenType})
          </p>
          {booking?.showtimeId?.showtime && (
            <p>
              <strong>Showtime:</strong> {booking?.showtimeId?.showtime}
            </p>
          )}
          <p>
            <strong>Total Price:</strong> ₹{booking?.totalPrice}
          </p>
          <p>
            <strong>Seats:</strong> {booking?.screenData?.tierName}{' '}
            {booking?.selectedSeats.join(', ')}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <QRCodeCanvas value={qrValue} />
          <span className="text-lg font-bold">{booking?.bookingId}</span>
          <span
            className="text-md text-blue-600 mt-4 mx-2 hover:text-blue-400 hover:underline cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            View Info
          </span>
        </div>
      </div>
      {booking && canCancelBooking(booking?.showtimeId?.showtime, booking?.showtimeId?.date) && booking?.status !== 'Cancelled' ? (
        <button
          onClick={() => setIsModalVisible(true)}
          className="bg-gradient-to-r from-red-500 to-indigo-500 text-white w-fit h-fit px-4 py-2 transition-all rounded-md hover:bg-red-600"
        >
          Cancel Booking
        </button>
      ) : booking?.status === 'Cancelled' ? (
        <div className="flex justify-center">
          <span className="text-red-500 bg-yellow-200 rounded-md p-1 font-semibold">
            Ticket is Cancelled
          </span>
        </div>
      ) : (
        <div className="flex justify-center">
          <span className="text-gray-800 bg-blue-200 rounded-md p-1 font-semibold">
            Ticket is Used
          </span>
        </div>
      )}
      <div className="flex justify-start mt-4">
        <span className="text-sm">Booking date and time: {formattedDate}</span>
      </div>

      <Modal
        title="Cancel Booking"
        visible={isModalVisible}
        footer={[
          <Button
            key="no"
            onClick={() => setIsModalVisible(false)}
            // style={{ backgroundColor: '#f0f0f0', color: '#000' }}
            className='bg-red-500 text-white w-fit h-fit hover:text-gray-100 hover:bg-blue-600'
         >
            No, Keep Booking
          </Button>,
          <Button
            key="yes"
            onClick={handleCancel}
            // style={{ backgroundColor: '#ff4d4f', color: '#fff' }}
          className='bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100'
          >
            Yes, Cancel
          </Button>,
        ]}

        centered
        className='w-fit h-fit'
        
        // cancelText="No, Keep Booking"
      >
        <p>Are you sure you want to cancel this booking?</p>
        <p>
          <strong>Movie:</strong> {booking?.movieId?.title}
        </p>
        <p>
          <strong>Theatre:</strong> {booking?.theatreDetails?.name}
        </p>
      </Modal>
    </div>
  );
};

export default BookingCard;

// lastBookingRef: React.Ref<HTMLDivElement> | null;
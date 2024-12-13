import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import {Modal,Button} from 'antd'
import * as QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { BookingType } from '@/types/bookingOrderTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { format } from 'date-fns';

const BookingOrders = () => {
  const [bookings, setBookings] = useState<Partial<BookingType[]>>([]);
  const [loading, setLoading] = useState(true);
  const[selectedBooking,setSelectedBooking]=useState<Partial<BookingType|null>>(null)
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id!;

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

  const cancelBooking = async (bookingId: string,refundAmount:number) => {
        console.log(bookingId,"bookingId going through,qyery");
        
        await userAuthenticate.put(`/cancel-Booking`, {refundAmount}, {
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
  const qrRef = useRef<HTMLCanvasElement>(null);
const downloadInvoice = async (booking: BookingType) => {
  const pdf = new jsPDF();

  // Define convenience rate and calculate the final amount
  const convenienceRate = booking.totalPrice! * 0.1053;
  const totalAmount = booking.totalPrice! + convenienceRate;

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
  pdf.text(
    `Address: ${booking.theatreDetails?.address?.place}, ${booking.theatreDetails?.address?.city}, ${booking.theatreDetails?.address?.district}, ${booking.theatreDetails?.address?.state}`,
    20,
    70
  );
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
  const canCancelBooking = (showtime: string,showDate:string): boolean => {
    
    if (showtime)
    {
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
    else{
      return false
    }
  }
  
  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-gray-200 min-h-screen  p-4">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-3 gap-6 w-full  max-w-[90rem]">
            {bookings.slice().reverse().map((booking) => (
              <div key={booking?._id} className="bg-white   shadow-md rounded-lg p-4 h-[32rem]  hover:scale-105 cursor-pointer transition-all"
             >
                <img
                  src={`${TMDB_IMAGE_BASE_URL}/${booking!.movieId.poster_path!}`}
                  alt={booking?.movieId?.title}
                  className="w-full h-48 object-fill rounded-md mb-4"
                />
                <div className='flex justify-between gap-4'>
                 <div className=' flex justify-start flex-col'> 
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
                </div>
                 {/* {console.log(booking?._id,"booking")}  */}
                <div className="flex justify-end flex-col">
                  
                    <QRCode.QRCodeSVG
                      value={`Booking ID: ${booking?._id}\nMovie: ${booking?.movieId?.title}\nTheatre: ${booking?.theatreDetails?.name}\n Seats:${booking?.screenData?.tierName}  ${booking?.selectedSeats.join(',')}  \nShowtime: ${booking?.showtimeId?.showtime }`}
                    />
                    <span className='text-lg font-bold'>{booking?.bookingId}</span>

                    <span className='text-md text-blue-600 mt-4 mx-2 hover:text-blue-400 hover:underline'  onClick={() => setSelectedBooking(booking!)}>view info</span>
                  </div>

                </div>
                {booking?(canCancelBooking(booking?.showtimeId?.showtime!,booking?.showtimeId?.date!) && booking?.status !== 'Cancelled' ?(
                 <div> <button
                    onClick={() => cancelBooking(booking?._id!,booking.totalPrice!)}
                    className=" bg-gradient-to-r from-red-500 to-indigo-500 text-white w-fit px-4 py-2 min-h-8 transition-all  rounded-md hover:bg-red-600 hover:text-gray-300"
                  >
                    Cancel Booking
                  </button>
                  </div>
                  
                ):( booking?.status === 'Cancelled' ? (
                  <div className=' flex justify-center'>
                  <span className=" text-red-500 rounded-md  bg-yellow-200 w-fit min-h-8 transition  p-1 font-semibold">Ticket is Cancelled</span></div>)
                  : <div className=' flex justify-center'>
                  <span className=" text-gray-800 rounded-md  bg-blue-200 w-fit min-h-8 transition  p-1 font-semibold">Ticket is Used</span></div>)):<></>}
                  <div className='flex justify-start mt-4 '>
              <span className='text-sm '>Booking date and time: {format(new Date(booking?.createdAt!), 'PPpp')}</span>
              </div>
              </div>
              
            ))}

            
            
          </div>
          
        )}
    {/* <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
  {/* <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={value}
    viewBox={`0 0 256 256`}
  /> */}
  
{/* </div> */} 
{selectedBooking && (
          <Modal
            visible={!!selectedBooking}
            onCancel={handleModalClose}
            footer={[
              <Button
                key="download"
                className='min-h-8 w-fit'
                onClick={() => downloadInvoice(selectedBooking)}
                type="primary"
              >
                Download Invoice
              </Button>,
              <Button key="close" className='min-h-8' onClick={handleModalClose}>
                Close
              </Button>,
            ]}
          >
            <div id="booking-details" className=" flex justify-between">
            <img src={`${TMDB_IMAGE_BASE_URL}/${selectedBooking!.movieId?.posterUrl}`} alt={selectedBooking.movieId?.title} className='w-60 my-6 h-72 p-2 '/>
           
              <div className='flex-col gap-1'>
              
              <h2 className="text-xl font-bold mb-4">{selectedBooking?.movieId?.title}</h2>
              <p>
                <strong>Theatre:</strong> {selectedBooking?.theatreDetails?.name}<br/>
                {selectedBooking?.theatreDetails?.address?.place},{selectedBooking.theatreDetails?.address?.city},{selectedBooking.theatreDetails?.address?.district},{selectedBooking.theatreDetails?.address?.state}
              </p>
              <p>
                <strong>Screen:</strong> {selectedBooking?.screenData?.screenName} (
                {selectedBooking?.screenData?.screenType})
              </p>
              <p>
                <span className='text-sm'><strong>Quantity </strong>:{selectedBooking?.selectedSeats?.length}</span><br/>
                <strong>Seats:</strong>{selectedBooking.screenData?.tierName} {selectedBooking?.selectedSeats?.join(', ')}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{selectedBooking.totalPrice}
              </p>
              <QRCode.QRCodeCanvas
                  value={`Booking ID: ${selectedBooking._id}\nMovie: ${selectedBooking.movieId?.title}\nTheatre: ${selectedBooking.theatreDetails?.name}\nShowtime: ${selectedBooking.showtimeId?.showtime}`}
                  size={128}
                />
               
                <span className='text-2xl font-bold '>{selectedBooking.bookingId}</span>
              
              </div>
              
                
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingOrders;

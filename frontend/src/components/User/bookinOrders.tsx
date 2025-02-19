import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import {Modal,Button} from 'antd'
import * as QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { BookingType } from '@/types/bookingOrderTypes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { format } from 'date-fns';
import BookingCard from './bookingCard';
import { updateWalletBalance } from '@/redux/user/userSlice';

const BookingOrders = () => {
  const [bookings, setBookings] = useState<Partial<BookingType[]>>([]);
  const [loading, setLoading] = useState(true);
  const[selectedBooking,setSelectedBooking]=useState<Partial<BookingType>|null>(null)
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id!;
  const dispatch=useDispatch()
  const [totalPages, setTotalPages] = useState(1)
 const [currentPage,setCurrentPage]=useState(1)
//  const [hasMore, setHasMore] = useState(true); // Tracks if there's more data to load
 const observer = useRef<IntersectionObserver | null>(null);
const limit=12
 const paginate=(page:number)=>setCurrentPage(page)
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const qrRef = useRef<HTMLCanvasElement>(null);
  const fetchBookings = async () => {
    try {
       setLoading(true)
      const response = await userAuthenticate.get('/bookings-history', {
        params: { userId,page:currentPage,limit},
      });
      console.log(response.data, "response from movies orders");

      const newBookings = response.data.bookingData;
      setBookings(newBookings)
      setTotalPages(response.data.totalPages);
      //setHasMore(newBookings.length === limit); 
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   fetchBookings();
   if(!loading)
    window.scrollTo(0,0)
  }, [currentPage]);

  const cancelBooking = async (bookingId: string,refundAmount:number) => {
        console.log(bookingId,"bookingId going through,qyery");
        
        await userAuthenticate.put(`/cancel-Booking`, {refundAmount}, {
          params: { bookingId: bookingId }, 
        });

        dispatch(updateWalletBalance(refundAmount))
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

const downloadInvoice = async (booking:BookingType) => {
  
  if(booking==undefined)
  {
    return
  }
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

  // const logoImageURL = `${TMDB_IMAGE_BASE_URL}/${booking.movieId.poster_path}`;
  // const logoImage = await fetch(logoImageURL)
  //   .then((res) => res.blob())
  //   .then(
  //     (blob) =>
  //       new Promise<string>((resolve) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result as string);
  //         reader.readAsDataURL(blob);
  //       })
  //   );

  // if (logoImage) {
  //   pdf.addImage(logoImage, "PNG", 10, 10, 30, 30); // Adjust size and position
  // }

  pdf.setFontSize(24);
  pdf.setFont("helvetica","bold")
  pdf.setTextColor(0,0,0)
  pdf.text("Booking Invoice", 105, 20, { align: "center" });

  // Booking details
  pdf.setFontSize(12);
  pdf.setTextColor(0,0,0)
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
  pdf.setFontSize(12)
  pdf.setFont("helvetica","bold")
  pdf.text(`Total Price: ${Number(booking.totalPrice?.toFixed())}`, 20, 120);
  pdf.text(`Convenience Rate (10.53%): ${Number(convenienceRate.toFixed(2))}`, 20, 130);
  pdf.setFontSize(16)
  pdf.text(`Amount Paid: ${Number(totalAmount.toFixed(2))}`, 20, 150);

  // Generate QR Code and add to PDF
  const qrCodeData = `Booking ID: ${booking.bookingId}, Movie: ${booking.movieId?.title}, Amount: ₹${totalAmount.toFixed(2)}, Seats: ${booking?.screenData?.tierName} ${booking?.selectedSeats.join(', ')}
   `;
  const qrCodeCanvas = qrRef.current; // Access the QR code's canvas element
  if (qrCodeCanvas) {
    const qrCodeBase64 = await qrCodeCanvas.toDataURL(qrCodeData); // Get base64 image
    pdf.addImage(qrCodeBase64, "PNG", 140, 30, 50, 50);
  // Footer
  }
  pdf.setFontSize(10);
  pdf.setFont("helvetica","italic")
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
      <Header  searchQuery="" setSearchQuery={()=>{}}/>
      <div className="flex flex-col items-center bg-gray-200 min-h-screen  p-4">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-3 gap-6 w-full  max-w-[90rem]">
            {bookings.map((booking, index) => (
    <BookingCard
      key={index}
      booking={booking as BookingType}
      isLast={index === bookings.length - 1}
     // lastBookingRef={index === bookings.length - 1 ? lastBookingRef : null}
      canCancelBooking={canCancelBooking}
      cancelBooking={cancelBooking}
      setSelectedBooking={setSelectedBooking}
    />
  ))}
</div>
<div className="flex justify-center items-center gap-2 mt-4">
            <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-1  rounded-lg min-h-8  ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, index)=>index+1).filter((page)=>page==currentPage||page==currentPage-1||page==currentPage+1).map(page => (
    <button
      key={page}
      onClick={() => paginate(page)}
      className={`p-2 rounded-lg  min-h-8 ${currentPage === page  ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-1 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Next
  </button>
            </div>
            
          </>
          
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
                onClick={() =>selectedBooking && downloadInvoice(selectedBooking as BookingType)}
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
              ref={qrRef}
                  value={`Booking ID: ${selectedBooking._id}\nMovie: ${selectedBooking.movieId?.title}\nTheatre: ${selectedBooking.theatreDetails?.name}\nShowtime: ${selectedBooking.showtimeId?.showtime}\nSeats: ${selectedBooking?.screenData?.tierName} ${selectedBooking?.selectedSeats?.join(', ')}
   `}
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

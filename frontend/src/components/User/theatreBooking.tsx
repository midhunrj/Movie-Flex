import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from '@mui/material';
import { userAuthenticate } from '@/utils/axios/userInterceptor';

type Seat = {
  row: number;
  col: number;
  label: string;
  isFilled: boolean;
  isPartition: boolean;
  isSelected?: boolean;
  isBooked?: boolean;
};

type Tier = {
  name: string;
  partition: number;
  rows: number;
  seatLayout: Seat[][]; // Array of rows with seats
  seats: number;
  ticketRate: number;
};

type SeatLayout = Tier[];

const TheatreBooking: React.FC = () => {
  const location = useLocation();
  const { movieId, theatreId,theatreName,screenName,movieName,SeatLayout, screenId, showtime, date, totalSeats } = location.state;

  const [seatLayout, setSeatLayout] = useState<SeatLayout>([]);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch seat layout
  useEffect(() => {
    const fetchSeatLayout = async () => {
      setLoading(true);
      try {
        console.log(screenId.tiers, 'tier seats');
        setSeatLayout(screenId.tiers);
        setAvailableSeats(totalSeats);
      } catch (error) {
        console.error('Error fetching seat layout:', error);
        setError('Failed to load seat layout.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeatLayout();
  }, [theatreId, screenId, showtime]);

  const handleSeatClick = (tierIndex: number, rowIndex: number, seatIndex: number) => {
    // const originalTierIndex = seatLayout.length - 1 - tierIndex;
    // const originalRowIndex = seatLayout[originalTierIndex].seatLayout.length - 1 - rowIndex;
  
    const updatedLayout = [...seatLayout];
    const seat = updatedLayout[tierIndex].seatLayout[rowIndex][seatIndex];
  
    if (!seat?.isBooked) {
      seat.isSelected = !seat?.isSelected;
      setSeatLayout(updatedLayout);

      const totalSelected = updatedLayout.reduce(
        (count, tier) =>
          count + tier.seatLayout.flat().filter((s: Seat) => s.isSelected).length,
        0
      );
      setSelectedSeats(totalSelected);
    }
  };

  const calculateTotalCost = () => {
    return seatLayout.reduce((total, tier) => {
      const selectedSeatsInTier = tier.seatLayout.flat().filter((seat: Seat) => seat.isSelected);
      return total + selectedSeatsInTier.length * tier.ticketRate;
    }, 0);
  };

  const handleConfirmBooking = async () => {
    try {
      const selectedSeatsData = seatLayout
        .flatMap((tier: any) => tier.seatLayout.flat())
        .filter((seat: any) => seat.isSelected);

      await userAuthenticate.post('/book-seats', {
        theatreId,
        screenId,
        showtime,
        seats: selectedSeatsData,
      });

    //   alert('Booking successful!');
      setSeatLayout((prev) =>
        prev.map((tier: any) => ({
          ...tier,
          seatLayout: tier.seatLayout.map((row: any) =>
            row.map((seat: any) =>
              seat.isSelected ? { ...seat, isBooked: true, isSelected: false } : seat
            )
          ),
        }))
      );
      setSelectedSeats(0);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading seat layout...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Theatre Details</h2>
      <p>Movie: {movieName}</p>
      <p>Theatre: {theatreName}</p>
      <p>Showtime: {showtime}</p>
      <p>Date: {date}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Seating Information</h3>
        {seatLayout.slice().reverse().map((tier: Tier, reverseTierIndex: number) => {
          
          const tierIndex=seatLayout.length-1-reverseTierIndex
          return (
          <div key={tierIndex} className="my-4">
            <h4 className="font-semibold text-lg text-slate-900">{tier.name}</h4>
            <p className="text-gray-600">Price: ₹{tier.ticketRate}</p>
            <div className="mt-2">
              {tier.seatLayout.slice().reverse().map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                  {row.map((seat: Seat, seatIndex: number) => (
                    <button
                      key={seatIndex}
                      onClick={() => handleSeatClick(tierIndex,tier.seatLayout.length-1- rowIndex, seatIndex)}
                      disabled={seat.isBooked}
                      className={`w-10 h-10 border transition rounded-md ${
                        seat.isPartition ?'bg-transparent border-none'
                        :seat.isBooked
                          ? 'bg-gray-600 text-white cursor-not-allowed'
                          : seat.isSelected
                          ? 'bg-green-500 text-white'
                          : 'bg-white hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {seat.label}
                    </button>
                  ))}
                </div>
              ))}
              
            </div>
            {tierIndex < screenId.tiers.length - 1 && (
                <div className="h-2 bg-slate-400 my-4"></div>
              )}
          </div>
          
        )})}
      </div>
      <div className="relative w-[75%] mx-[12.5%] h-8 bg-gray-700 rounded-t-xl overflow-hidden mt-8">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60"></div>
        <p className="text-center text-white text-xs uppercase tracking-wider absolute inset-0 flex items-center justify-center">
          Screen
        </p>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white  w-fit min-h-8 flex justify-center py-2 px-4 rounded hover:bg-blue-700"
      >
        Book Tickets
      </button>

      {/* Booking Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 bg-white rounded shadow-md w-96 mx-auto mt-24">
          <h2 className="text-lg font-bold mb-4">Confirm Booking</h2>
          <p>Selected Seats: {selectedSeats}</p>
          <p>Total Price: ₹{calculateTotalCost()}</p>
          <button
            onClick={handleConfirmBooking}
            className="mt-4 bg-green-600 text-white min-h-8 py-2 px-4 rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TheatreBooking;

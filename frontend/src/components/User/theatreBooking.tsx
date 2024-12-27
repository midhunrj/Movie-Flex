import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import VehicleModal from "./vehicleModal";
import EditIcon from "@mui/icons-material/Edit"
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {motion} from 'framer-motion'
const ticketImages = [
  "scooterImage",
  " bikeImage",
  "carImage",
  "jeepImage",
  "vanImage",
  "busImage",
];

type Seat = {
  row: number;
  col: number;
  seatLabel: string;
  isBooked: boolean;
  isPartition: boolean;
  isSelected?: boolean;
  isReserved?:boolean
  status: string;
};

type Row = {
  seats: Seat[];
  _id?: string;
};


type Tier = {
  tierName: string;
  ticketRate: number;
  rows: Row[];
  _id: string;
};


type SeatLayout = Tier[];

const TheatreBooking: React.FC = () => {
  const location = useLocation();
  const {
    movieId,
    theatreId,
    theatreName,
    screenName,
    movieName,
    SeatLayout,
    screenId,
    showtime,
    date,
    totalSeats,
    showtimeId
  } = location.state;
   console.log(showtimeId,"showtimeId");
   
  const{user}=useSelector((state:RootState)=>state.user)
  const [seatLayout, setSeatLayout] = useState<SeatLayout>([]);
  const[seatNames,setSeatNames]=useState<string[]>([])
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const [showModal, setShowModal] = useState(true);
  const [showconfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ticketCount, setTicketCount] = useState<number>(1);

  const navigate=useNavigate()
  useEffect(() => {
    console.log("Seat names updated:", seatNames);
  }, [seatNames]);

  useEffect(() => {
    const fetchSeatLayout = async () => {
      setLoading(true);
      try {
        console.log(screenId.tiers, "tier seats")
        
        console.log(seatLayout,"seatlayout after tiers from location state");
        
        setAvailableSeats(totalSeats)
      } catch (error) {
        console.error("Error fetching seat layout:", error)
        setError("Failed to load seat layout.")
      } finally {
        setLoading(false);
      }
    };

    fetchSeatLayout();
  }, [theatreId, screenId, showtime])
  
  const slideUpVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };
   const backendSeatLayout=async()=>{
    const response = await userAuthenticate.get('/screen-layout', {
      params: { showtimeId }, // Pass showtimeId as a query parameter
    });
    console.log(response.data,"response for seatLayout");
    
    setAvailableSeats(totalSeats);
    setSeatLayout(response.data.seatData)
         
   }
  useEffect(()=>{
  const fetchSeatData=async()=>{
    await backendSeatLayout()
  }
  fetchSeatData()
  },[showtimeId,])


  console.log(seatLayout,"seatlayout after tiers from backend");
   
  const handleSeatClick = (
    tierIndex: number,
    rowIndex: number,
    seatIndex: number
  ) => {
    // const originalTierIndex = seatLayout.length - 1 - tierIndex;
    // const originalRowIndex = seatLayout[originalTierIndex].seatLayout.length - 1 - rowIndex;
 
    const updatedLayout = [...seatLayout];
    const seat = updatedLayout[tierIndex].rows[rowIndex].seats[seatIndex];

    if (!seat?.isBooked) {
      if(seat.isSelected)
      {
        console.log('jumbo');
        
        seat.isSelected=false
        setSeatNames((prev)=>prev.filter((name)=>name!=seat.seatLabel))
        setSelectedSeats(prev=>prev-1)
      }
      else if (selectedSeats<ticketCount) {
        console.log("sumbo");
        
        seat.isSelected=true
        setSeatNames((prev)=>[...prev,seat.seatLabel])
        setSelectedSeats(prev=>prev+1)
      }
      else{
        console.log("vdfvdf");
        
        let clear = false;
        for (let tier of updatedLayout) {
          for (let row of tier.rows) {
            for (let s of row.seats) {
              if (s.isSelected) {
                s.isSelected = false;
                console.log("jokr");
                
                setSelectedSeats(prev=>prev-1)
                setSeatNames((prev)=>prev.filter((name)=>name!=s.seatLabel))
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
        
        seat.isSelected=true
        setSeatNames((prev)=>[...prev,seat.seatLabel])
        setSelectedSeats(prev=>prev+1)
      }
      
      setSeatLayout(updatedLayout);

    
    }
  };

  const calculateTotalCost = () => {
    return seatLayout.reduce((total, tier) => {
      const selectedSeatsInTier = tier.rows
        .flatMap((row)=>row.seats)
        .filter((seat: Seat) => seat.isSelected);
      return total + selectedSeatsInTier.length * tier.ticketRate;
    }, 0);
  };
  const calculateConvenienceFee = (baseCost: number) => {
    return (baseCost * 10.53) / 100;
  };

  const handleConfirmBooking = async () => {
    try {
      const selectedSeatsData = seatLayout
        .flatMap((tier: Tier) => tier.rows.flatMap((row)=>row.seats))
        .filter((seat: any) => seat.isSelected);

      
        const totalCost = calculateTotalCost();
        const convenienceFee = calculateConvenienceFee(totalCost);
        const finalAmount = totalCost + convenienceFee;

        const response = await userAuthenticate.post('/book-tickets', {
          movieId,
          theatreId,
          screenId:screenId._id,
          showtimeId,
          selectedSeats: seatNames,
          totalPrice: calculateTotalCost(),
          userId: user?._id,
        });
    
        const {bookingId} = response.data;
    
    
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
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  if (loading)
    return <p className="text-center text-lg">Loading seat layout...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  const handleModalClose = () => setShowModal(false)
  return (
    <div className="p-6 space-y-6">
       <VehicleModal
        open={showModal}
        onClose={handleModalClose}
        ticketCount={ticketCount}
        setTicketCount={setTicketCount}
      />
      <div className="flex gap-4 shadow-sm rounded-md bg-gray-200 justify-between">
        <div  className="ml-4">
        <div className="flex items-center  -space-x-12"><button onClick={()=>navigate(-1)}><FaAngleLeft size={25}/></button> <h2 className="text-2xl font-bold">Theatre Details</h2>
      </div>
      <p>Movie: {movieName}</p>
      <p>Theatre: {theatreName}</p>
      <p>Showtime: {showtime}</p>
      <p>Date: {date}</p>
      </div>
      <div className="mr-4 mt-2">
        <button onClick={()=>setShowModal(true)} className="w-fit py-2 px-3 min-h-12  shadow-md border rounded-lg bg-yellow-100  text-gray-800"> <EditIcon
            onClick={() => setShowModal(true)}
            className="text-gray-800 cursor-pointer w-8 h-8"
          />{ticketCount} tickets</button></div> 
</div>
      <div className="mt-6 space-x-12">
        <h3 className="text-xl text-center font-semibold ">Seating Information</h3>
        <div className="flex justify-center gap-4 my-4">
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-green-500 rounded-md"></div>
    <p className="text-sm">Selected</p>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-white border rounded-md"></div>
    <p className="text-sm">Available</p>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-gray-600 rounded-md"></div>
    <p className="text-sm text-gray-600">Booked</p>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-gray-400 rounded-md"></div>
    <p className="text-sm text-gray-600">Reserved</p>
  </div>
</div>

        {seatLayout
          .slice()
          .reverse()
          .map((tier: Tier, reverseTierIndex: number) => {
            const tierIndex = seatLayout.length - 1 - reverseTierIndex;
            return (
              <div key={tierIndex} className="my-4">
                <h4 className="font-semibold text-lg text-slate-900">
                  {tier.tierName}
                </h4>
                <p className="text-gray-600">Price: ₹{tier.ticketRate}</p>
                
                <div className="mt-2">
                  {tier.rows
                    .slice()
                    .reverse()
                    .map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex justify-center gap-2 mb-2"
                      >
                        {row.seats.map((seat: Seat, seatIndex: number) => (
                          <button
                            key={seatIndex}
                            onClick={() =>
                              handleSeatClick(
                                tierIndex,
                                tier.rows.length - 1 - rowIndex,
                                seatIndex
                              )
                            }
                            disabled={seat.isBooked}
                            className={`w-10 h-10 border transition rounded-md ${
                              seat.isPartition
                                ? "bg-transparent border-none"
                                : seat.isBooked
                                ? "bg-gray-600 text-white cursor-not-allowed"
                                : seat.isSelected
                                ? "bg-green-500 text-white"
                                :seat.isReserved
                                ?"bg-gray-400 text-white cursor-not-allowed"
                                : "bg-white hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {seat.seatLabel}
                          </button>
                        ))}
                      </div>
                    ))}

                    
                </div>
                
                {tierIndex >0  && (
                   <div className="border-t-2  border-gray-300 my-2"></div>
                )}
              </div>
            );
          })}
      </div>
      <div className="relative w-[75%] mx-[12.5%] h-8 bg-gray-700 rounded-t-xl overflow-hidden mt-8">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60"></div>
        <p className="text-center text-white text-xs uppercase tracking-wider absolute inset-0 flex items-center justify-center">
          Screen
        </p>
      </div>
      {selectedSeats>0?
      <motion.div
    className="mt-4 bg-gray-200 p-4 rounded-lg"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={slideUpVariants}
  >
    <div className="flex justify-between mb-2">
      <span>Selected Seats:</span>
      <span>{seatNames.join(", ")}</span>
    </div>
    <div className="flex justify-between font-bold">
      <span>Total Price:</span>
      <span>₹{calculateTotalCost()}</span>
    </div>
    <div className="flex justify-center">
    <button
        onClick={() => setShowConfirmModal(true)}
        className="bg-blue-600 text-white  w-fit min-h-8 flex justify-center py-2 px-4 rounded hover:bg-blue-700"
      >
        Book Tickets
      </button>
    </div>
  </motion.div>
:<></>}
      
      

      <Modal open={showconfirmModal} onClose={() => setShowModal(false)}>
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

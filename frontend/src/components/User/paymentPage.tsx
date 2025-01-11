import { RootState } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import MovieDetails from "./movieDetails";
import { MovieType } from "@/types/movieTypes";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import { Toaster, toast } from "sonner";
import { Description } from "@headlessui/react";
import { updateWalletBalance } from "@/redux/user/userSlice";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nowShowingMovies,wallet,user } = useSelector((state: RootState) => state.user);
  const [foodPrice, setFoodPrice] = useState(0);
  const [movieDetails, setMovieDetails] = useState<MovieType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "online">("wallet");
  const [walletBalance, setWalletBalance] = useState(wallet);

const RAZORPAY_ID_KEY="rzp_test_3oY2qxkce538eY"
  const { selectedSeats, totalCost, movieName, theatreName, date, showtime, seatNames,bookingId } =
    location.state || {}; 


  
  useEffect(() => {
    if (movieName) {
      const moviesNow = nowShowingMovies.find((mov) =>
        mov.title === movieName ? mov : null
      );
      setMovieDetails(moviesNow || null);
    }
  }, [movieName, nowShowingMovies]);

  const convenienceFeeRate = 0.1053; 
  const convenienceFee = totalCost * convenienceFeeRate;
  const totalPrice = totalCost + convenienceFee + foodPrice;

  const handleWalletPayment = async () => {
    if (walletBalance < totalPrice) {
      toast.error("Insufficient wallet balance!");
      return;
    }
    try {
      
      const response = await userAuthenticate.post("/verify-payment", {
        paymentMethod:"wallet",
        bookingId,
        totalPrice,
        Description:`The movie ${movieDetails?.title} has been booked successfully with an cost of Rs.${totalPrice} and here is the reference no of booking ${bookingId} `

      });

      if (response.data.success) {
        setWalletBalance(walletBalance - totalPrice);
        updateWalletBalance(-totalPrice)
        toast.success("Payment successful via wallet!");
        navigate("/orders", { state: location.state });
      } else {
        toast.error("Payment via wallet failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during wallet payment.");
    }
  };

  const handleOnlinePayment = async () => {
    // if (!selectedSeats || !seatNames || !movieName || !theatreName || !date || !showtime) {
    //   alert("Some booking details are missing. Please try again.");
    //   return;
    // }
  
    try {
      
      const response = await userAuthenticate.post("/create-order", {
        amount: Math.floor(totalPrice * 100), 
        currency: "INR",
        receipt: `receipt_${bookingId}`,
        bookingId
      });
      console.log(response,"response paym");
      
       const {paymentData}=response.data
      
      const options = {
        key:RAZORPAY_ID_KEY , // Replace with your Razorpay API key
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Movie Booking",
        description: "Payment for movie tickets",
        image: "/path/to/your/logo.png", // Optional
        order_id: paymentData.orderId,
        prefill: {
          name: "Midhunrj", 
          email: "midhunrj18852@gmail.com", 
          contact: "8848928671", 
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response: any) {
          console.log(response,"response of handler ");
          
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
  
          
          const verificationResponse = await userAuthenticate.post(
            "/verify-payment",
            {paymentMethod:"online",paymentDetails,bookingId,totalPrice}
          );
  
          if (verificationResponse.data.success) {
        
            navigate("/orders", {
              state: {
                selectedSeats,
                totalCost,
                convenienceFee,
                totalPrice,
                movieName,
                theatreName,
                date,
                seatNames,
                showtime,
                foodPrice,
              },
            });
          } else {
            toast.error("Payment verification failed. Please try again.");
          }
        },
        modal: {
          ondismiss: () => toast.error("Payment process cancelled."),
        },
      };
  
    
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error:any) {
        console.log(error,"kkjjkkjkj");
        
        if(error.response.data.success==false)
            {
              toast.error(error.response.data.message)
              navigate(-1)
            }

      //console.error("Payment initiation failed:", error);
      //alert("Payment initiation failed. Please try again.");
    }
  };
  
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const handlePayment = () => {
    if (paymentMethod === "wallet") {
      handleWalletPayment();
    } else {
      handleOnlinePayment();
    }
  };
  return (
// <div className="p-6 flex justify-around min-h-screen bg-gray-100">
// <div className="w-[60%] mx-auto bg-white shadow-md rounded-lg">
//   <div className="p-6 space-y-6">
//     <h2 className="text-2xl font-bold text-center text-slate-900">
//       Movie and Screen Details
//     </h2>
//     <div className="bg-gray-100 p-4 rounded-lg space-y-4">
//       <div className="flex justify-around">
//         <img
//           src={
//             movieDetails?.poster_path
//               ?` ${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
//               : "/uploads/default-profile.jpg"
//           }
//           alt="Movie Poster"
//           className="w-64 h-72 shadow-sm rounded-xl"
//         />
//         <div className="flex gap-5 flex-col">
//           <span className="font-semibold">
//             Movie: <strong className="font-medium">{movieName}</strong>
//           </span>
//           <div className="font-semibold space-x-6">
//             <span className="w-fit p-2 rounded-sm bg-white">U/A</span>
//             <span className="w-fit p-2 rounded-md bg-white">
//               {movieDetails?.language || "N/A"}
//             </span>
//             <span className="w-fit p-2 rounded-md bg-white">2D</span>
//           </div>

//           <p>
//             <span className="font-semibold">Theatre:</span> {theatreName}
//           </p>
//           <p>
//             <span className="font-semibold">Date:</span> {date}
//           </p>
//           <p>
//             <span className="font-semibold">Showtime:</span> {showtime}
//           </p>
//           <p>
//             <span className="font-semibold">Selected Seats:</span>
//             {selectedSeats && seatNames.map((s: string, i: number) => (
//               <span key={i}>&nbsp;{s}</span>
//             ))}
//           </p>
//         </div>
//       </div>
      
//     </div>
//     <div className="p-6 space-y-6">
//           <h2 className="text-2xl font-bold text-center text-slate-900">
//             Payment Options
//           </h2>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <input
//                 type="radio"
//                 id="wallet"
//                 name="paymentMethod"
//                 value="wallet"
//                 checked={paymentMethod === "wallet"}
//                 onChange={() => setPaymentMethod("wallet")}
//               />
//               <label htmlFor="wallet" className="text-gray-700">
//                 Pay with Wallet (Balance: ₹{walletBalance.toFixed(2)})
//               </label>
//             </div>
//             {paymentMethod === "wallet" && walletBalance < totalPrice && (
//               <p className="text-red-500">Insufficient wallet balance!</p>
//             )}
//             <div className="flex items-center space-x-4">
//               <input
//                 type="radio"
//                 id="online"
//                 name="paymentMethod"
//                 value="online"
//                 checked={paymentMethod === "online"}
//                 onChange={() => setPaymentMethod("online")}
//               />
//               <label htmlFor="online" className="text-gray-700">
//                 Pay Online
//               </label>
//             </div>
//           </div>
// </div>

//     <div className="flex justify-center space-x-4 mt-6">

      
//       <button
//         onClick={() => navigate(-1)}
//         className="bg-yellow-200 min-h-10 w-fit text-red-600 py-2 px-4 rounded-md hover:bg-gray-400 hover:text-gray-800"
//       >
//         cancel and go back
//       </button>
//       <button
//         onClick={handlePayment}
//         className="bg-indigo-600 min-h-10 w-fit text-slate-100 py-2 px-6 rounded-md hover:bg-blue-700 hover:text-white"
//       >
//         Confirm & Pay
//       </button>
//     </div>
//   </div>
// </div>
// <div className="w-[30%] h-[60%] p-6 mx-auto rounded-lg shadow-md bg-white">
//   <div className="space-y-2">
//     <h3 className="text-2xl font-medium mb-8">Booking Summary</h3>
//     <div className="flex justify-between">
//       <p className="text-gray-700">Ticket Price:</p>
//       <p className="font-semibold">₹{totalCost.toFixed(2)}</p>
//     </div>
//     <div className="flex justify-between">
//       <p className="text-gray-700">Food & Items:</p>
//       <p className="font-semibold">₹{foodPrice}</p>
//     </div>
//     <div className="flex justify-between">
//       <p className="text-gray-700">Convenience Fee (10.53%):</p>
//       <p className="font-semibold">₹{convenienceFee.toFixed(2)}</p>
//     </div>
//     <div className="border-t border-gray-300 my-2"></div>
//     <div className="flex justify-between text-lg">
//       <p className="font-bold">Final Total:</p>
//       <p className="font-bold">₹{totalPrice.toFixed(2)}</p>
//     </div>
//   </div>
// </div>
// </div>

<div className="p-6 flex flex-col lg:flex-row justify-around min-h-screen bg-gray-100">
  <div className="w-full lg:w-[60%] mx-auto bg-white shadow-md rounded-lg">
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-900">
        Movie and Screen Details
      </h2>
      <div className="bg-gray-100 p-4  rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-around">
          <img
            src={
              movieDetails?.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
                : "/uploads/default-profile.jpg"
            }
            alt="Movie Poster"
            className="w-48 h-56 md:w-64 md:h-72 shadow-sm rounded-xl"
          />
          <div className="flex gap-5 flex-col mt-4 md:mt-0">
            <span className="font-semibold">
              Movie: <strong className="font-medium">{movieName}</strong>
            </span>
            <div className="font-semibold space-x-2 md:space-x-6">
              <span className="w-fit p-2 rounded-sm bg-white">U/A</span>
              <span className="w-fit p-2 rounded-md bg-white">
                {movieDetails?.language || "N/A"}
              </span>
              <span className="w-fit p-2 rounded-md bg-white">2D</span>
            </div>

            <p>
              <span className="font-semibold">Theatre:</span> {theatreName}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {date}
            </p>
            <p>
              <span className="font-semibold">Showtime:</span> {showtime}
            </p>
            <p>
              <span className="font-semibold">Selected Seats:</span>
              {selectedSeats &&
                seatNames.map((s: string, i: number) => (
                  <span key={i}>&nbsp;{s}</span>
                ))}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-900">
          Payment Options
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="wallet"
              name="paymentMethod"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={() => setPaymentMethod("wallet")}
            />
            <label htmlFor="wallet" className="text-gray-700">
              Pay with Wallet (Balance: ₹{walletBalance.toFixed(2)})
            </label>
          </div>
          {paymentMethod === "wallet" && walletBalance < totalPrice && (
            <p className="text-red-500">Insufficient wallet balance!</p>
          )}
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="online"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <label htmlFor="online" className="text-gray-700">
              Pay Online
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-200 w-full h-fit md:w-auto text-red-600 py-2 px-4 rounded-md hover:bg-gray-400 hover:text-gray-800"
        >
          Cancel and go back
        </button>
        <button
          onClick={handlePayment}
          className="bg-indigo-600 w-full h-fit md:w-auto text-slate-100 py-2 px-6 rounded-md hover:bg-blue-700 hover:text-white"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  </div>
  <div className="w-full lg:w-[30%] h-auto mt-6 lg:mt-0 p-6 mx-auto rounded-lg shadow-md bg-white">
    <div className="space-y-2">
      <h3 className="text-2xl font-medium mb-8">Booking Summary</h3>
      <div className="flex justify-between">
        <p className="text-gray-700">Ticket Price:</p>
        <p className="font-semibold">₹{totalCost.toFixed(2)}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-700">Food & Items:</p>
        <p className="font-semibold">₹{foodPrice}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-700">Convenience Fee (10.53%):</p>
        <p className="font-semibold">₹{convenienceFee.toFixed(2)}</p>
      </div>
      <div className="border-t border-gray-300 my-2"></div>
      <div className="flex justify-between text-lg">
        <p className="font-bold">Final Total:</p>
        <p className="font-bold">₹{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  </div>
</div>

);
};

export default PaymentPage;

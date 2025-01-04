import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { userAuthenticate } from "@/utils/axios/userInterceptor";
import { toast } from "sonner";
import { updateWalletBalance } from "@/redux/user/userSlice";
const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { nowShowingMovies, wallet, user } = useSelector((state) => state.user);
    const [foodPrice, setFoodPrice] = useState(0);
    const [movieDetails, setMovieDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [walletBalance, setWalletBalance] = useState(wallet);
    const RAZORPAY_ID_KEY = "rzp_test_3oY2qxkce538eY";
    const { selectedSeats, totalCost, movieName, theatreName, date, showtime, seatNames, bookingId } = location.state || {};
    useEffect(() => {
        if (movieName) {
            const moviesNow = nowShowingMovies.find((mov) => mov.title === movieName ? mov : null);
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
                paymentMethod: "wallet",
                bookingId,
                totalPrice,
                Description: `The movie ${movieDetails?.title} has been booked successfully with an cost of Rs.${totalPrice} and here is the reference no of booking ${bookingId} `
            });
            if (response.data.success) {
                setWalletBalance(walletBalance - totalPrice);
                updateWalletBalance(-totalPrice);
                toast.success("Payment successful via wallet!");
                navigate("/orders", { state: location.state });
            }
            else {
                toast.error("Payment via wallet failed. Please try again.");
            }
        }
        catch (error) {
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
            console.log(response, "response paym");
            const { paymentData } = response.data;
            const options = {
                key: RAZORPAY_ID_KEY, // Replace with your Razorpay API key
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
                handler: async function (response) {
                    console.log(response, "response of handler ");
                    const paymentDetails = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    const verificationResponse = await userAuthenticate.post("/verify-payment", { paymentMethod: "online", paymentDetails, bookingId, totalPrice });
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
                    }
                    else {
                        toast.error("Payment verification failed. Please try again.");
                    }
                },
                modal: {
                    ondismiss: () => toast.error("Payment process cancelled."),
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        }
        catch (error) {
            console.log(error, "kkjjkkjkj");
            if (error.response.data.success == false) {
                toast.error(error.response.data.message);
                navigate(-1);
            }
            //console.error("Payment initiation failed:", error);
            //alert("Payment initiation failed. Please try again.");
        }
    };
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const handlePayment = () => {
        if (paymentMethod === "wallet") {
            handleWalletPayment();
        }
        else {
            handleOnlinePayment();
        }
    };
    return (_jsxs("div", { className: "p-6 flex justify-around min-h-screen bg-gray-100", children: [_jsx("div", { className: "w-[60%] mx-auto bg-white shadow-md rounded-lg", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-center text-slate-900", children: "Movie and Screen Details" }), _jsx("div", { className: "bg-gray-100 p-4 rounded-lg space-y-4", children: _jsxs("div", { className: "flex justify-around", children: [_jsx("img", { src: movieDetails?.poster_path
                                            ? ` ${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
                                            : "/uploads/default-profile.jpg", alt: "Movie Poster", className: "w-64 h-72 shadow-sm rounded-xl" }), _jsxs("div", { className: "flex gap-5 flex-col", children: [_jsxs("span", { className: "font-semibold", children: ["Movie: ", _jsx("strong", { className: "font-medium", children: movieName })] }), _jsxs("div", { className: "font-semibold space-x-6", children: [_jsx("span", { className: "w-fit p-2 rounded-sm bg-white", children: "U/A" }), _jsx("span", { className: "w-fit p-2 rounded-md bg-white", children: movieDetails?.language || "N/A" }), _jsx("span", { className: "w-fit p-2 rounded-md bg-white", children: "2D" })] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Theatre:" }), " ", theatreName] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Date:" }), " ", date] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Showtime:" }), " ", showtime] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Selected Seats:" }), selectedSeats && seatNames.map((s, i) => (_jsxs("span", { children: ["\u00A0", s] }, i)))] })] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-center text-slate-900", children: "Payment Options" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { type: "radio", id: "wallet", name: "paymentMethod", value: "wallet", checked: paymentMethod === "wallet", onChange: () => setPaymentMethod("wallet") }), _jsxs("label", { htmlFor: "wallet", className: "text-gray-700", children: ["Pay with Wallet (Balance: \u20B9", walletBalance.toFixed(2), ")"] })] }), paymentMethod === "wallet" && walletBalance < totalPrice && (_jsx("p", { className: "text-red-500", children: "Insufficient wallet balance!" })), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { type: "radio", id: "online", name: "paymentMethod", value: "online", checked: paymentMethod === "online", onChange: () => setPaymentMethod("online") }), _jsx("label", { htmlFor: "online", className: "text-gray-700", children: "Pay Online" })] })] })] }), _jsxs("div", { className: "flex justify-center space-x-4 mt-6", children: [_jsx("button", { onClick: () => navigate(-1), className: "bg-yellow-200 min-h-10 w-fit text-red-600 py-2 px-4 rounded-md hover:bg-gray-400 hover:text-gray-800", children: "cancel and go back" }), _jsx("button", { onClick: handlePayment, className: "bg-indigo-600 min-h-10 w-fit text-slate-100 py-2 px-6 rounded-md hover:bg-blue-700 hover:text-white", children: "Confirm & Pay" })] })] }) }), _jsx("div", { className: "w-[30%] h-[60%] p-6 mx-auto rounded-lg shadow-md bg-white", children: _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-2xl font-medium mb-8", children: "Booking Summary" }), _jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: "text-gray-700", children: "Ticket Price:" }), _jsxs("p", { className: "font-semibold", children: ["\u20B9", totalCost.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: "text-gray-700", children: "Food & Items:" }), _jsxs("p", { className: "font-semibold", children: ["\u20B9", foodPrice] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: "text-gray-700", children: "Convenience Fee (10.53%):" }), _jsxs("p", { className: "font-semibold", children: ["\u20B9", convenienceFee.toFixed(2)] })] }), _jsx("div", { className: "border-t border-gray-300 my-2" }), _jsxs("div", { className: "flex justify-between text-lg", children: [_jsx("p", { className: "font-bold", children: "Final Total:" }), _jsxs("p", { className: "font-bold", children: ["\u20B9", totalPrice.toFixed(2)] })] })] }) })] }));
};
export default PaymentPage;

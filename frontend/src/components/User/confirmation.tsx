// import React from "react";
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
// import { Toaster, toast } from "sonner";

// const PaymentComponent = () => {
//   const { error, isLoading, Razorpay } = useRazorpay();
// const RAZORPAY_ID_KEY="rzp_test_3oY2qxkce538eY"
//   const handlePayment = () => {
//     const options: RazorpayOrderOptions = {
//       key: RAZORPAY_ID_KEY,
//       amount: , // Amount in paise
//       currency: "INR",
//       name: "Test Company",
//       description: "Test Transaction",
//       order_id: "order_9A33XWu170gUtm", // Generate order_id on servern
//       handler: (response) => {
//         console.log(response);
//         toast.success("Payment Successful!");
//       },
//       prefill: {
//         name: "John Doe",
//         email: "john.doe@example.com",
//         contact: "9999999999",
//       },
//       theme: {
//         color: "#F37254",
//       },
//     };

//     const razorpayInstance = new Razorpay(options);
//     razorpayInstance.open();
//   };

//   return (
//     <div>
//       <h1>Payment Page</h1>
//       {isLoading && <p>Loading Razorpay...</p>}
//       {error && <p>Error loading Razorpay: {error}</p>}
//       <button onClick={handlePayment} disabled={isLoading}>
//         Pay Now
//       </button>
//     </div>
//   );
// };

// export default PaymentComponent
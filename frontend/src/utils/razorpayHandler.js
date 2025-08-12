// import axios from "./axios";
// import { loadRazorpayScript } from "./loadRazorpay";

// export const handleRazorpayPayment = async ({ items, amount, shippingAddress, paymentMethod, user, navigate }) => {
//   const isLoaded = await loadRazorpayScript();
//   if (!isLoaded) {
//     alert("Razorpay SDK failed to load.");
//     return;
//   }

//   try {
//     // Send full order to backend
//     const { data } = await axios.post("/payment/create-order", {
//       items,
//       amount,
//       shippingAddress,
//       paymentMethod,
//     });

//     const { razorpayOrder } = data.data;

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       name: "SnapBuy",
//       description: "Thanks for your purchase",
//       order_id: razorpayOrder.id,
//       handler: function (response) {
//         alert("✅ Payment successful!");
//         navigate("/orders");
//         // Optionally call backend to verify payment here
//       },
//       prefill: {
//         name: user?.name || "SnapBuy User",
//         email: user?.email || "user@example.com",
//       },
//       theme: {
//         color: "#4f46e5",
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   } catch (err) {
//     console.error("Razorpay error:", err);
//     alert("❌ Payment failed. Please try again.");
//   }
// };

import axios from "./axios";
import { loadRazorpayScript } from "./loadRazorpay";

export const handleRazorpayPayment = async ({
  items,
  amount,
  shippingAddress,
  paymentMethod,
  user,
  navigate
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Razorpay SDK failed to load.");
    return;
  }

  try {
    // 1️⃣ Create order in backend
    const { data } = await axios.post("/payment/create-order", {
      items,
      amount,
      shippingAddress,
      paymentMethod,
    });

    const { razorpayOrder, dbOrder } = data.data;

    // 2️⃣ Razorpay payment options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "SnapBuy",
      description: "Thanks for your purchase",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          // 3️⃣ Call backend to verify payment
          await axios.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: dbOrder._id, // MongoDB order ID
          });

          alert("✅ Payment successful!");
          navigate("/orders");
        } catch (err) {
          console.error("Verification error:", err);
          alert("❌ Payment verification failed.");
        }
      },
      prefill: {
        name: user?.name || "SnapBuy User",
        email: user?.email || "user@example.com",
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error("Razorpay error:", err);
    alert("❌ Payment failed. Please try again.");
  }
};

// // src/components/BuyNowButton.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { handleRazorpayPayment } from "../../utils/razorpayHandler"; // adjust the import path as necessary
// import { useSelector } from "react-redux"; // if using Redux for user auth

// const BuyNowButton = ({ amount }) => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user.user); // adjust as per your store

//   const handleClick = () => {
//     handleRazorpayPayment({ amount, user, navigate });
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//     >
//       Pay ₹{amount}
//     </button>
//   );
// };

// export default BuyNowButton;




// src/components/BuyNowButton.jsx// src/components/ui/BuyNowButton.jsx
// import React from "react";
// import { useSelector } from "react-redux";
// import { handleRazorpayPayment } from "../../utils/razorpayHandler";

// const BuyNowButton = ({ cart }) => {
//   const user = useSelector((state) => state.user.user); // adjust as needed

//   const handleClick = () => {
//     console.log("BuyNowButton clicked with cart:", cart);
//     if (!cart || !cart.cartItems?.length) return alert("Cart is empty.");
//     handleRazorpayPayment({
//       amount: cart.totalDiscountedPrice,
//       items: cart.cartItems,
//       user,
//       shippingAddress: {
//         address: "123 Demo Street", // For now, hardcoded. You can prompt or fetch this from user profile.
//         city: "Bangalore",
//         postalCode: "560001",
//         country: "India"
//       },
//       paymentMethod: "razorpay"
//     });
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//     >
//       Pay ₹{cart.totalDiscountedPrice}
//     </button>
//   );
// };

// export default BuyNowButton;


import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleRazorpayPayment } from "../../utils/razorpayHandler";

const BuyNowButton = ({ cart }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!cart || !cart.cartItems?.length) {
      alert("Cart is empty.");
      return;
    }

    handleRazorpayPayment({
      amount: cart.totalDiscountedPrice,
      items: cart.cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      user,
      shippingAddress: {
        address: "123 Demo Street", // Replace with form/profile data
        city: "Bangalore",
        postalCode: "560001",
        country: "India",
      },
      paymentMethod: "RAZORPAY", // 🔹 match backend
      navigate, // 🔹 so handler can redirect on success
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      Pay ₹{cart.totalDiscountedPrice}
    </button>
  );
};

export default BuyNowButton;

// import { useEffect, useState } from "react";
// import axios from "../utils/axios"; // your axios setup
// import { Button } from "../components/ui/Button";
// import BuyNowButton from "../components/ui/BuyNowButton";
// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchCart = async () => {
//     try {
//       const res = await axios.get("/cart");
//       setCart(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch cart", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (cartItemId, quantity) => {
//     await axios.patch("/cart/update", { cartItemId, quantity });
//     fetchCart();
//   };

//   const removeItem = async (cartItemId) => {
//     await axios.delete("/cart/remove", { data: { cartItemId } });
//     fetchCart();
//   };

//   const clearCart = async () => {
//     await axios.delete("/cart/clear");
//     fetchCart();
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [cart]);

//   if (loading) return <p>Loading cart...</p>;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

//       {cart?.cartItems?.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cart.cartItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="border rounded-lg p-4 flex justify-between items-center"
//               >
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={item.product.images[0]}
//                     alt={item.product.name}
//                     className="w-16 h-16 object-cover rounded-md"
//                   />
//                   <p className="font-semibold">{item.product.name}</p>
//                   <p>Price: ₹{item.discountedPrice} × {item.quantity}</p>
//                   <p>Subtotal: ₹{item.subtotal}</p>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Button onClick={() => updateQty(item._id, item.quantity + 1)}>+</Button>
//                   <span>{item.quantity}</span>
//                   <Button onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
//                   <Button variant="destructive" onClick={() => removeItem(item._id)}>Remove</Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 border-t pt-4 text-right">
//             <p>Total: ₹{cart.totalDiscountedPrice}</p>
//             <p>You Saved: ₹{cart.totalSaved}</p>
//             <Button onClick={clearCart} className="mt-2">Clear Cart</Button>
//             <BuyNowButton cart={cart} />

//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Button } from "../components/ui/Button";
import BuyNowButton from "../components/ui/BuyNowButton";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");
      setCart(res.data.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (cartItemId, quantity) => {
    await axios.patch("/cart/update", { cartItemId, quantity });
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await axios.delete("/cart/remove", { data: { cartItemId } });
    fetchCart();
  };

  const clearCart = async () => {
    await axios.delete("/cart/clear");
    fetchCart();
  };

  // ✅ FIX: Run once on mount
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {cart?.cartItems?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.cartItems.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <p className="font-semibold">{item.product.name}</p>
                  <p>
                    Price: ₹{item.discountedPrice} × {item.quantity}
                  </p>
                  <p>Subtotal: ₹{item.subtotal}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-right">
            <p>Total: ₹{cart.totalDiscountedPrice}</p>
            <p>You Saved: ₹{cart.totalSaved}</p>
            <Button onClick={clearCart} className="mt-2">
              Clear Cart
            </Button>

            {/* Pass cart to BuyNowButton */}
            <BuyNowButton cart={cart} />
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

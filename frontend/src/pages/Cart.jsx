import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import axios from "../utils/axios";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    if (quantity < 1) return; // Prevent quantity from going below 1
    try {
      await axios.patch("/cart/update", { cartItemId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete("/cart/remove", { data: { cartItemId } });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart/clear");
      fetchCart();
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page or trigger checkout process
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading cart...</p>
      </div>
    );
  }

  // New "Empty Cart" UI
  if (!cart || cart?.cartItems?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <ShoppingBag size={80} className="text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6 text-center">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/">
          <Button className="px-6 py-3 text-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 space-y-6">
          {cart.cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-gray-800">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">
                    Price: ₹{item.discountedPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                    size="sm"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    +
                  </Button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <Button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    size="sm"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </Button>
                </div>
                <p className="font-bold text-lg w-24 text-right">
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            onClick={clearCart}
            variant="destructive"
            className="w-full md:w-auto mt-4"
          >
            Clear Cart
          </Button>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3 h-fit sticky top-24">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <p>Total Items:</p>
                <p className="font-semibold">{cart.cartItems.length}</p>
              </div>
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p className="font-semibold">₹{cart.totalPrice.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <p>You Saved:</p>
                <p>- ₹{cart.totalSaved.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="border-t border-dashed my-4"></div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <p>Total:</p>
              <p>₹{cart.totalDiscountedPrice.toLocaleString('en-IN')}</p>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full mt-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
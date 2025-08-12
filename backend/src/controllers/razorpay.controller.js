// import Razorpay from "razorpay";
// import {asyncHandler, ApiResponse} from "../utils/index.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_SECRET_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY
// });

// export const  createOrder = asyncHandler(async (req, res) => {
//   const { amount, currency = "INR", receipt } = req.body;

//   const options = {
//     amount: amount * 100, // convert to paisa
//     currency,
//     receipt,
//   };

//   const order = await razorpay.orders.create(options);
//   return res.status(200).json(new ApiResponse(200, order, "Order created"));
// });// controllers/payment.controller.js
import Razorpay from "razorpay";
import Order from "../models/order.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import crypto from "crypto";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cart_item.model.js";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_SECRET_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, amount: totalPrice, shippingAddress, paymentMethod } = req.body;
  console.log("Creating Razorpay order with:", {
    items,
    totalPrice,
    shippingAddress,
    paymentMethod,
  });
  if (!items?.length || !totalPrice || !shippingAddress) {
    throw new ApiError(400, "Missing required order details");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: totalPrice * 100,
    currency: "INR",
    receipt: "snapbuy_rcpt_" + Date.now(),
  });

  const newOrder = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    shippingAddress,
    paymentMethod: paymentMethod.toLowerCase(),
    razorpayOrderId: razorpayOrder.id,
    paymentStatus: "PENDING",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { razorpayOrder, dbOrder: newOrder }, "Order created")
    );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  console.log("Verifying payment with:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  });
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    throw new ApiError(400, "Missing verification data");
  }

  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    // mark failed
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "FAILED", orderStatus: "CANCELLED" });
    throw new ApiError(400, "Invalid payment signature");
  }

  // signature valid -> update order as PAID
  const order = await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature
  }, { new: true });

  // Clear user's cart (empty items but keep cart doc)
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    // delete cart items documents
    await CartItem.deleteMany({ cart: cart._id });
    cart.cartItems = [];
    cart.totalActualPrice = 0;
    cart.totalDiscountedPrice = 0;
    cart.totalSaved = 0;
    await cart.save();
  }

  return res.status(200).json(new ApiResponse(200, order, "Payment verified and order updated"));
});

// Optional: Razorpay webhook endpoint (more reliable — verifies request via webhook secret)
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body || {});
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (signature !== expected) {
    return res.status(400).send('invalid signature');
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    // find DB order by razorpayOrderId and mark PAID
    const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpayOrderId }, {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
      razorpayPaymentId: payment.id
    }, { new: true });

    // clear cart same as above if you want (need user context - if order contains user, fine)
    if (order) {
      await CartItem.deleteMany({ cart: order.cartId }).catch(()=>{});
      await Cart.findByIdAndUpdate(order.cartId, { cartItems: [], totalActualPrice:0, totalDiscountedPrice:0 }).catch(()=>{});
    }
  }

  res.json({ ok: true });
});
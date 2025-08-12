import Order from '../models/order.model.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

// Create New Order
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!items?.length || !totalAmount || !shippingAddress) {
    throw new ApiError(400, "Missing required order details");
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

// Get All Orders of Logged-in User
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  console.log("Fetched user orders:", orders);
  res.status(200).json(new ApiResponse(200, orders));
});

// Get Specific Order by ID (owner access only)
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, order));
});

// Admin: Get All Orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const customer_role = req.user.role;
  if(customer_role !== "admin") {
    throw new ApiError(403, "You are not authorized to view all orders");
  }
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders));
});

// Admin: Update Order Status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status || order.status;
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});

import Cart from "../models/cart.model.js";
import CartItem from "../models/cart_item.model.js";
import {Product} from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Add or update item in cart
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, couponCode = null } = req.body;

  if (!productId || quantity < 1) {
    throw new ApiError(400, "Product ID and valid quantity required");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }

  let cartItem = await CartItem.findOne({ cart: cart._id, product: productId });

  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.subtotal = cartItem.discountedPrice * cartItem.quantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      cart: cart._id,
      user: userId,
      product: productId,
      quantity,
      actualPrice: product.price,
      discountedPrice: product.discountedPrice || product.price,
      subtotal: (product.discountedPrice || product.price) * quantity,
      couponCode,
    });

    cart.cartItems.push(cartItem._id);
  }

  await cart.save();

  const fullCart = await Cart.findById(cart._id)
    .populate({
      path: "cartItems",
      populate: { path: "product" },
    })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, fullCart, "Product added to cart"));
});

// ✅ Get cart with items
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "cartItems",
      populate: { path: "product" },
    });

  if (!cart) throw new ApiError(404, "Cart not found");

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// ✅ Update quantity of cart item
// export const updateCartItem = asyncHandler(async (req, res) => {
//   const { cartItemId, quantity } = req.body;
//   console.log(req.body);
//   if (!cartItemId || quantity < 1)
//     throw new ApiError(400, "Valid cartItemId and quantity required");

//   const cartItem = await CartItem.findById(cartItemId);
//   if (!cartItem) throw new ApiError(404, "Cart item not found");

//   cartItem.quantity = quantity;
//   cartItem.subtotal = cartItem.discountedPrice * quantity;
//   await cartItem.save();

//   const cart = await Cart.findById(cartItem.cart).populate({
//     path: "cartItems",
//     populate: { path: "product" },
//   });

//   await cart.save(); // triggers pre-save hook to recalculate totals

//   return res
//     .status(200)
//     .json(new ApiResponse(200, cart, "Cart item updated"));
// });
export const updateCartItem = asyncHandler(async (req, res) => {
  const { cartItemId, quantity } = req.body;
  
  if (!cartItemId || quantity < 1)
    throw new ApiError(400, "Valid cartItemId and quantity required");

  const cartItem = await CartItem.findById(cartItemId);
  console.log(cartItem)
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  cartItem.quantity = quantity;
  cartItem.subtotal = cartItem.discountedPrice * quantity;
  await cartItem.save();

  const cart = await Cart.findById(cartItem.cart).populate({
    path: "cartItems",
    populate: { path: "product" },
  });

  if (!cart) {
    // Optional: clean up orphaned cart items
    await CartItem.findByIdAndDelete(cartItemId);
    throw new ApiError(404, "Associated cart not found");
  }

  await cart.save(); // triggers pre-save hook to recalc totals

  return res.status(200).json(new ApiResponse(200, cart, "Cart item updated"));
});


// ✅ Remove item from cart
export const removeCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.body;
  console.log(req.body); // Debugging line to check request body
  console.log("Removing cart item:", cartItemId); 

  const cartItem = await CartItem.findById(cartItemId);
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  const cart = await Cart.findById(cartItem.cart);
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.cartItems.pull(cartItem._id);
  await cartItem.deleteOne();
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: "cartItems",
    populate: { path: "product" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Cart item removed"));
});

// ✅ Clear all items from cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  await CartItem.deleteMany({ cart: cart._id });

  cart.cartItems = [];
  cart.totalActualPrice = 0;
  cart.totalDiscountedPrice = 0;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    items: [
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }
],
    totalPrice: { type: Number, required: true },

    snapXMembership: { type: mongoose.Schema.Types.ObjectId, ref: "SnapXMembership", default: null },
    snapXDiscountAmount: { type: Number, default: 0 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
    couponDiscountAmount: { type: Number, default: 0 },

    shippingAddress: {
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
},

    paymentMethod: { type: String, enum: ["COD", "CARD", "UPI", "razorpay"], required: true },

    orderStatus: { type: String, enum: ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], default: "PROCESSING" },
    paymentStatus: { type: String, enum: ["PENDING", "COMPLETED", "FAILED"], default: "PENDING" },
  },
  { timestamps: true }
);


// Hook for calculating total price including SnapX discount
orderSchema.pre("save", function (next) {
  if (this.snapXDiscountAmount && this.snapXDiscountAmount > 0) {
    this.totalPrice -= this.snapXDiscountAmount;
  }
  next();
});


const Order = mongoose.model("Order", orderSchema);
export default Order;

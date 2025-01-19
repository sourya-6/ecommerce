const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    snapXMembership: { type: mongoose.Schema.Types.ObjectId, ref: "SnapXMembership", default: null }, // Reference to SnapXMembership model
    snapXDiscountAmount: { type: Number, default: 0 }, // Store SnapX discount value
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null }, // Reference to Coupon model
    couponDiscountAmount: { type: Number, default: 0 }, // Store the coupon discount value
    orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], required: true },
  },
  { timestamps: true }
);


// Hook for calculating total price including SnapX discount
orderSchema.pre("save", function (next) {
  if (this.isModified("isSnapXDiscountApplied")) {
    if (this.isSnapXDiscountApplied) {
      this.totalPrice -= this.snapXDiscountAmount; // Subtract discount
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
